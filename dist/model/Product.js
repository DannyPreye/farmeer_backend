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
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const db_config_1 = __importDefault(require("../config/db.config"));
const Shop_1 = __importDefault(require("./Shop"));
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
    likes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Like"
        }
    ],
    shop: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Shop",
        require: true
    },
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
// Store the newly created products to the shop
ProductSchema.post("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const shop_Id = this.shop;
        const shop = yield Shop_1.default.findOne({ _id: shop_Id });
        !(shop === null || shop === void 0 ? void 0 : shop.products.includes(this.id)) && (shop === null || shop === void 0 ? void 0 : shop.products.push(this.id));
        yield (shop === null || shop === void 0 ? void 0 : shop.save());
    });
});
exports.default = db_config_1.default.model("Product", ProductSchema);
