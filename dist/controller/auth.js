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
exports.resendToken = exports.verifyToken = exports.loginUsers = exports.registerUsers = void 0;
const validator_1 = __importDefault(require("validator"));
const User_1 = __importDefault(require("../model/User"));
const utils_1 = require("../lib/utils");
const sendVerificationToken_1 = __importDefault(require("../lib/sendVerificationToken"));
const Token_1 = __importDefault(require("../model/Token"));
/**
 *  ::::::::::::::::::::::::: USER REGISTRATION CONTROLLER ::::::::::::::::::::::::::::::::
 * @param req
 * @param res
 * @param next
 * @returns void"/" +
 */
const registerUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { callbackUrl, first_name, last_name, email, password, phone, accountType, street, country, state, city } = req.body;
    try {
        // Check if the user already exists
        const user = yield User_1.default.findOne({ email });
        if (user) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }
        // Validate the email user inputs
        if (validator_1.default.isEmail(email) == false) {
            return res.status(400).json({
                success: false,
                message: "The email is not valid "
            });
        }
        if ((accountType === "farmer") || (accountType === "buyer") || (accountType === "supplier") || (accountType === "admin")) {
            const { hash, salt } = (0, utils_1.genPassword)(password);
            const newUser = new User_1.default({
                hash,
                salt,
                first_name,
                last_name,
                email,
                phone,
                account_type: accountType,
                location: {
                    city,
                    country,
                    state,
                    street,
                }
            });
            const saveUser = yield newUser.save();
            if (saveUser) {
                const token = saveUser.generateToken();
                yield (0, sendVerificationToken_1.default)(saveUser.email, callbackUrl, token.token, saveUser.first_name);
                const tokenObject = (0, utils_1.issueJWT)(saveUser);
                return res.status(201).json({
                    success: true,
                    message: "User has been created",
                    data: {
                        first_name: saveUser.first_name,
                        last_name: saveUser.last_name,
                        email: saveUser.email,
                        location: saveUser.location,
                        accountTYpe: saveUser.account_type,
                        phone: saveUser.phone
                    },
                    token: tokenObject.token,
                    expiresIn: tokenObject.expiresIn
                });
            }
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid Account type"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});
exports.registerUsers = registerUsers;
/**
 * :::::::::::::::::::::::::: LOGIN USER CONTROLLER ::::::::::::::::::::::::::::::::::::::
 * @param req
 * @param res
 * @param next
 * @returns
 */
const loginUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Could not find user"
            });
        }
        // check if user password is valid
        const isValid = (0, utils_1.validatePassword)(password, user.hash, user.salt);
        if (isValid) {
            const tokenObject = (0, utils_1.issueJWT)(user);
            res.status(200).json({
                success: true,
                token: tokenObject.token,
                expiresIn: tokenObject.expiresIn
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: "Email or password is not correct"
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.loginUsers = loginUsers;
/**
 * :::::::::::::::::::::::::::::: VERIFY USER EMAIL ADDRESS :::::::::::::::::::::::::::::
 * @param req
 * @param res
 * @param next
 */
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.query;
    if (!token) {
        return res.status(404).json({
            message: "We were unable to find a user for this token",
            success: false
        });
    }
    try {
        const getToken = yield Token_1.default.findOne({ token });
        if (!getToken) {
            return res.status(404).json({
                success: false,
                message: "We were unable to find a valid token. Your token may have expired"
            });
        }
        const user = yield User_1.default.findOne({ _id: getToken.user });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "We are unable to find a user for this token"
            });
        }
        // Check if user has already been verified
        if (user === null || user === void 0 ? void 0 : user.isVerified) {
            return res.status(409).json({
                success: false,
                message: "This user has already been verified"
            });
        }
        user === null || user === void 0 ? void 0 : user.isVerified = true;
        const save = yield user.save();
        if (save) {
            return res.status(200).json({
                success: true,
                message: "User has been successfully verified"
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});
exports.verifyToken = verifyToken;
/**
 * :::::::::::::::::::::::::::::: RESEND VERIFICATION TOKEN ::::::::::::::::::::::::
 * @param req
 * @param res
 * @param next
 */
const resendToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, callbackUrl } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "We are unablt to find a user with that email"
        });
    }
    if (user.isVerified) {
        return res.status(409).json({
            success: false,
            message: "User is already verified"
        });
    }
    const generateToken = yield user.generateToken();
    const messageReport = yield (0, sendVerificationToken_1.default)(user.email, callbackUrl, generateToken.token, user.first_name);
    if (messageReport) {
        return res.status(200).json({
            success: true,
            message: "Message has been sent"
        });
    }
});
exports.resendToken = resendToken;