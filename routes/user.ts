import express from "express";
import { authMiddleWare, isVerified } from "../middleware/auth";
import { getUser } from "../controller/user";



const router = express.Router();

router.get("/:id", authMiddleWare, getUser);


export default router;