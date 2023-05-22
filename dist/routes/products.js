"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const product_1 = require("../controller/product");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const router = express_1.default.Router();
router.post("/", auth_1.authMiddleWare, auth_1.isVerified, cloudinary_1.default.fields([
    { name: "featureImage", maxCount: 1 },
    { name: "productImages", maxCount: 5 }
]), product_1.createProductValidation, product_1.createProduct);
router.get("/search/:name", product_1.getProductsByCategory);
router.get("/category/:name", product_1.getProductsByCategory);
router.get("/:id", product_1.getSingleProduct);
router.delete("/:id", auth_1.authMiddleWare, auth_1.isVerified);
router.put("/:id", auth_1.authMiddleWare, auth_1.isVerified);
exports.default = router;
