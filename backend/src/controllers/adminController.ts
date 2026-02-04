import { Request, Response } from 'express';
import User from '../models/User';
import Country from '../models/Country';

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

// Country Management
export const getAllCountries = async (req: Request, res: Response) => {
    console.log('=== GET ALL COUNTRIES ===');

    try {
        const countries = await Country.find().sort({ name: 1 });
        console.log(`Found ${countries.length} countries`);
        res.status(200).json({ countries });
    } catch (error) {
        console.error('Get All Countries Error:', error);
        res.status(500).json({ message: 'Failed to fetch countries', error: error instanceof Error ? error.message : String(error) });
    }
};

export const getCountryById = async (req: Request, res: Response) => {
    console.log('=== GET COUNTRY BY ID ===');
    const { id } = req.params;

    try {
        const country = await Country.findOne({ id });
        if (!country) {
            return res.status(404).json({ message: 'Country not found' });
        }
        res.status(200).json({ country });
    } catch (error) {
        console.error('Get Country Error:', error);
        res.status(500).json({ message: 'Failed to fetch country', error: error instanceof Error ? error.message : String(error) });
    }
};

export const createCountry = async (req: Request, res: Response) => {
    console.log('=== CREATE COUNTRY ===');
    const countryData = req.body;

    try {
        // Check if country with this ID already exists
        const existingCountry = await Country.findOne({ id: countryData.id });
        if (existingCountry) {
            return res.status(400).json({ message: 'Country with this ID already exists' });
        }

        const country = new Country(countryData);
        await country.save();

        console.log('Country created:', country.id);
        res.status(201).json({ country, message: 'Country created successfully' });
    } catch (error) {
        console.error('Create Country Error:', error);
        res.status(500).json({ message: 'Failed to create country', error: error instanceof Error ? error.message : String(error) });
    }
};

export const updateCountry = async (req: Request, res: Response) => {
    console.log('=== UPDATE COUNTRY ===');
    const { id } = req.params;
    const updateData = req.body;

    try {
        const country = await Country.findOneAndUpdate(
            { id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!country) {
            return res.status(404).json({ message: 'Country not found' });
        }

        console.log('Country updated:', country.id);
        res.status(200).json({ country, message: 'Country updated successfully' });
    } catch (error) {
        console.error('Update Country Error:', error);
        res.status(500).json({ message: 'Failed to update country', error: error instanceof Error ? error.message : String(error) });
    }
};

export const deleteCountry = async (req: Request, res: Response) => {
    console.log('=== DELETE COUNTRY ===');
    const { id } = req.params;

    try {
        const country = await Country.findOneAndDelete({ id });

        if (!country) {
            return res.status(404).json({ message: 'Country not found' });
        }

        console.log('Country deleted:', id);
        res.status(200).json({ message: 'Country deleted successfully' });
    } catch (error) {
        console.error('Delete Country Error:', error);
        res.status(500).json({ message: 'Failed to delete country', error: error instanceof Error ? error.message : String(error) });
    }
};

export const toggleCountryStatus = async (req: Request, res: Response) => {
    console.log('=== TOGGLE COUNTRY STATUS ===');
    const { id } = req.params;

    try {
        const country = await Country.findOne({ id });

        if (!country) {
            return res.status(404).json({ message: 'Country not found' });
        }

        country.isActive = !country.isActive;
        await country.save();

        console.log('Country status toggled:', id, country.isActive);
        res.status(200).json({ country, message: `Country ${country.isActive ? 'activated' : 'deactivated'} successfully` });
    } catch (error) {
        console.error('Toggle Country Status Error:', error);
        res.status(500).json({ message: 'Failed to toggle country status', error: error instanceof Error ? error.message : String(error) });
    }
};
