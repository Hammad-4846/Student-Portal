const { error } = require("../Utils/responseWrapper");
const sendToken = require("../Utils/tokenHelper");
const { normalizeInput } = require("../Utils/inputValidator"); // Import the normalization function
const {getModelFromPath} = require("../Utils/authApiHelper")//To choose User or Admin model based on the route

// General register function for both users and admins
const register = async (req, res) => {
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
    const Model = getModelFromPath(req); // Choose User or Admin schema based on the route

    const existingUser = await Model.findOne({
      $or: [
        { username: { $regex: new RegExp(username, "i") } },
        { email: { $regex: new RegExp(email, "i") } },
      ],
    });
    if (existingUser) {
      return res.status(400).send(error(400, `${Model.modelName} already exists`));
    }

    // Create a new user/admin
    const user = await Model.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password,
    });

    user.password = undefined; // Remove password hash from response

    // Send the JWT token
    sendToken(user, 201, res);
  } catch (err) {
    console.log(err);
    res.status(500).send(error(500, "Server Error"));
  }
};

// General login function for both users and admins
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .send(error(400, "username and password are required"));
  }

  try {
    const Model = getModelFromPath(req); // Choose User or Admin schema based on the route

    const user = await Model.findOne({
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

    user.password = undefined; // Remove password hash from response

    sendToken(user, 200, res);
  } catch (err) {
    console.log(err);
    res.status(500).send(error(500, "Server error"));
  }
};

module.exports = {
  login,
  register,
};
