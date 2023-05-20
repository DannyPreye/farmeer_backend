import express from "express";
import { authMiddleWare, isVerified } from "../middleware/auth";
import { createShop, createShopValidationRules, getShops, getSingleShop, updateShop } from "../controller/shop";

const router = express.Router();


router.post("/", authMiddleWare, isVerified, createShopValidationRules, createShop);

router.get("/all", getShops);

router.get("/:id", getSingleShop);


router.put("/:id", authMiddleWare, isVerified, updateShop);

export default router;