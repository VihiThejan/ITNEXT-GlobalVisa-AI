import express from 'express';
import { saveUniSearch, saveJobSearch, saveCountryView } from '../controllers/historyController';

const router = express.Router();

router.post('/uni-search', saveUniSearch);
router.post('/job-search', saveJobSearch);
router.post('/country-view', saveCountryView);

export default router;
