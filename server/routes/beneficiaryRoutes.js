import { Router } from 'express';
import { createBeneficiary, listBeneficiaries } from '../controllers/beneficiaryController.js';
import protect from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

router.post('/', protect, authorize('OWNER'), createBeneficiary);
router.get('/', protect, authorize('OWNER'), listBeneficiaries);

export default router;
