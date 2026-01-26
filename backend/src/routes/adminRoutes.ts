import express from 'express';
import { getAllUsers, searchUsers, getUserActivity, getAnalytics } from '../controllers/adminController';

const router = express.Router();

// Admin routes - should be protected by auth middleware
router.get('/users', getAllUsers);
router.get('/users/search', searchUsers);
router.get('/users/:id/activity', getUserActivity);
router.get('/analytics', getAnalytics);

export default router;
