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
exports.issueJWT = exports.validatePassword = exports.genPassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pathTokey = path_1.default.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs_1.default.readFileSync(pathTokey, "utf8");
function genPassword(password) {
    const salt = crypto_1.default.randomBytes(32).toString("hex");
    const genHash = crypto_1.default.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return {
        salt,
        hash: genHash
    };
}
exports.genPassword = genPassword;
function validatePassword(password, hash, salt) {
    const hashVerify = crypto_1.default.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return hash === hashVerify;
}
exports.validatePassword = validatePassword;
const uploadImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cloudinary_1.default.uploader.upload(file, {
        folder: "e-commerce",
        use_filename: true,
        unique_filename: false,
    });
    return result.secure_url;
});
/**
 * @param{*} user- The user object
 *
*/
function issueJWT(user) {
    const _id = user._id;
    const role = user.account_type;
    const verified = user.isVerified;
    const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const expirationTimestamp = currentTimestamp + 24 * 60 * 60; // Add expiration time in seconds
    const payload = {
        sub: _id,
        iat: Date.now(),
        exp: expirationTimestamp,
        role,
        verified,
    };
    const signedToken = jsonwebtoken_1.default.sign(payload, PRIV_KEY, { algorithm: "RS256" });
    return {
        token: "Bearer " + signedToken,
    };
}
exports.issueJWT = issueJWT;
exports.default = uploadImage;
