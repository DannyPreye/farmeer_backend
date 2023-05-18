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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const User_1 = __importDefault(require("../model/User"));
const genPassword_1 = require("../lib/genPassword");
const customFields = {
    usernameField: "email",
    passwordField: "password",
};
const verifyCallback = (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    // find user in db
    User_1.default.findOne({ email }).then((user) => {
        if (!user) {
            return done(null, false, { message: "User is not registered" });
        }
        // validate password
        const isValid = (0, genPassword_1.validatePassword)(password, user.hash, user.salt);
        if (!isValid) {
            return done(null, false);
        }
        else {
            return done(null, user);
        }
    }).catch((err) => done(err));
});
const strategy = new passport_local_1.Strategy(customFields, verifyCallback);
passport_1.default.use(strategy);
passport_1.default.serializeUser((user, done) => done(null, user._id));
passport_1.default.deserializeUser((id, done) => {
    User_1.default.findById(id).then((user) => done(null, user)).catch((err) => done(err));
});
