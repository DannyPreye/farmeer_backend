import express from "express";
import { body } from "express-validator";



import { registerUsers, loginUsers, verifyToken, resendToken, resetPassword, resetPasswordToken, regValidator, loginValidator } from "../controller/auth";

const route = express.Router();


route.post("/signup", regValidator, registerUsers);

route.post("/signin", loginValidator, loginUsers);

route.get("/verify", verifyToken);

route.post("/resend", resendToken);

route.post("/forgot-password", resetPasswordToken);

route.post("/reset-password", resetPassword);



export default route;