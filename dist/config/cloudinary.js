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
const util_1 = require("util");
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
        folder: "farmmeet",
        // fileFilter: (req: Request, file: any, callback: (error: Error | null, acceptFile: boolean) => void) =>
        // {
        //     const maxSize = 400 * 1024; // 400 KB in bytes
        //     if (file.size > maxSize) {
        //         // Reject the file
        //         return callback(new Error("File size exceeds the limit."), false);
        //     }
        //     // Accept the file
        //     callback(null, true);
        // },
        transformation: [{ width: 400, height: 400, crop: "fit" }]
    }
};
const storage = new multer_storage_cloudinary_1.CloudinaryStorage(storageOptions);
const parallelUpload = (0, util_1.promisify)(storage._handleFile.bind(storage));
const upload = (0, multer_1.default)({ storage: storage, parallel: 4 });
exports.default = upload;
