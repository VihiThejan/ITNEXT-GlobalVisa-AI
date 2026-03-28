import { Request, Response } from 'express';
import User from '../models/User';
// Get all users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
        res.status(200).json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users', error: error instanceof Error ? error.message : String(error) });
    }
};

// Search users
export const searchUsers = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const users = await User.find({
            role: { $ne: 'admin' },
            $or: [
                { fullName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json({ users });
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'Failed to search users', error: error instanceof Error ? error.message : String(error) });
    }
};

// Get user activity / details
export const getUserActivity = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        if (!userId || userId.length < 12) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user activity:', error);
        res.status(500).json({ message: 'Failed to fetch user activity', error: error instanceof Error ? error.message : String(error) });
    }
};

// Get analytics
export const getAnalytics = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
        const verifiedUsers = await User.countDocuments({ role: { $ne: 'admin' }, isVerified: true });
        const googleUsers = await User.countDocuments({ provider: 'google' });
        const emailUsers = await User.countDocuments({ provider: 'email' });

        // Users with assessments
        const usersWithAssessments = await User.countDocuments({
            role: { $ne: 'admin' },
            'assessmentHistory.0': { $exists: true }
        });

        // Users with profiles
        const usersWithProfiles = await User.countDocuments({
            role: { $ne: 'admin' },
            'profile.fullName': { $exists: true }
        });

        // Recent signups (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentSignups = await User.countDocuments({
            role: { $ne: 'admin' },
            createdAt: { $gte: thirtyDaysAgo }
        });

        const analytics = {
            totalUsers,
            verifiedUsers,
            googleUsers,
            emailUsers,
            usersWithAssessments,
            usersWithProfiles,
            recentSignups
        };

        res.status(200).json({ analytics });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Failed to fetch analytics', error: error instanceof Error ? error.message : String(error) });
    }
};
