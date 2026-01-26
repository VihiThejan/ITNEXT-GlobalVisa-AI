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
