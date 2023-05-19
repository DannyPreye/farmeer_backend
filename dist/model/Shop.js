"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const db_config_1 = __importDefault(require("../config/db.config"));
const ShopSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, trim: true },
    description: {
        type: String,
        required: true
    },
    location: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
    },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Product" }],
    coverImage: {
        type: String,
        required: true,
        default: "https://static.vecteezy.com/system/resources/previews/008/133/641/non_2x/shopping-cart-icon-design-templates-free-vector.jpg"
    },
    categories: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Category",
        }
    ],
    followers: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    // reviews: {
    // },
    created_at: { type: Date, default: Date.now },
});
exports.default = db_config_1.default.model("Shop", ShopSchema);
