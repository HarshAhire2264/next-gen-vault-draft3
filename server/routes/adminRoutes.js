import { Router } from 'express';
import { listPendingRegistrations, approveUser, rejectUser } from '../controllers/adminController.js';
import protect from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/registrations', protect, authorize('ADMIN'), listPendingRegistrations);
router.put('/users/:id/approve', protect, authorize('ADMIN'), approveUser);
router.put('/users/:id/reject', protect, authorize('ADMIN'), rejectUser);

export default router;
