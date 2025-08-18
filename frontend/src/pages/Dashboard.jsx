import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "https://my-notesapp-1.onrender.com/api";


export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    if (!token) return;
    try {
      const res = await fetch(`${API}/notes`, {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      setNotes(data || []);
    } catch (err) {
      console.error("❌ Error loading notes:", err);
    }
  }

  async function createNote() {
    try {
      const res = await fetch(`${API}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ title, content, isPublic }),
      });
      if (res.ok) {
        setTitle("");
        setContent("");
        setIsPublic(false);
        load();
      }
    } catch (err) {
      console.error("❌ Error creating note:", err);
    }
  }

  async function del(id) {
    try {
      await fetch(`${API}/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      load();
    } catch (err) {
      console.error("❌ Error deleting note:", err);
    }
  }

  async function edit(n) {
    const t = prompt("Title", n.title);
    const c = prompt("Content", n.content);
    const p = confirm("Make public?");
    if (t !== null) {
      try {
        await fetch(`${API}/notes/${n._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ title: t, content: c, isPublic: p }),
        });
        load();
      } catch (err) {
        console.error("❌ Error editing note:", err);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-6 text-center">
          My Notes
        </h2>

        {/* Notes list */}
        <div className="grid gap-4">
          {notes.map((n) => (
            <div
              key={n._id}
              className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg relative"
            >
              {/* Title + badge */}
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-gray-800">{n.title}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    n.isPublic
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {n.isPublic ? "Public 🔓" : "Private 🔒"}
                </span>
              </div>

              {/* Content */}
              <p className="text-gray-600 mt-2">{n.content}</p>

              {/* Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => edit(n)}
                  className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => del(n._id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
                >
                  Delete
                </button>
              </div>

              {/* Timestamp */}
              <p className="text-xs text-gray-500 absolute bottom-2 right-3">
                Last updated: {new Date(n.updatedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Create note form */}
        <div className="mt-8 bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <h3 className="font-semibold text-xl text-gray-800 mb-4">
            Create Note
          </h3>
          <input
            className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 accent-indigo-600"
            />
            <span className="text-gray-700">Make public</span>
          </label>

          <button
            onClick={createNote}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition duration-300"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
