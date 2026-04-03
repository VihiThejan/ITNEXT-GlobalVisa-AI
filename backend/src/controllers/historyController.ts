import { Request, Response } from 'express';
import User from '../models/User';

export const saveUniSearch = async (req: Request, res: Response) => {
    try {
        const { userId, record } = req.body;

        if (!userId || !record) {
            return res.status(400).json({ message: 'UserId and record are required' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { uniSearchHistory: record } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'University search history saved successfully', result: user });
    } catch (error) {
        console.error('Save Uni Search Error:', error);
        res.status(500).json({ message: 'Error saving university search history', error });
    }
};

export const saveJobSearch = async (req: Request, res: Response) => {
    try {
        const { userId, record } = req.body;

        if (!userId || !record) {
            return res.status(400).json({ message: 'UserId and record are required' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { jobSearchHistory: record } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Job search history saved successfully', result: user });
    } catch (error) {
        console.error('Save Job Search Error:', error);
        res.status(500).json({ message: 'Error saving job search history', error });
    }
};

export const saveCountryView = async (req: Request, res: Response) => {
    try {
        const { userId, record } = req.body;

        if (!userId || !record) {
            return res.status(400).json({ message: 'UserId and record are required' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { countryViewHistory: record } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Country view history saved successfully', result: user });
    } catch (error) {
        console.error('Save Country View Error:', error);
        res.status(500).json({ message: 'Error saving country view history', error });
    }
};
