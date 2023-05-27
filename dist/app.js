"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const generateKeyPair_1 = require("./generateKeyPair");
const routes_1 = require("./routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
(0, generateKeyPair_1.genKeyPair)();
//:::::::::::::::: MIDDLE WARES ::::::::::::::
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
// ::::::::::: ROUTES :::::::::::::::
app.use("/api/v1/auth", routes_1.authRoute);
app.use("/api/v1/user", routes_1.userRoute);
app.use("/api/v1/category", routes_1.categoryRoute);
app.use("/api/v1/shop", routes_1.shopRoute);
app.use("/api/v1/like", routes_1.likeRoute);
app.use("/api/v1/product", routes_1.productRoute);
app.listen(port, () => {
    console.log("listening at port " + port);
});
