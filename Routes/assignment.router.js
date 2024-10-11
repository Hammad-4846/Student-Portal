// router/assignmentRoutes.js
const express = require('express');
const { getAdminAssignments, acceptAssignment, rejectAssignment } = require('../Controllers/assignment.controller');
const { isAuthenticatedUser } = require('../Middlewares/isAuthenticatedUser.middleware'); // Import auth middleware
const checkRole  = require('../Middlewares/roleCheck.middleware');
const router = express.Router();

// Get all assignments for a specific admin (authenticated admin only)
router.get('/assignments', isAuthenticatedUser, checkRole('admin'), getAdminAssignments);


// Accept an assignment (admin only)
router.put('/assignments/:id/accept', isAuthenticatedUser, checkRole('admin'), acceptAssignment);

// Reject an assignment (admin only)
router.put('/assignments/:id/reject', isAuthenticatedUser, checkRole('admin'), rejectAssignment);

module.exports = router;
