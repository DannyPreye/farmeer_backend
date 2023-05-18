"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isVerified = exports.authMiddleWare = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
function authMiddleWare(req, res, next) {
    var _a, _b;
    const tokenParts = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(" ");
    if (tokenParts[0] == "Bearer" && tokenParts[1].match(/^[\w-]+\.[\w-]+\.[\w-]+$/) !== null) {
        try {
            const verification = jsonwebtoken_1.default.verify(tokenParts[1], PUB_KEY, {
                algorithms: ["RS256"]
            });
            req.jwt = verification;
            next();
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: "You're not authorized to view this resource"
            });
        }
    }
}
exports.authMiddleWare = authMiddleWare;
const isVerified = (req, res, next) => {
    const jwt = req.jwt;
    if (jwt.verified) {
        next();
    }
    else {
        res.status(401).json({
            success: false,
            message: "User is has not been verified"
        });
    }
};
exports.isVerified = isVerified;
const isAdmin = (req, res, next) => {
    const jwt = req.jwt;
    if (jwt.role == "admin") {
        next();
    }
    else {
        res.status(401).json({
            success: false,
            message: "User is not authorized"
        });
    }
};
exports.isAdmin = isAdmin;
