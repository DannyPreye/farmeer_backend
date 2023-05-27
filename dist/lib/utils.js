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
    const profile_image = user.profile_image;
    const last_name = user.last_name;
    const first_name = user.first_name;
    const expiresIn = "1d";
    const payload = {
        sub: _id,
        iat: Date.now(),
        role,
        verified,
        last_name,
        first_name,
        profile_image,
        expiresIn
    };
    const signedToken = jsonwebtoken_1.default.sign(payload, PRIV_KEY, { expiresIn, algorithm: "RS256" });
    return {
        token: "Bearer " + signedToken,
        expiresIn: expiresIn
    };
}
exports.issueJWT = issueJWT;
exports.default = uploadImage;
