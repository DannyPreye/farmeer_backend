"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./routes");
require("./config/passport.config");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use(passport_1.default.initialize());
// :::::::::::::::::::::::::::: MIDDLEWARES ::::::::::::::::::::::
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
// :::::::::::::::::::::::::::: ROUTES :::::::::::::::::::::::::::
app.use("/api/v1/auth", routes_1.authRoute);
app.use("/api/v1/category", routes_1.categoryRoute);
app.listen(port, () => {
    console.log("listening at port " + port);
});
