import express from 'express';
import { getAllUsers, getUserDetails } from '../controllers/userController';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserDetails);

export default router;
