import { Request, Response } from 'express';
import User from '../models/User';

export const saveAssessment = async (req: Request, res: Response) => {
    console.log('=== SAVE ASSESSMENT ===');
    console.log('Body:', req.body);

    try {
        const { userId, assessment } = req.body;

        if (!userId || !assessment) {
            return res.status(400).json({ message: 'userId and assessment are required' });
        }

        // Add assessment to user's assessmentHistory array
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { assessmentHistory: assessment } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Assessment saved successfully for user:', userId);
        res.status(200).json({ result: user, message: 'Assessment saved' });

    } catch (error) {
        console.error('Save Assessment Error:', error);
        res.status(500).json({ message: 'Failed to save assessment', error: error instanceof Error ? error.message : String(error) });
    }
};

export const getAssessments = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ assessments: (user as any).assessmentHistory || [] });

    } catch (error) {
        console.error('Get Assessments Error:', error);
        res.status(500).json({ message: 'Failed to get assessments', error: error instanceof Error ? error.message : String(error) });
    }
};
