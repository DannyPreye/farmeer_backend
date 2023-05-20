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
exports.makeLike = exports.validateMakeLike = void 0;
const express_validator_1 = require("express-validator");
const Like_1 = __importDefault(require("../model/Like"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../model/User"));
exports.validateMakeLike = [
    (0, express_validator_1.body)("userId").custom((value) => mongoose_1.default.Types.ObjectId.isValid(value)),
    (0, express_validator_1.body)("model").custom(value => ["Product", "Post"].includes(value.toUpperCase())),
    (0, express_validator_1.body)("doc").custom((value) => mongoose_1.default.Types.ObjectId.isValid(value))
];
const makeLike = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    try {
        const { userId, model, doc } = req.body;
        const user = yield User_1.default.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const liked = yield Like_1.default.findOne({ user: userId, docModel: doc });
        // Check if the user has already liked
        if (liked) {
            yield liked.deleteOne({ _id: liked._id });
            return res.status(200).json({
                success: true,
                message: "Liked remove"
            });
        }
        else {
            const like = new Like_1.default({
                user: userId,
                liked: model,
                docModel: doc
            });
            yield like.save();
            res.status(200).json({
                success: true,
                message: "Like added"
            });
        }
    }
    catch (error) {
    }
});
exports.makeLike = makeLike;
// const like = new Like({
// });
