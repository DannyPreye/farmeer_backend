import express from "express";
import passport from "passport";


import { registerUsers, loginUsers } from "../controller/auth";

const route = express.Router();


route.post("/signup", registerUsers);

route.post("/signin", loginUsers);



export default route;