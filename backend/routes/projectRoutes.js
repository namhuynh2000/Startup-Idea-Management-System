const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createProject, getProjects } = require('../controllers/projectController');

router.route('/').get(protect, getProjects).post(protect, createProject);

module.exports = router;
