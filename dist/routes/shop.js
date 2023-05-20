"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const shop_1 = require("../controller/shop");
const router = express_1.default.Router();
router.post("/", auth_1.isVerified, shop_1.createShopValidationRules, shop_1.createShop);
router.get("/:id", shop_1.getSingleShop);
router.get("/shops", shop_1.getShops);
router.put("/:id", auth_1.isVerified, shop_1.updateShop);
exports.default = router;
