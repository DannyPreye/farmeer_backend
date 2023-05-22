import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { CloudinaryStorage, Options } from "multer-storage-cloudinary";
import multer from "multer";
import { promisify } from "util";

dotenv.config();

export const cloud = cloudinary.v2;

// To remove multer-storage-cloudinary errors 
declare interface cloudinaryOptions extends Options
{
    params: {
        folder: string;
        transformation: {}[];
        // fileFilter: (req: Request, file: any, callback: any) => any;

    };
}


cloud.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storageOptions: cloudinaryOptions = {
    cloudinary: cloud,
    params: {
        folder: "farmmeet",
        // fileFilter: (req: Request, file: any, callback: (error: Error | null, acceptFile: boolean) => void) =>
        // {
        //     const maxSize = 400 * 1024; // 400 KB in bytes

        //     if (file.size > maxSize) {
        //         // Reject the file
        //         return callback(new Error("File size exceeds the limit."), false);
        //     }

        //     // Accept the file
        //     callback(null, true);
        // },
        transformation: [ { width: 400, height: 400, crop: "fit" } ]
    }
};

const storage = new CloudinaryStorage(storageOptions);

const parallelUpload = promisify(storage._handleFile.bind(storage));

const upload = multer({ storage: storage, parallel: 4 });



export default upload;

