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

        // Recent signups (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentUsers = await User.countDocuments({
            role: { $ne: 'admin' },
            createdAt: { $gte: sevenDaysAgo }
        });

        // Get all users with assessment data for aggregation
        const usersWithData = await User.find({
            role: { $ne: 'admin' },
            'assessmentHistory.0': { $exists: true }
        }).select('assessmentHistory');

        // Total assessments across all users
        let totalAssessments = 0;
        let totalScore = 0;
        const countryCount: Record<string, number> = {};

        for (const user of usersWithData) {
            const history = (user as any).assessmentHistory || [];
            totalAssessments += history.length;
            for (const assessment of history) {
                if (assessment.overallScore) {
                    totalScore += assessment.overallScore;
                }
                const country = assessment.targetCountry || assessment.countryName;
                if (country) {
                    countryCount[country] = (countryCount[country] || 0) + 1;
                }
            }
        }

        // Average score
        const averageScore = totalAssessments > 0 ? Math.round(totalScore / totalAssessments) : 0;

        // Active users (those with at least 1 assessment)
        const activeUsers = usersWithData.length;

        // Popular destinations (top 5)
        const popularDestinations = Object.entries(countryCount)
            .map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const analytics = {
            totalUsers,
            totalAssessments,
            recentUsers,
            popularDestinations,
            averageScore,
            activeUsers
        };

        res.status(200).json({ analytics });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Failed to fetch analytics', error: error instanceof Error ? error.message : String(error) });
    }
};

