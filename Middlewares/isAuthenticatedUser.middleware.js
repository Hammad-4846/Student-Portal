// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../Models/user.model");
const Admin = require("../Models/admin.model"); // Import the Admin model
const { error } = require("../Utils/responseWrapper"); // Assuming you have a custom error wrapper

const isAuthenticatedUser = async (req, res, next) => {
  const { growthxtoken } = req.cookies;

  if (!growthxtoken) {
    return res.status(401).send(error(401, "Authentication token is missing"));
  }

  try {
    const decoded = jwt.verify(growthxtoken, process.env.JWT_SECRET_KEY);
    const { role, id } = decoded;

    // Choose the correct model based on the role
    let user;
    if (role === 'admin') {
      user = await Admin.findById(id);
    } else if (role === 'user') {
      user = await User.findById(id);
    } else {
      return res.status(403).send(error(403, "Invalid token"));
    }

    if (!user) {
      return res.status(404).send(error(404, "User not found"));
    }

    
    req.user = user; // Attach the user/admin object to the request
    next(); // Continue to the next middleware or route handler
  } catch (err) {
    return res.status(401).send(error(401, 'Invalid or expired token'));
  }
};

module.exports = { isAuthenticatedUser };
