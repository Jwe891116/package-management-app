"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Update packageRoutes.ts
const express_1 = require("express");
const packageController_1 = require("../controllers/packageController");
const router = (0, express_1.Router)();
router.post('/packages/one-day', packageController_1.addOneDayPackage);
router.post('/packages/two-day', packageController_1.addTwoDayPackage);
router.get('/packages/:trackingNumber', packageController_1.getPackageDetails);
router.put('/packages/status', packageController_1.updatePackageStatus);
router.get('/packages', packageController_1.getAllPackages); // Add this new route
exports.default = router;
