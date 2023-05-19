"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const db_config_1 = __importDefault(require("../config/db.config"));
const slugify_1 = __importDefault(require("slugify"));
const ProductSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
    slug: {
        type: String,
    },
    price: {
        type: Number,
        require: true,
        default: 0,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
    },
    mainImage: {
        type: String,
        require: [true, "Product must have a main image"],
    },
    minium_Purchase: {
        type: Number,
        require: true,
        default: 1,
    },
    images: {
        type: [String],
        require: [true, "Product must have at least one image"]
    },
    quantity: {
        type: Number,
    },
    isOutOfStock: {
        type: Boolean,
        default: false,
    },
    seller: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    likes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Likes"
        }
    ],
    comments: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    created_at: {
        type: Date,
        default: Date.now,
    }
});
ProductSchema.pre("save", function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
exports.default = db_config_1.default.model("Product", ProductSchema);
