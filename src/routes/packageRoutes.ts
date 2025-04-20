// Update packageRoutes.ts
import { Router } from 'express';
import {
  addOneDayPackage,
  addTwoDayPackage,
  getPackageDetails,
  updatePackageStatus,
  getAllPackages
} from '../controllers/packageController';

const router = Router();

router.post('/packages/one-day', addOneDayPackage);
router.post('/packages/two-day', addTwoDayPackage);
router.get('/packages/:trackingNumber', getPackageDetails);
router.put('/packages/status', updatePackageStatus);
router.get('/packages', getAllPackages); // Add this new route

export default router;