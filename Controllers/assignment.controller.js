// controllers/assignmentController.js
const { default: mongoose } = require('mongoose');
const Assignment = require('../Models/assignment.model');
const { success, error } = require('../Utils/responseWrapper');  // Import the response wrapper

// Get assignments for a specific admin
const getAdminAssignments = async (req, res) => {
    const adminId = req.user._id;

    try {
        const assignments = await Assignment.find({ adminId }).populate('userId', 'username');
        if(assignments?.length === 0) {
            return res.status(200).send(send(200, 'As of now, No Assignments Found'));
        }
        res.json(success(200, assignments));
    } catch (err) {
        console.log("Server error",err.message);
        res.status(500).send(error(500, 'Server error'));
    }
};

// Accept an assignment
const acceptAssignment = async (req, res) => {
    const assignmentId = req.params.id;

    // Check if assignmentId is valid
    if (!assignmentId  || assignmentId.trim() === '') {
        return res.status(400).json(error(400, 'Assignment ID is required and cannot be empty or undefined'));
    }

    // Check if assignmentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
        return res.status(400).json(error(400, 'Invalid Assignment ID format'));
    }

    try {
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment || assignment.adminId.toString() !== req.user._id.toString()) {
            return res.status(404).json(error(404, 'Assignment not found or unauthorized'));
        }

        assignment.status = 'accepted';
        await assignment.save();
        res.json(success(200, { message: 'Assignment accepted', assignment }));
    } catch (err) {
        console.log("Server error",err.message);
        res.status(500).json(error(500, 'Server error'));
    }
};

// Reject an assignment
const rejectAssignment = async (req, res) => {
    const assignmentId = req.params.id;

      // Check if assignmentId is valid
      if (!assignmentId || assignmentId.trim() === '') {
        return res.status(400).json(error(400, 'Assignment ID is required and cannot be empty or undefined'));
    }

    // Check if assignmentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
        return res.status(400).json(error(400, 'Invalid Assignment ID format'));
    }

    try {
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment || assignment.adminId.toString() !== req.user._id.toString()) {
            return res.status(404).json(error(404, 'Assignment not found or unauthorized'));
        }

        assignment.status = 'rejected';
        await assignment.save();
        res.json(success(200, { message: 'Assignment rejected', assignment }));
    } catch (err) {
        res.status(500).json(error(500, 'Server error'));
    }
};

module.exports = {
    getAdminAssignments,
    acceptAssignment,
    rejectAssignment,
};
