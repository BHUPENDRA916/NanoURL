import { Router } from 'express';
import * as urlController from '../controllers/urlController.js';

const router = Router();

// API routes
router.post('/api/shorten', urlController.createUrl);
router.get('/api/urls', urlController.getAllUrls);
router.get('/api/urls/:shortCode/analytics', urlController.getAnalytics);
router.delete('/api/urls/:shortCode', urlController.deleteUrl);

// Redirect route (must be last to avoid conflicts)
router.get('/:shortCode', urlController.redirectUrl);

export default router;
