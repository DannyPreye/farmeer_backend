"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloud = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
dotenv_1.default.config();
exports.cloud = cloudinary_1.default.v2;
exports.cloud.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storageOptions = {
    cloudinary: exports.cloud,
    params: {
        folder: "farmmeet"
    }
};
const storage = new multer_storage_cloudinary_1.CloudinaryStorage(storageOptions);
const upload = (0, multer_1.default)({ storage: storage });
exports.default = upload;
