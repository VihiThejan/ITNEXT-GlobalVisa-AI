import { Request, Response } from 'express';
import Activity from '../models/Activity';

export const logActivity = async (req: Request, res: Response) => {
    try {
        const { userId, type, details } = req.body;

        // Validate required fields
        if (!userId || !type) {
            return res.status(400).json({ message: "UserId and Type are required" });
        }

        const activity = new Activity({
            user: userId,
            type,
            details
        });

        await activity.save();
        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ message: 'Error logging activity', error });
    }
};

export const getUserActivity = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const activities = await Activity.find({ user: userId }).sort({ timestamp: -1 });
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities', error });
    }
};

export const getAllActivities = async (req: Request, res: Response) => {
    try {
        // Populate user details for admin view
        const activities = await Activity.find()
            .populate('user', 'fullName email')
            .sort({ timestamp: -1 })
            .limit(100); // Limit to recent 100 for performance

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities', error });
    }
};
