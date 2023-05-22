import express from "express";
import { authMiddleWare, isVerified } from "../middleware/auth";
import { createShop, createShopValidationRules, getAllProductsInShop, getShops, getSingleShop, updateShop } from "../controller/shop";
import upload from "../config/cloudinary";

const router = express.Router();


router.post("/", authMiddleWare, isVerified, createShopValidationRules, createShop);

router.get("/all", getShops);

router.get("/products/:id", getAllProductsInShop);

router.get("/:id", getSingleShop);


router.put("/:id", authMiddleWare, isVerified, upload.single("cover-image"), updateShop);

export default router;