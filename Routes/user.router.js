// router/authRoutes.js
const express = require('express');
const { getAllAdmins, uploadAssignment } = require('../Controllers/user.controller');
const { isAuthenticatedUser } = require('../Middlewares/isAuthenticatedUser.middleware');
const checkRole  = require('../Middlewares/roleCheck.middleware');
const router = express.Router();


// Upload assignment (authenticated users only)
router.post('/user/upload', isAuthenticatedUser, checkRole('user'), uploadAssignment);

// Fetch all admins (only authorized Users)
router.get('/user/alladmins',isAuthenticatedUser,checkRole('user') , getAllAdmins);

module.exports = router;
