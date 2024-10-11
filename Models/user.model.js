// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },

  email: {
    type: String,
    required: true,
    unique: true, // Ensures emails are unique among admins
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving user to database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password for login
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

//JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id, role: "user" }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });
};

const User = mongoose.model("GrowtXUser", userSchema);
module.exports = User;
