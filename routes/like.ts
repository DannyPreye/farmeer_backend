import express from "express";
import { authMiddleWare } from "../middleware/auth";
import { makeLike, validateMakeLike } from "../controller/like";



const router = express.Router();


router.post("/like", authMiddleWare, validateMakeLike, makeLike);

export default router;