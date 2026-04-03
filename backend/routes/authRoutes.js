
const express = require('express');
const { registerUser, loginUser, updateUserProfile, getProfile, getDisputes, getActivations, activateUser } = require('../controllers/authController');
const { protect, adminProtect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);

// Admin routes
router.get('/admin/disputes', adminProtect, getDisputes);
router.get('/admin/activations', adminProtect, getActivations);
router.post('/admin/activate/:userId', adminProtect, activateUser);

module.exports = router;
