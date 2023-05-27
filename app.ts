import express from "express";
import helment from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { genKeyPair } from "./generateKeyPair";
import
{
    authRoute,
    categoryRoute,
    shopRoute,
    productRoute,
    likeRoute,
    userRoute
} from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

genKeyPair();

//:::::::::::::::: MIDDLE WARES ::::::::::::::
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helment());

// ::::::::::: ROUTES :::::::::::::::
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/shop", shopRoute);
app.use("/api/v1/like", likeRoute);
app.use("/api/v1/product", productRoute);



app.listen(port, () =>
{
    console.log("listening at port " + port);
});