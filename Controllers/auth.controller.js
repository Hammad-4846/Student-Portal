// controllers/authController.js
const User = require("../Models/user.model");
const Admin = require("../Models/admin.model");

const { error } = require("../Utils/responseWrapper");
const sendToken = require("../Utils/tokenHelper");

const { normalizeInput } = require("../Utils/inputValidator"); // Import the normalization function

// Register a new user (user or admin)
const userRegister = async (req, res) => {
  const { username, password, email } = req.body;

  // Check if all required fields are provided
  if (!username || !password || !email) {
    return res.status(400).send(error(400, "All fields are required"));
  }

  // Normalize username and email
  const { normalizedUsername, normalizedEmail } = normalizeInput(
    username,
    email
  );

  try {
    const existingUser = await User.findOne({
      // Check if the user exists, considering both username and email
      $or: [
        { username: { $regex: new RegExp(username, "i") } },
        { email: { $regex: new RegExp(email, "i") } },
      ],
    });
    if (existingUser) {
      return res.status(400).send(error(400, "User already exists"));
    }

    // Hashing the password will be done in the model
    let user = await User.create({
      username: normalizedUsername, //just to avoid confusion ANAS anas, AnAs
      email: normalizedEmail,
      password,
    });

    // Remove the password hash before sending the response
    user.password = undefined;

    // Send the JWT token
    sendToken(user, 201, res);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send(error(500, "Something went wrong. Please try again later."));
  }
};

// Login an existing user
const userLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .send(error(400, "username and password are required"));
  }

  try {
    const user = await User.findOne({
      username: { $regex: new RegExp(username, "i") },
    }).select("+password");

    if (!user) {
      return res.status(400).send(error(400, "Invalid password or username"));
    }

    // Compare the password with the hashed one in the database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send(error(400, "Invalid password or username"));
    }

    // Remove the password hash before sending the response
    user.password = undefined;

    // Send the JWT token

    sendToken(user, 200, res);
  } catch (err) {
    console.log(err);
    res.status(500).send(error(500, "Server error"));
  }
};

// Register a new user (user or admin)
const adminRegister = async (req, res) => {
  const { username, password, email } = req.body;

  // Check if all required fields are provided
  if (!username || !password || !email) {
    return res.status(400).send(error(400, "All fields are required"));
  }

  // Normalize username and email
  const { normalizedUsername, normalizedEmail } = normalizeInput(
    username,
    email
  );

  try {
    // Check if user already exists
    const existingUser = await Admin.findOne({
      // Case-insensitive check for existing user by username or email
      $or: [
        { username: { $regex: new RegExp(username, "i") } },
        { email: { $regex: new RegExp(email, "i") } },
      ],
    });
    if (existingUser) {
      return res.status(400).send(error(400, "Admin already exists"));
    }

    // Hashing the password will be done in the model
    const user = await Admin.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password,
    });

    // Remove the password hash before sending the response
    user.password = undefined;

    // Send the JWT token
    sendToken(user, 201, res);
  } catch (err) {
    console.log(err);
    res.status(500).send(error(500, "Server Error"));
  }
};

// Login an existing user
const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .send(error(400, "username and password are required"));
  }

  try {
    const user = await Admin.findOne({
      username: { $regex: new RegExp(username, "i") },
    }).select("+password");
    if (!user) {
      return res.status(400).send(error(400, "Invalid password or username"));
    }

    // Compare the password with the hashed one in the database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send(error(400, "Invalid password or username"));
    }

    // Remove the password hash before sending the response
    user.password = undefined;

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).send(error(500, "Server error"));
  }
};

module.exports = {
  userLogin,
  userRegister,
  adminRegister,
  adminLogin,
};
