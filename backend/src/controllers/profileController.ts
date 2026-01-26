import { Request, Response } from 'express';
import User from '../models/User';

export const updateProfile = async (req: Request, res: Response) => {
    console.log('=== UPDATE PROFILE ===');
    console.log('Body:', req.body);

    try {
        const { userId, profile } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { profile } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Profile updated successfully for user:', userId);
        res.status(200).json({ result: user });

    } catch (error) {
        console.error('Profile Update Error:', error);
        res.status(500).json({ message: 'Failed to update profile', error: error instanceof Error ? error.message : String(error) });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ result: user });

    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Failed to get profile', error: error instanceof Error ? error.message : String(error) });
    }
};
