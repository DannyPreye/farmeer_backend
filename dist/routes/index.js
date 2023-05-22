"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoute = exports.likeRoute = exports.shopRoute = exports.categoryRoute = exports.authRoute = void 0;
var auth_1 = require("./auth");
Object.defineProperty(exports, "authRoute", { enumerable: true, get: function () { return __importDefault(auth_1).default; } });
var category_1 = require("./category");
Object.defineProperty(exports, "categoryRoute", { enumerable: true, get: function () { return __importDefault(category_1).default; } });
var shop_1 = require("./shop");
Object.defineProperty(exports, "shopRoute", { enumerable: true, get: function () { return __importDefault(shop_1).default; } });
var like_1 = require("./like");
Object.defineProperty(exports, "likeRoute", { enumerable: true, get: function () { return __importDefault(like_1).default; } });
var products_1 = require("./products");
Object.defineProperty(exports, "productRoute", { enumerable: true, get: function () { return __importDefault(products_1).default; } });
