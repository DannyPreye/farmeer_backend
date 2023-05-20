import express from "express";
import { isVerified } from "../middleware/auth";
import { createShop, createShopValidationRules, getShops, getSingleShop, updateShop } from "../controller/shop";

const router = express.Router();


router.post("/", isVerified, createShopValidationRules, createShop);

router.get("/:id", getSingleShop);

router.get("/shops", getShops);

router.put("/:id", isVerified, updateShop);

export default router;