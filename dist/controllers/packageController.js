"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPackages = exports.updatePackageStatus = exports.getPackageDetails = exports.addTwoDayPackage = exports.addOneDayPackage = void 0;
const oneDayPackage_1 = require("../models/oneDayPackage");
const twoDayPackage_1 = require("../models/twoDayPackage");
const db_1 = __importDefault(require("../db/db"));
const addOneDayPackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, flatFee, shippingMethod = 'One-Day' } = req.body;
        if (shippingMethod !== 'One-Day') {
            return res.status(400).json({ error: 'Invalid shipping method for one-day package' });
        }
        const trackingNumber = Math.floor(100000 + Math.random() * 900000).toString();
        const status = "Created";
        const oneDayPackage = new oneDayPackage_1.OneDay(senderName, senderAddress, receiverName, receiverAddress, weight, shippingMethod, costPerUnitWeight, status, trackingNumber, flatFee);
        const totalCost = oneDayPackage.calculateCost();
        const query = `
            INSERT INTO packages (
                shipping_method,
                sender_name,
                receiver_name,
                sender_address,
                receiver_address,
                weight,
                cost_per_unit_weight,
                flat_fee,
                status,
                tracking_number,
                total_cost
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;
        const result = yield db_1.default.query(query, [
            oneDayPackage.getShippingMethod(),
            oneDayPackage.getSenderName(),
            oneDayPackage.getReceiverName(),
            oneDayPackage.getSenderAddress(),
            oneDayPackage.getReceiverAddress(),
            oneDayPackage.getWeight(),
            oneDayPackage.getCostPerUnitWeight(),
            oneDayPackage.getFlatFee(),
            oneDayPackage.getStatus(),
            oneDayPackage.getTrackingNumber(),
            totalCost
        ]);
        res.status(201).json({
            message: "One-day package created successfully",
            package: result.rows[0],
            trackingNumber: result.rows[0].tracking_number
        });
    }
    catch (error) {
        console.error('Error creating one-day package:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.addOneDayPackage = addOneDayPackage;
const addTwoDayPackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, flatFee, shippingMethod = 'Two-Day' } = req.body;
        if (shippingMethod !== 'Two-Day') {
            return res.status(400).json({ error: 'Invalid shipping method for two-day package' });
        }
        const trackingNumber = Math.floor(100000 + Math.random() * 900000).toString();
        const status = "Created";
        const twoDayPackage = new twoDayPackage_1.TwoDay(senderName, senderAddress, receiverName, receiverAddress, weight, shippingMethod, costPerUnitWeight, status, trackingNumber, flatFee);
        const totalCost = twoDayPackage.calculateCost();
        const query = `
            INSERT INTO packages (
                shipping_method,
                sender_name,
                receiver_name,
                sender_address,
                receiver_address,
                weight,
                cost_per_unit_weight,
                flat_fee,
                status,
                tracking_number,
                total_cost
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;
        const result = yield db_1.default.query(query, [
            twoDayPackage.getShippingMethod(),
            twoDayPackage.getSenderName(),
            twoDayPackage.getReceiverName(),
            twoDayPackage.getSenderAddress(),
            twoDayPackage.getReceiverAddress(),
            twoDayPackage.getWeight(),
            twoDayPackage.getCostPerUnitWeight(),
            twoDayPackage.getFlatFee(),
            twoDayPackage.getStatus(),
            twoDayPackage.getTrackingNumber(),
            totalCost
        ]);
        res.status(201).json({
            message: "Two-day package created successfully",
            package: result.rows[0],
            trackingNumber: result.rows[0].tracking_number
        });
    }
    catch (error) {
        console.error('Error creating two-day package:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.addTwoDayPackage = addTwoDayPackage;
const getPackageDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { trackingNumber } = req.params;
        if (!trackingNumber) {
            return res.status(400).json({ error: 'Tracking number is required' });
        }
        const query = `
            SELECT * FROM packages
            WHERE tracking_number = $1
        `;
        const result = yield db_1.default.query(query, [trackingNumber]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Package not found' });
        }
        const packageData = result.rows[0];
        // Create appropriate package instance based on shipping method
        let packageInstance;
        if (packageData.shipping_method === 'One-Day') {
            packageInstance = new oneDayPackage_1.OneDay(packageData.sender_name, packageData.sender_address, packageData.receiver_name, packageData.receiver_address, packageData.weight, packageData.shipping_method, packageData.cost_per_unit_weight, packageData.status, packageData.tracking_number, packageData.flat_fee);
        }
        else {
            packageInstance = new twoDayPackage_1.TwoDay(packageData.sender_name, packageData.sender_address, packageData.receiver_name, packageData.receiver_address, packageData.weight, packageData.shipping_method, packageData.cost_per_unit_weight, packageData.status, packageData.tracking_number, packageData.flat_fee);
        }
        res.status(200).json({
            package: Object.assign(Object.assign({}, packageData), { printLabel: packageInstance.printLabel() })
        });
    }
    catch (error) {
        console.error('Error fetching package details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getPackageDetails = getPackageDetails;
const updatePackageStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { trackingNumber, newStatus } = req.body;
        if (!trackingNumber || !newStatus) {
            return res.status(400).json({ error: 'Both trackingNumber and newStatus are required' });
        }
        const validStatuses = ['Created', 'Shipped', 'In Transit', 'Delivered'];
        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({
                error: 'Invalid status value',
                validStatuses
            });
        }
        const query = `
            UPDATE packages
            SET status = $1, updated_at = NOW()
            WHERE tracking_number = $2
            RETURNING *
        `;
        const result = yield db_1.default.query(query, [newStatus, trackingNumber]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Package not found' });
        }
        res.status(200).json({
            message: 'Package status updated successfully',
            package: result.rows[0]
        });
    }
    catch (error) {
        console.error('Error updating package status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updatePackageStatus = updatePackageStatus;
const getAllPackages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Optional query parameters for filtering
        const { status, shippingMethod, page = 1, limit = 10 } = req.query;
        // Calculate offset for pagination
        const offset = (Number(page) - 1) * Number(limit);
        // Base query
        let query = `SELECT * FROM packages`;
        const queryParams = [];
        // Add WHERE clauses if filters are provided
        const whereClauses = [];
        if (status) {
            whereClauses.push(`status = $${whereClauses.length + 1}`);
            queryParams.push(status);
        }
        if (shippingMethod) {
            whereClauses.push(`shipping_method = $${whereClauses.length + 1}`);
            queryParams.push(shippingMethod);
        }
        if (whereClauses.length > 0) {
            query += ` WHERE ${whereClauses.join(' AND ')}`;
        }
        // Add ordering and pagination
        query += ` ORDER BY created_at DESC LIMIT $${whereClauses.length + 1} OFFSET $${whereClauses.length + 2}`;
        queryParams.push(Number(limit), offset);
        // Execute the query
        const result = yield db_1.default.query(query, queryParams);
        // Get total count for pagination metadata
        let countQuery = `SELECT COUNT(*) FROM packages`;
        if (whereClauses.length > 0) {
            countQuery += ` WHERE ${whereClauses.join(' AND ')}`;
        }
        const countResult = yield db_1.default.query(countQuery, queryParams.slice(0, -2)); // Exclude limit and offset
        const totalPackages = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalPackages / Number(limit));
        res.status(200).json({
            packages: result.rows,
            pagination: {
                totalPackages,
                totalPages,
                currentPage: Number(page),
                packagesPerPage: Number(limit)
            }
        });
    }
    catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllPackages = getAllPackages;
