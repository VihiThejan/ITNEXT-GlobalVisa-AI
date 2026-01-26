import express from 'express';
import { generateAssessment } from '../controllers/assessmentController';

const router = express.Router();

router.post('/generate', generateAssessment);

export default router;
