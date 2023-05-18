import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

export const cloud = cloudinary.v2;

const cloudinaryMiddleware = (req: Request, res: Response, next: NextFunction) =>
{
    cloud.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    next();
};


export default cloudinaryMiddleware;