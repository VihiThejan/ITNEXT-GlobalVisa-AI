import express from 'express';
import { 
  getAllUsers, 
  searchUsers, 
  getUserActivity, 
  getAnalytics,
  getAllCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry,
  toggleCountryStatus,
  generateCountryInfo
} from '../controllers/adminController';

const router = express.Router();

// Admin routes - should be protected by auth middleware
router.get('/users', getAllUsers);
router.get('/users/search', searchUsers);
router.get('/users/:id/activity', getUserActivity);
router.get('/analytics', getAnalytics);

// Country management routes
router.get('/countries', getAllCountries);
router.get('/countries/:id', getCountryById);
router.post('/countries', createCountry);
router.post('/countries/generate', generateCountryInfo);
router.put('/countries/:id', updateCountry);
router.delete('/countries/:id', deleteCountry);
router.patch('/countries/:id/toggle', toggleCountryStatus);

export default router;
