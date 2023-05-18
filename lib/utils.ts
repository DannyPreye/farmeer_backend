import crypto from "crypto";
import cloudinary from "../config/cloudinary";
import jsonwebtoken from "jsonwebtoken";
import fs from "fs";
import path from "path";


const pathTokey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathTokey, "utf8");

export function genPassword(password: string): { salt: string, hash: string; }
{
    const salt = crypto.randomBytes(32).toString("hex");
    const genHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return {
        salt,
        hash: genHash
    };
}

export function validatePassword(password: string, hash: string, salt: string): boolean
{
    const hashVerify = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return hash === hashVerify;
}

const uploadImage = async (file: any) =>
{
    const result = await cloudinary.uploader.upload(file, {
        folder: "e-commerce",
        use_filename: true,
        unique_filename: false,
    });
    return result.secure_url;
};

/**
 * @param{*} user- The user object
 * 
*/


export function issueJWT(user: any)
{
    const _id = user._id;
    const role = user.account_type;
    const verified = user.isVerified;

    const expiresIn = "1d";

    const payload = {
        sub: _id,
        iat: Date.now(),
        role,
        verified
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn, algorithm: "RS256" });

    return {
        token: "Bearer " + signedToken,
        expiresIn: expiresIn
    };
}

export default uploadImage;