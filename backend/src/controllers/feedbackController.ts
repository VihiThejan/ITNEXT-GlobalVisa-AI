import { Request, Response } from 'express';
import Feedback from '../models/Feedback';
import User from '../models/User';

// User submits feedback
export const submitFeedback = async (req: Request, res: Response) => {
    console.log('=== SUBMIT FEEDBACK ===');
    const { userId, message, category } = req.body;

    try {
        if (!userId || !message) {
            return res.status(400).json({ message: 'User ID and message are required' });
        }

        // Create feedback - user reference will be validated by Mongoose schema
        const feedback = new Feedback({
            user: userId,
            message,
            category: category || 'general',
            status: 'pending'
        });

        await feedback.save();
        console.log('Feedback submitted:', feedback._id);

        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback
        });

    } catch (error) {
        console.error('Submit Feedback Error:', error);
        res.status(500).json({
            message: 'Failed to submit feedback',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

// User gets their own feedback history
export const getUserFeedback = async (req: Request, res: Response) => {
    console.log('=== GET USER FEEDBACK ===');
    const { userId } = req.params;

    try {
        const feedbacks = await Feedback.find({ user: userId })
            .populate('replies.admin', 'fullName email')
            .sort({ createdAt: -1 });

        console.log(`Found ${feedbacks.length} feedback items for user ${userId}`);
        res.status(200).json({ feedbacks });

    } catch (error) {
        console.error('Get User Feedback Error:', error);
        res.status(500).json({
            message: 'Failed to fetch feedback',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

// Admin gets all feedback
export const getAllFeedback = async (req: Request, res: Response) => {
    console.log('=== GET ALL FEEDBACK ===');
    const { status } = req.query;

    try {
        const query = status ? { status } : {};

        const feedbacks = await Feedback.find(query)
            .populate('user', 'fullName email avatar')
            .populate('replies.admin', 'fullName email')
            .sort({ createdAt: -1 });

        console.log(`Found ${feedbacks.length} feedback items`);
        res.status(200).json({ feedbacks });

    } catch (error) {
        console.error('Get All Feedback Error:', error);
        res.status(500).json({
            message: 'Failed to fetch feedback',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

// Admin replies to feedback
export const replyToFeedback = async (req: Request, res: Response) => {
    console.log('=== REPLY TO FEEDBACK ===');
    const { id } = req.params;
    const { adminId, message } = req.body;

    try {
        if (!adminId || !message) {
            return res.status(400).json({ message: 'Admin ID and message are required' });
        }

        // Verify admin exists
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized: Admin access required' });
        }

        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Add reply
        feedback.replies.push({
            admin: adminId,
            message,
            timestamp: new Date()
        } as any);

        // Update status to replied if it was pending
        if (feedback.status === 'pending') {
            feedback.status = 'replied';
        }

        await feedback.save();

        // Populate the feedback with user and admin details
        const populatedFeedback = await Feedback.findById(id)
            .populate('user', 'fullName email avatar')
            .populate('replies.admin', 'fullName email');

        console.log('Reply added to feedback:', id);
        res.status(200).json({
            message: 'Reply added successfully',
            feedback: populatedFeedback
        });

    } catch (error) {
        console.error('Reply to Feedback Error:', error);
        res.status(500).json({
            message: 'Failed to reply to feedback',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

// Admin updates feedback status
export const updateFeedbackStatus = async (req: Request, res: Response) => {
    console.log('=== UPDATE FEEDBACK STATUS ===');
    const { id } = req.params;
    const { status } = req.body;

    try {
        if (!['pending', 'replied', 'closed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const feedback = await Feedback.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )
            .populate('user', 'fullName email avatar')
            .populate('replies.admin', 'fullName email');

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        console.log('Feedback status updated:', id, status);
        res.status(200).json({
            message: 'Status updated successfully',
            feedback
        });

    } catch (error) {
        console.error('Update Feedback Status Error:', error);
        res.status(500).json({
            message: 'Failed to update feedback status',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

// Get feedback count by status (for dashboard stats)
export const getFeedbackStats = async (req: Request, res: Response) => {
    console.log('=== GET FEEDBACK STATS ===');

    try {
        const pending = await Feedback.countDocuments({ status: 'pending' });
        const replied = await Feedback.countDocuments({ status: 'replied' });
        const closed = await Feedback.countDocuments({ status: 'closed' });
        const total = await Feedback.countDocuments();

        const stats = { pending, replied, closed, total };
        console.log('Feedback stats:', stats);

        res.status(200).json({ stats });

    } catch (error) {
        console.error('Get Feedback Stats Error:', error);
        res.status(500).json({
            message: 'Failed to fetch feedback stats',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
