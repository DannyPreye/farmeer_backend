import express from "express";
import { authMiddleWare, isVerified } from "../middleware/auth";
import { createProduct, createProductValidation, getProductsByCategory, getSingleProduct } from "../controller/product";
import upload from "../config/cloudinary";


const router = express.Router();


router.post("/", authMiddleWare, isVerified, upload.fields([
    { name: "featureImage", maxCount: 1 },
    { name: "productImages", maxCount: 5 }
]), createProductValidation, createProduct);


router.get("/search/:name", getProductsByCategory);

router.get("/category/:name", getProductsByCategory);

router.get("/:id", getSingleProduct);

router.delete("/:id", authMiddleWare, isVerified);

router.put("/:id", authMiddleWare, isVerified);




export default router;