"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const db_config_1 = __importDefault(require("../config/db.config"));
const TokenSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    token: {
        type: String,
        require: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
        expires: 43200 // 12 hours
    },
}, { timestamps: true });
exports.default = db_config_1.default.model("Token", TokenSchema);
