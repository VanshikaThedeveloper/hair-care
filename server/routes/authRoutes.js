const express = require('express');
const router = express.Router();
const {
    register, login, refreshToken, logout,
    forgotPassword, resetPassword, getMe, updateProfile, changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation rules
const registerValidation = [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);
router.post('/forgot-password', body('email').isEmail(), forgotPassword);
router.put('/reset-password/:token', body('password').isLength({ min: 8 }), resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
