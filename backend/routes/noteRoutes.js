// routes/notesRoutes.js

import express from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import Note from "../models/Note.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Get all notes of logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// 🔹 Get all public notes
router.get("/public", async (req, res) => {
  try {
    const notes = await Note.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .populate("owner", "username");
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// 🔹 Get a single note (public or owned by user)
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate("owner", "username");
    if (!note) return res.status(404).json({ msg: "Not found" });

    if (note.isPublic) return res.json(note);

    const header = req.header("Authorization");
    if (!header) return res.status(403).json({ msg: "Not allowed" });

    const token = header.split(" ")[1] || header;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      if (decoded.user.id !== note.owner._id.toString()) {
        return res.status(403).json({ msg: "Not allowed" });
      }
      return res.json(note);
    } catch (e) {
      return res.status(403).json({ msg: "Not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// 🔹 Create a new note
router.post(
  "/",
  auth,
  [body("title").notEmpty(), body("content").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { title, content, isPublic } = req.body;
      const note = new Note({
        title,
        content,
        isPublic: !!isPublic,
        owner: req.user.id,
      });
      await note.save();
      res.json(note);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

// 🔹 Update a note
router.put("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ msg: "Not found" });
    if (note.owner.toString() !== req.user.id) return res.status(403).json({ msg: "Not allowed" });

    const { title, content, isPublic } = req.body;
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (isPublic !== undefined) note.isPublic = !!isPublic;

    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// 🔹 Delete a note
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ msg: "Not found" });
    if (note.owner.toString() !== req.user.id) return res.status(403).json({ msg: "Not allowed" });

    await note.deleteOne();
    res.json({ msg: "Removed" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
