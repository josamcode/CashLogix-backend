const express = require("express");
const router = express.Router();
const {
  createUser,
  getUser,
  // updateUser,
  // deleteUser,
  loginUser,
} = require("../controllers/user");

const { verifyToken } = require("../middlewares/auth");

// POST /createUser
router.post("/auth/register", createUser);
router.get("/getUser", verifyToken, getUser);
// router.put("/updateUser/:id", updateUser);
// router.delete("/deleteUser/:id", deleteUser);
router.post("/auth/login", loginUser);

module.exports = router;
