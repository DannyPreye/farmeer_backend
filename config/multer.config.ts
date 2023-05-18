import multer from "multer";
import DataUri from "datauri/parser";
import path from "path";


const dUri = new DataUri();
const storage = multer.memoryStorage();

export const dataUri = (req: any) =>
{
    const extName = path.extname(req.file.originalname).toString();

    return dUri.format(extName, req.file.buffer);
};

export const dataUris = (req: any) =>
{

    // const extNames = req.files.map((file: any) =>
    // {
    //     return path.extname(file.originalname).toString();



    // });
    const buffer = req.files.map((file: any, i: number) =>
    {
        const dUri = new DataUri();
        const extName = path.extname(file.originalname).toString();
        return dUri.format(extName, file.buffer);
    });
    return buffer;
};


const multerUploads = multer({ storage }).single("image");


export const multipleUloads = multer({ storage }).array("images", 5);

export default multerUploads;