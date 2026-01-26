import express from 'express';
import { updateProfile, getProfile } from '../controllers/profileController';

const router = express.Router();

router.put('/update', updateProfile);
router.get('/:userId', getProfile);

export default router;
