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
exports.loginUsers = exports.registerUsers = void 0;
const validator_1 = __importDefault(require("validator"));
const User_1 = __importDefault(require("../model/User"));
const utils_1 = require("../lib/utils");
const sendVerificationToken_1 = __importDefault(require("../lib/sendVerificationToken"));
/**
 *  ::::::::::::::::::::::::: USER REGISTRATION CONTROLLER ::::::::::::::::::::::::::::::::
 * @param req
 * @param res
 * @param next
 * @returns void
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
                (0, sendVerificationToken_1.default)(saveUser.email, callbackUrl, token.token, saveUser.first_name);
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
                    }
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
