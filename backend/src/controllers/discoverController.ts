import { Request, Response } from 'express';
import { discoverUniversitiesAI, discoverJobsAI } from '../services/gemini';

export const discoverUniversities = async (req: Request, res: Response) => {
    try {
        const { profile, criteria } = req.body;

        if (!profile || !criteria) {
            return res.status(400).json({ message: 'Profile and criteria are required' });
        }

        console.log('=== University Discovery Request ===');
        const results = await discoverUniversitiesAI(profile, criteria);
        res.status(200).json({ results });
    } catch (error) {
        console.error('University Discovery Controller Error:', error);
        res.status(500).json({
            message: 'University discovery failed',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const discoverJobs = async (req: Request, res: Response) => {
    try {
        const { profile, criteria } = req.body;

        if (!profile || !criteria) {
            return res.status(400).json({ message: 'Profile and criteria are required' });
        }

        console.log('=== Job Discovery Request ===');
        const results = await discoverJobsAI(profile, criteria);
        res.status(200).json({ results });
    } catch (error) {
        console.error('Job Discovery Controller Error:', error);
        res.status(500).json({
            message: 'Job discovery failed',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
