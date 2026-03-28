import express from 'express';
import { getUsers, searchUsers, getUserActivity, getAnalytics } from '../controllers/adminController';

const router = express.Router();

// User management
router.get('/users', getUsers);
router.get('/users/search', searchUsers);
router.get('/users/:userId/activity', getUserActivity);

// Analytics
router.get('/analytics', getAnalytics);

export default router;
