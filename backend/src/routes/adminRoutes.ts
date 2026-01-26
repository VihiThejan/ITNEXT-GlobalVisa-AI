import express from 'express';
import { getAllUsers, searchUsers, getUserActivity } from '../controllers/adminController';

const router = express.Router();

// Admin routes - should be protected by auth middleware
router.get('/users', getAllUsers);
router.get('/users/search', searchUsers);
router.get('/users/:id/activity', getUserActivity);

export default router;
