// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const header = req.header("Authorization");
  if (!header) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = header.split(" ")[1] || header;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

export default authMiddleware;
