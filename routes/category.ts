import express from "express";
import Category from "../model/Category";
import passport from "passport";
import { getCategories, postCreateCategory } from "../controller/category";
import { authMiddleWare, isAdmin, isVerified } from "../middleware/auth";

const route = express.Router();


// -------------- get all categories ----------------
route.get("/", getCategories);


route.post("/create", authMiddleWare, isAdmin, postCreateCategory);


export default route;


