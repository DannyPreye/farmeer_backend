"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controller/auth");
const route = express_1.default.Router();
route.post("/signup", auth_1.registerUsers);
route.post("/signin", auth_1.loginUsers);
exports.default = route;
