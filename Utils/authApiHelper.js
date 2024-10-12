const Admin = require("../Models/admin.model");
const User = require("../Models/user.model");



const getModelFromPath = (req) => {
  return req.path.includes("/admin") ? Admin : User;
};

module.exports = {
  getModelFromPath,
};
