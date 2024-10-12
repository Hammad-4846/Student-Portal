const { default: mongoose } = require("mongoose");
const Admin = require("../Models/admin.model");
const Assignment = require("../Models/assignment.model");
const { success,error } = require("../Utils/responseWrapper");

// Get all admins (for user to assign tasks to them)
const getAllAdmins = async (req, res) => {
  try {
    // Fetch all users with the role of 'admin', but do not return password or sensitive info
    
    const admins = await Admin.find();
    if (!admins || admins.length === 0) {
      return res.status(404).send(error(404, "No admins found"));
    }
    res.status(200).send(success(200, admins));
  } catch (err) {
    console.log(err);
    res.status(500).send(error(500, "Server error"));
  }
};

// Upload an assignment (by user)
const uploadAssignment = async (req, res) => {
  const { task, adminId } = req.body;
  const userId = req.user._id;

  if(!task || !adminId) {
    return res.status(400).json(error(400, "Task and adminId are required"));
  }

  if(!mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json(error(400, "Invalid adminId format"));
  }

  try {
    const assignment = new Assignment({
      userId,
      task,
      adminId,
    });
    await assignment.save();
    res.status(201).json(success(201, assignment));
  } catch (err) {
    console.log(err);
    res.status(500).json(error(500, "Server error"));
  }
};


module.exports = {
  uploadAssignment,
  getAllAdmins,
}