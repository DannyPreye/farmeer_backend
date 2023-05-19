import express from "express";



import { registerUsers, loginUsers, verifyToken, resendToken, resetPassword, resetPasswordToken } from "../controller/auth";

const route = express.Router();


route.post("/signup", registerUsers);

route.post("/signin", loginUsers);

route.get("/verify", verifyToken);

route.post("/resend", resendToken);

route.post("/forgot-password", resetPasswordToken);

route.post("/reset-password", resetPassword);



export default route;