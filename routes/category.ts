import express from "express";
import Category from "../model/Category";
import passport from "passport";
import { getCategories, postCreateCategory } from "../controller/category";
import { authMiddleWare, isVerified } from "../middleware/auth";

const route = express.Router();


// -------------- get all categories ----------------
route.get("/", authMiddleWare, isVerified, getCategories);


route.post("/create", postCreateCategory);


export default route;


