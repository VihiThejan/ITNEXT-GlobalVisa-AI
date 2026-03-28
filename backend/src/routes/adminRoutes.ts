import express from 'express';
import { getUsers, searchUsers, getUserActivity, getAnalytics } from '../controllers/adminController';
import {
    getAllCountries,
    getCountryById,
    createCountry,
    updateCountry,
    deleteCountry,
    toggleCountryStatus,
    generateCountryData
} from '../controllers/countryController';

const router = express.Router();

// User management
router.get('/users', getUsers);
router.get('/users/search', searchUsers);
router.get('/users/:userId/activity', getUserActivity);

// Analytics
router.get('/analytics', getAnalytics);

// Country management
router.get('/countries', getAllCountries);
router.get('/countries/:id', getCountryById);
router.post('/countries', createCountry);
router.post('/countries/generate', generateCountryData);
router.put('/countries/:id', updateCountry);
router.delete('/countries/:id', deleteCountry);
router.patch('/countries/:id/toggle', toggleCountryStatus);

export default router;
