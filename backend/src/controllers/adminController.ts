import { Request, Response } from 'express';
import User from '../models/User';

export const getAllUsers = async (req: Request, res: Response) => {
    console.log('=== GET ALL USERS ===');

    try {
        const users = await User.find({ role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 });

        console.log(`Found ${users.length} users`);
        res.status(200).json({ users });

    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({ message: 'Failed to fetch users', error: error instanceof Error ? error.message : String(error) });
    }
};

export const searchUsers = async (req: Request, res: Response) => {
    console.log('=== SEARCH USERS ===');
    const { q } = req.query;
    console.log('Search query:', q);

    try {
        const query = q ? {
            role: 'user',
            $or: [
                { fullName: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        } : { role: 'user' };

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        console.log(`Found ${users.length} matching users`);
        res.status(200).json({ users });

    } catch (error) {
        console.error('Search Users Error:', error);
        res.status(500).json({ message: 'Failed to search users', error: error instanceof Error ? error.message : String(error) });
    }
};

export const getUserActivity = async (req: Request, res: Response) => {
    console.log('=== GET USER ACTIVITY ===');
    const { id } = req.params;
    console.log('User ID:', id);

    try {
        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });

    } catch (error) {
        console.error('Get User Activity Error:', error);
        res.status(500).json({ message: 'Failed to get user activity', error: error instanceof Error ? error.message : String(error) });
    }
};

export const getAnalytics = async (req: Request, res: Response) => {
    console.log('=== GET ANALYTICS ===');

    try {
        const totalUsers = await User.countDocuments({ role: 'user' });

        // Get total assessments across all users
        const usersWithAssessments = await User.find({ role: 'user', assessmentHistory: { $exists: true, $ne: [] } });
        const totalAssessments = usersWithAssessments.reduce((sum, user: any) => sum + (user.assessmentHistory?.length || 0), 0);

        // Get recent users (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentUsers = await User.countDocuments({ role: 'user', createdAt: { $gte: sevenDaysAgo } });

        // Get popular destinations (from assessments)
        const countryStats: { [key: string]: number } = {};
        usersWithAssessments.forEach((user: any) => {
            user.assessmentHistory?.forEach((assessment: any) => {
                const country = assessment.countryName || assessment.targetCountry;
                if (country) {
                    countryStats[country] = (countryStats[country] || 0) + 1;
                }
            });
        });

        const popularDestinations = Object.entries(countryStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([country, count]) => ({ country, count }));

        // Calculate average score
        let totalScore = 0;
        let scoreCount = 0;
        usersWithAssessments.forEach((user: any) => {
            user.assessmentHistory?.forEach((assessment: any) => {
                if (assessment.overallScore) {
                    totalScore += assessment.overallScore;
                    scoreCount++;
                }
            });
        });
        const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

        const analytics = {
            totalUsers,
            totalAssessments,
            recentUsers,
            popularDestinations,
            averageScore,
            activeUsers: usersWithAssessments.length
        };

        console.log('Analytics:', analytics);
        res.status(200).json({ analytics });

    } catch (error) {
        console.error('Get Analytics Error:', error);
        res.status(500).json({ message: 'Failed to get analytics', error: error instanceof Error ? error.message : String(error) });
    }
};
