"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_1 = require("../controller/category");
const auth_1 = require("../middleware/auth");
const route = express_1.default.Router();
// -------------- get all categories ----------------
route.get("/", category_1.getCategories);
route.post("/create", auth_1.authMiddleWare, auth_1.isAdmin, category_1.postCreateCategory);
exports.default = route;
