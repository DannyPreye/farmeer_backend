"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const db_config_1 = __importDefault(require("../config/db.config"));
const PostSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
    },
    media: [String],
    likes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Like" }],
    comments: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Comment" }],
    created_at: {
        type: Date,
        default: Date.now,
    },
});
exports.default = db_config_1.default.model("Post", PostSchema);
