"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multipleUloads = exports.dataUris = exports.dataUri = void 0;
const multer_1 = __importDefault(require("multer"));
const parser_1 = __importDefault(require("datauri/parser"));
const path_1 = __importDefault(require("path"));
const dUri = new parser_1.default();
const storage = multer_1.default.memoryStorage();
const dataUri = (req) => {
    const extName = path_1.default.extname(req.file.originalname).toString();
    return dUri.format(extName, req.file.buffer);
};
exports.dataUri = dataUri;
const dataUris = (req) => {
    const buffer = req.files.map((file, i) => {
        const dUri = new parser_1.default();
        const extName = path_1.default.extname(file.originalname).toString();
        return dUri.format(extName, file.buffer);
    });
    return buffer;
};
exports.dataUris = dataUris;
const multerUploads = (0, multer_1.default)({ storage }).single("image");
exports.multipleUloads = (0, multer_1.default)({ storage }).array("images", 5);
exports.default = multerUploads;
