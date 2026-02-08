import express from 'express';
import {
    submitFeedback,
    getUserFeedback,
    getAllFeedback,
    replyToFeedback,
    updateFeedbackStatus,
    getFeedbackStats
} from '../controllers/feedbackController';

const router = express.Router();

// User routes
router.post('/submit', submitFeedback);
router.get('/user/:userId', getUserFeedback);

// Admin routes
router.get('/admin/all', getAllFeedback);
router.get('/admin/stats', getFeedbackStats);
router.post('/admin/:id/reply', replyToFeedback);
router.patch('/admin/:id/status', updateFeedbackStatus);

export default router;
