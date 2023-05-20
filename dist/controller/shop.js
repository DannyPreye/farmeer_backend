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
exports.updateShop = exports.getShops = exports.getSingleShop = exports.createShop = exports.createShopValidationRules = void 0;
const Shop_1 = __importDefault(require("../model/Shop"));
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../model/User"));
const PER_PAGE = 10;
// Validate the request 
exports.createShopValidationRules = [
    (0, express_validator_1.body)('name').notEmpty().trim().withMessage('Shop name is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Shop description is required'),
    (0, express_validator_1.body)('owner')
        .notEmpty()
        .custom((value) => mongoose_1.default.Types.ObjectId.isValid(value))
        .withMessage('Valid owner ID is required'),
    (0, express_validator_1.body)("categories")
        .notEmpty()
        .custom((value) => mongoose_1.default.Types.ObjectId.isValid(value))
        .withMessage("Valid category ID is required")
    // Add validation for other fields if needed
];
/**
 * :::::::::::::::::::: CREATE SHOP :::::::::::::::::::::::::
 * @param req
 * @param res
 * @returns
 */
const createShop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the requests
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        // Extract the  user data from the body
        const { name, description, owner, categories } = req.body;
        const existingUser = yield User_1.default.findOne({ _id: owner });
        // Check if the owner exists
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "Owner not found"
            });
        }
        // Create the Shop
        const newShop = new Shop_1.default({
            name,
            description,
            owner: existingUser._id,
            categories: categories ?
                categories.map((categoryId) => new mongoose_1.default.Types.ObjectId(categoryId)) : [],
            created_at: new Date()
        });
        yield newShop.save();
        return res.status(201).json({
            success: true,
            message: "Shop has been created successfully",
            shop: newShop
        });
    }
    catch (error) {
        console.error('Error creating shop:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});
exports.createShop = createShop;
/**
 * :::::::::::::::::::::::: GET SINGLE SHOP :::::::::::::::::::::::::
 * @param req
 * @param res
 * @returns
 */
const getSingleShop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the shop ID from the request parameters
        const { id, page } = req.params;
        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid shop ID'
            });
        }
        // Find the shop by ID
        const shop = yield Shop_1.default.findById(id).populate("owner", `
            first_name,
            last_name,
            profile_image,
            _id
        `).populate({
            path: "products",
            options: {
                limit: PER_PAGE,
                skip: (parseInt(page) - 1) * PER_PAGE,
                sort: { createdAt: -1 }
            }
        }).exec();
        // Check if the shop exists
        if (!shop) {
            return res.status(404).json({
                success: false,
                message: 'Shop not found'
            });
        }
        return res.json({
            success: true,
            shop
        });
    }
    catch (error) {
        console.error('Error fetching shop:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
    ;
});
exports.getSingleShop = getSingleShop;
/**
 * ::::::::::::::::::::::: GET SHOPS :::::::::::::::::::::::::::::
 * @param req
 * @param res
 * @returns
 */
const getShops = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the query parameters from the request
        const { location, categories, createdDate, page } = req.query;
        // Construct the filter object based on the provided parameters
        const filter = {};
        if (location) {
            filter['location.city'] = { $regex: location, $options: 'i' };
        }
        if (categories) {
            const categoryIds = Array.isArray(categories) ? categories : [categories];
            filter.categories = { $in: categoryIds };
        }
        if (createdDate) {
            const startDate = new Date(createdDate);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1); // Add one day to include shops created until the end of the selected date
            filter.created_at = { $gte: startDate, $lt: endDate };
        }
        // Find the shops based on the filter
        const shops = yield Shop_1.default.find(filter)
            .limit(PER_PAGE)
            .skip((parseInt(page) - 1) * PER_PAGE);
        const totalShops = yield Shop_1.default.find(filter).count();
        const totalPages = Math.ceil(totalShops / PER_PAGE);
        return res.json({
            success: true,
            shops,
            totalShops,
            totalPages
        });
    }
    catch (error) {
        console.error('Error fetching shops:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});
exports.getShops = getShops;
/**
 * ::::::::::::::::::::: UPDATE SHOP :::::::::::::::::::::::::
 * @param req
 * @param res
 * @returns
 */
const updateShop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the shop ID from the request parameters
        const { id } = req.params;
        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid shop ID' });
        }
        const existingShop = Shop_1.default.findOne({ _id: id });
        if (!existingShop) {
            return res.status(404).json({ error: 'Shop not found' });
        }
        existingShop.setUpdate({});
        const _id = id;
        const shop = yield Shop_1.default.findByIdAndUpdate(_id, {
            $set: req.body, // Update the shop data with the request body
        }, { new: true } // Return the updated shop as the response
        );
        return res.json({
            success: true,
            shop
        });
    }
    catch (error) {
        console.error('Error updating shop:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});
exports.updateShop = updateShop;
