const express = require("express");
const router = express.Router();
const {
  createUser,
  getUser,
  loginUser,
  getAllUsers,
  deleteUser,
} = require("../controllers/user");

const { verifyToken, allowAdminOnly } = require("../middlewares/auth");

// POST /createUser
router.post("/auth/register", createUser);
router.get("/getUser", verifyToken, getUser);
router.post("/auth/login", loginUser);

router.get("/getUsers", verifyToken, getAllUsers);
// router.delete("/deleteUser/:id", verifyToken, allowAdminOnly, deleteUser);

module.exports = router;
