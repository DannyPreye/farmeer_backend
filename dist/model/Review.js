"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const db_config_1 = __importDefault(require("../config/db.config"));
const ReviewSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    doc: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        refPath: "docModel",
        require: true,
    },
    rating: {
        type: Number,
        require: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        require: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});
exports.default = db_config_1.default.model("Review", ReviewSchema);
