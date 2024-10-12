// router/authRoutes.js
const express = require('express');
const { login, register } = require('../Controllers/auth.controller');
const router = express.Router();

// Register route for users and admins
router.post('/auth/user/register', register);
router.post('/auth/admin/register', register);

// Login route for users and admins
router.post('/auth/user/login', login);
router.post('/auth/admin/login', login);


module.exports = router;


