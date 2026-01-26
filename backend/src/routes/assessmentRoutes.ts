import express from 'express';
import { generateAssessment } from '../controllers/assessmentController';
import { saveAssessment, getAssessments } from '../controllers/assessmentSaveController';

const router = express.Router();

router.post('/generate', generateAssessment);
router.post('/save', saveAssessment);
router.get('/history/:userId', getAssessments);

export default router;
