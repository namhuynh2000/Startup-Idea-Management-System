const express = require('express');
const router = express.Router();
const { protect, adminProtect } = require('../middleware/authMiddleware');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getPendingDeletionRequests,
  requestProjectDeletion,
  approveDeletion,
  rejectDeletion,
} = require('../controllers/projectController');

// Deletion request endpoints - must be before /:id to match correctly
router.get('/admin/deletion-requests', adminProtect, getPendingDeletionRequests);

router.route('/').get(protect, getProjects).post(protect, createProject);

// ID-based routes
router.post('/:id/request-deletion', protect, requestProjectDeletion);
router.post('/:id/approve-deletion', adminProtect, approveDeletion);
router.post('/:id/reject-deletion', adminProtect, rejectDeletion);
router.route('/:id').get(protect, getProjectById).put(protect, updateProject).delete(protect, deleteProject);

module.exports = router;
