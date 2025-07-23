const express = require("express");
const router = express.Router();
const {
  createUser,
  getUser,
  loginUser,
} = require("../controllers/user");

const { verifyToken, allowAdminOnly } = require("../middlewares/auth");

// POST /createUser
router.post("/auth/register", createUser);
router.get("/getUser", verifyToken, getUser);
router.post("/auth/login", loginUser);

module.exports = router;