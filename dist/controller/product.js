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
exports.getSingleProduct = exports.getByName = exports.getProductsByCategory = exports.createProduct = exports.createProductValidation = void 0;
const express_validator_1 = require("express-validator");
const Product_1 = __importDefault(require("../model/Product"));
const mongoose_1 = __importDefault(require("mongoose"));
const Shop_1 = __importDefault(require("../model/Shop"));
const Category_1 = __importDefault(require("../model/Category"));
const PER_PAGE = 10;
exports.createProductValidation = [
    (0, express_validator_1.body)("name").trim().isString(),
    (0, express_validator_1.body)("description"),
    (0, express_validator_1.body)("price").isNumeric(),
    (0, express_validator_1.body)("categories")
        .notEmpty()
        .custom((value) => {
        return mongoose_1.default.Types.ObjectId.isValid(value);
    }),
    (0, express_validator_1.body)('featureImage')
        .custom((value, { req }) => {
        // Check if a file is uploaded
        const image = req.files["featureImage"][0];
        if (!image) {
            throw new Error('main image is required');
        }
        const allowedFileTypes = ['image/jpeg', 'image/png', "image/jpg"];
        if (!allowedFileTypes.includes(image.mimetype)) {
            throw new Error('Invalid file type. Only JPEG and PNG files are allowed.');
        }
        return true;
    }),
    (0, express_validator_1.body)("productImages").custom((value, { req }) => {
        if (req.files["productImages"].length < 1) {
            throw new Error('You must add atleast one image');
        }
        const allowedFileTypes = ['image/jpeg', 'image/png', "image/jpg"];
        const files = req.files["productImages"];
        // / Check if all files have allowed MIME types;
        const areAllFilesAllowed = files.every((file) => allowedFileTypes.includes(file.mimetype));
        if (!areAllFilesAllowed) {
            throw new Error('Some of the files have invalid MIME types');
        }
        return true;
    }),
    (0, express_validator_1.body)("shop").custom(value => {
        return mongoose_1.default.Types.ObjectId.isValid(value);
    }),
];
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    console.log(mainImage, getImages);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    try {
        const { name, description, price, category, minimumPurchase, quantity, seller, shop, } = req.body;
        const shopAvailable = yield Shop_1.default.findOne({ _id: shop });
        if (!shopAvailable) {
            return res.status(404).json({
                success: false,
                message: "The shop could not be found"
            });
        }
        console.log("hllo js");
        const mainImage = req.files["featureImage"][0].path;
        const getImages = req.files["productImages"];
        const productImages = getImages.map((image) => image.path);
        const newProduct = new Product_1.default({
            name,
            description,
            price,
            category,
            minimumPurchase,
            quantity,
            seller,
            shop,
            images: productImages,
            mainImage: mainImage
        });
        yield newProduct.save();
        if (newProduct) {
            return res.status(201).json({
                success: true,
                newProduct
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
});
exports.createProduct = createProduct;
const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryName, page } = req.params;
        const category = yield Category_1.default.findOne({ name: categoryName });
        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                success: false
            });
        }
        const products = yield Product_1.default.find({ category: category._id })
            .limit(PER_PAGE)
            .skip((parseInt(page) - 1) * PER_PAGE);
        res.status(200).json({
            products,
            success: true
        });
    }
    catch (error) {
        console.error("Error retrieving products by category:", error);
        res.status(500).json({
            message: "Failed to retrieve products by category",
            success: false
        });
    }
});
exports.getProductsByCategory = getProductsByCategory;
const getByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, category, price, minimumPurchase, isOutOfStock, page = 1, limit = 10 } = req.query;
        const filters = {};
        if (name) {
            filters.name = { $regex: new RegExp(name, "i") };
        }
        if (category) {
            filters.category = category;
        }
        if (price) {
            filters.price = price;
        }
        if (minimumPurchase) {
            filters.minium_Purchase = minimumPurchase;
        }
        if (isOutOfStock) {
            filters.isOutOfStock = isOutOfStock === "true";
        }
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };
        const products = yield Product_1.default.find(filters)
            .skip((parseInt(page) - 1) * PER_PAGE)
            .limit(PER_PAGE);
        res.status(200).json({
            success: true,
            products
        });
    }
    catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ error: "Failed to retrieve products" });
    }
});
exports.getByName = getByName;
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const product = yield Product_1.default.findOne({ _id: id });
    if (!product) {
        return res.status(400).json({
            message: "Could not find product",
            success: false
        });
    }
    res.status(200).json({
        success: true,
        product
    });
});
exports.getSingleProduct = getSingleProduct;
