import express, { Express, Request, Response } from "express";
import helment from "helmet";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";

import { authRoute, categoryRoute, likeRoute, shopRoute } from "./routes";

import "./config/passport.config";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;



app.use(passport.initialize());


// :::::::::::::::::::::::::::: MIDDLEWARES ::::::::::::::::::::::
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helment());


// :::::::::::::::::::::::::::: ROUTES :::::::::::::::::::::::::::
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/shop", shopRoute);
app.use("/api/v1/like", likeRoute);



app.listen(port, () =>
{
    console.log("listening at port " + port);
});