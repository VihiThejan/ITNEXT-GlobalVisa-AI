import { Request, Response } from 'express';
import { generateAssessmentAI } from '../services/gemini';
import Activity from '../models/Activity';

export const generateAssessment = async (req: Request, res: Response) => {
    try {
        const { profile, countryName, userId } = req.body;

        if (!profile || !countryName) {
            return res.status(400).json({ message: "Profile and countryName are required" });
        }

        // Call AI Service
        const aiResult = await generateAssessmentAI(profile, countryName);

        // Enrich result with ID and metadata
        const assessmentResult = {
            ...aiResult,
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            targetCountry: countryName,
            targetVisaCategory: aiResult.eligibleVisas?.[0]?.visaName || "General Assessment"
        };

        // Log Activity if userId is present
        if (userId) {
            try {
                await Activity.create({
                    user: userId,
                    type: 'ASSESSMENT_GENERATED',
                    details: {
                        country: countryName,
                        score: aiResult.overallScore,
                        status: aiResult.status,
                        visa: assessmentResult.targetVisaCategory
                    }
                });
            } catch (logErr) {
                console.error("Failed to log assessment activity:", logErr);
            }
        }

        res.status(200).json(assessmentResult);

    } catch (error) {
        console.error("Assessment Generation Error:", error);
        res.status(500).json({ message: 'Failed to generate assessment', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};
