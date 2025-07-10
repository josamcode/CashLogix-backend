// middlewares/auth.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

const allowUserOnly = (req, res, next) => {
  if (req.user.role !== "user") {
    return res
      .status(403)
      .json({ message: "Access denied for this operation." });
  }
  next();
};

module.exports = {
  verifyToken,
  allowUserOnly,
};
