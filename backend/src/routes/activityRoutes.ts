import express from 'express';
import { logActivity, getUserActivity, getAllActivities } from '../controllers/activityController';

const router = express.Router();

router.post('/log', logActivity); // Public/Protected? We'll secure it later or rely on client sending ID for now.
router.get('/user/:userId', getUserActivity);
router.get('/all', getAllActivities); // Admin only ideally

export default router;
