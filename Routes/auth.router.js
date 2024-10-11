// router/authRoutes.js
const express = require('express');
const { userLogin, userRegister, adminRegister, adminLogin } = require('../Controllers/auth.controller');
const router = express.Router();

// Register route for users 
router.post('/auth/user/register', userRegister);

// Login route for users 
router.post('/auth/user/login', userLogin);

// Register route for Admin 
router.post('/auth/admin/register', adminRegister);

// Login route for Admin 
router.post('/auth/admin/login', adminLogin);

module.exports = router;


