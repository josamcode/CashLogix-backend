const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const expenseSchema = require("./expense");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: [8, "Username must be at least 8 characters long"],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^01[0-9]{9}$/, "Phone number must be a valid Egyptian number (11 digits starting with 01)"],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    usertype: {
      type: String,
      enum: ["user", "supervisor", "admin"],
      default: "user",
    },
    password2: {
      type: String,
    },
    expenses: [expenseSchema],
  },
  { timestamps: true }
);

function generateRandomPassword(length = 10) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    if (!this.password2) {
      this.password2 = generateRandomPassword();
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", userSchema);
