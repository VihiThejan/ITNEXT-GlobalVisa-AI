import express from 'express';
import { discoverUniversities, discoverJobs } from '../controllers/discoverController';

const router = express.Router();

router.post('/universities', discoverUniversities);
router.post('/jobs', discoverJobs);

export default router;
