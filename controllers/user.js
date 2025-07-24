const express = require("express");
const User = require("../models/user");
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const { username, phone, password } = req.body;

    if (!username || username.length < 8) {
      return res.status(400).json({
        error: "Username must be at least 8 characters long....",
      });
    }

    const phoneRegex = /^01[0-9]{9}$/;

    if (!phone || !phoneRegex.test(phone)) {
      return res.status(400).json({
        error:
          "Phone number is invalid. Must be an Egyptian number starting with 01 and 11 digits long.",
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long.",
      });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        error: "Phone number is already registered.",
      });
    }

    const user = new User(req.body);
    const result = await user.save();

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    res.status(201).json({
      message: "Created Successfully",
      token,
      result,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message || err.toString(),
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { phone, password, role } = req.body;

    if (!role || !["user", "supervisor"].includes(role)) {
      return res.status(400).json({ message: "Invalid or missing role" });
    }

    const user = await User.findOne({
      $or: [{ phone: phone }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (role === "user") {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: user._id, role: "user" },
        process.env.JWT_SECRET,
        { expiresIn: "365d" }
      );

      return res.status(200).json({
        message: "User login successful",
        token,
        userInfo: {
          username: user.username,
          phone: user.phone,
          id: user._id,
        },
      });
    } else if (role === "supervisor") {
      if (password !== user.password2) {
        return res.status(401).json({ message: "Invalid supervisor password" });
      }

      const token = jwt.sign(
        { id: user._id, role: "supervisor" },
        process.env.JWT_SECRET,
        { expiresIn: "365d" }
      );

      return res.status(200).json({
        message: "Supervisor login successful",
        token,
        supervisor: {
          username: user.username,
          phone: user.phone,
          id: user._id,
        },
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong",
      error: err.message || err.toString(),
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ usertype: "user" }).select("-password -password2");
    res.status(200).json({ length: users.length, users });
  } catch (err) {
    res.status(500).json({ message: "Failed to get users", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      deletedUser: {
        id: deletedUser._id,
        username: deletedUser.username,
        phone: deletedUser.phone,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};