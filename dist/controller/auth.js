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
exports.resetPassword = exports.resetPasswordToken = exports.resendToken = exports.verifyToken = exports.loginUsers = exports.loginValidator = exports.registerUsers = exports.regValidator = void 0;
const validator_1 = __importDefault(require("validator"));
const express_validator_1 = require("express-validator");
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
exports.regValidator = [
    (0, express_validator_1.body)("first_name").trim(),
    (0, express_validator_1.body)("last_name").trim(),
    (0, express_validator_1.body)("state").trim(),
    (0, express_validator_1.body)("country").trim(),
    (0, express_validator_1.body)("city").trim(),
    (0, express_validator_1.body)("email").trim().isEmail(),
    (0, express_validator_1.body)("password").trim().isStrongPassword(),
    (0, express_validator_1.body)("accountType").trim().isIn(["farmer", "buyer", "supplier"]),
    (0, express_validator_1.body)("callbackUrl").isURL()
];
const registerUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validateBody = (0, express_validator_1.validationResult)(req);
    if (!validateBody.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: validateBody.array()
        });
    }
    // const valid = validationResult(req)
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
                const token = yield saveUser.generateToken();
                console.log("token", token);
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
exports.loginValidator = [
    (0, express_validator_1.body)("email").trim().isEmail().withMessage("Email is required"),
    (0, express_validator_1.body)("password").trim()
        .isStrongPassword()
        .withMessage("Password is required and must not be less than 8 characters")
];
const loginUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
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
/**
 * ::::::::::::::::::::::::: RESET PASSWORD TOKEN :::::::::::::::::::::::
 * @param req
 * @param res
 * @returns
 */
const resetPasswordToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, callbackUrl } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "We were unable to find a user with that email." });
        }
        const token = yield user.generateResetToken();
        const messageReport = yield sendResetTokenMail(user.email, callbackUrl, token.token, user.first_name);
        if (messageReport) {
            return res.status(200).json({ message: "A password reset email has been sent to " + user.email + "." });
        }
        else {
            throw new Error("Something went wrong, mail not sent");
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
});
exports.resetPasswordToken = resetPasswordToken;
/**
 * ::::::::::::::::::::::::::::::::: RESET PASSWORD ::::::::::::::::::::::::::::::::::
 * @param req
 * @param res
 */
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { confirmPassword, password, token } = req.body;
    try {
        const findToken = yield Token_1.default.findOne({ token });
        if (!findToken) {
            return res.status(404).json({
                success: false,
                message: "token not found"
            });
        }
        const user = yield User_1.default.findOne({ _id: findToken.user });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found"
            });
        }
        if (confirmPassword === password) {
            const { hash, salt } = (0, utils_1.genPassword)(password);
            user.hash = hash;
            user.salt = salt;
            const savedUser = yield user.save();
            if (savedUser) {
                return res.status(200).json({
                    success: true,
                    message: "Password has been changed"
                });
            }
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match"
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
exports.resetPassword = resetPassword;
