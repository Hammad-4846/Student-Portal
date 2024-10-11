const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures usernames are unique among admins
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
    select: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// Hash password before saving user to database
adminSchema.pre("save", async function (next) {
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
adminSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

//JWT TOKEN
adminSchema.methods.getJWTToken = function () {
  return jwt.sign(
    { id: this._id, role: "admin" }, // role: 'admin'
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRATION_TIME || '1h',
    }
  );
};

const Admin = mongoose.model("GrowtXAdmin", adminSchema);
module.exports = Admin;

