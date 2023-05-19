"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const db_config_1 = __importDefault(require("../config/db.config"));
const CommentSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
    },
    doc: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        refPath: "docModel"
    },
    media: [String],
    likes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    replies: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Comment" }],
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }
});
CommentSchema.pre("save", function (next) {
});
exports.default = db_config_1.default.model("Comment", CommentSchema);
