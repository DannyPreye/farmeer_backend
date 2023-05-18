import mongoose from "mongoose";
import connection from "../config/db.config";
// import { validatePassword } from "../lib/genPassword";
// import Token from "./Token";
import crypto from "crypto";
import slugify from "slugify";
import Token from "./Token";

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true

    },
    location: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
    },
    account_type: {
        type: String,
        enum: [ "farmer", "buyer", "supplier", "admin" ],
        required: true,
    },
    profile_image: {
        type: String,
        default: "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI= "

    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    hash: {
        type: String,
    },
    slug: {
        type: String,
    },
    salt: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    source: {
        type: String,
        enum: [ "local", "google" ],
        default: "local",
        require: [ true, "Source is required" ]
    }
});



// UserSchema.methods.validPassword = function (password: string): boolean
// {
//     return validatePassword(password, this.hash, this.salt);
// };

UserSchema.methods.generateToken = function (): any
{
    let payload = {
        user: this._id,
        token: crypto.randomBytes(16).toString("hex"),
    };
    return Token.create(payload);
};


// UserSchema.methods.generateResetToken = function (): any
// {
//     let payload = {
//         user: this._id,
//         token: crypto.randomBytes(16).toString("hex"),
//     };

//     return ResetToken.create(payload);
// };

UserSchema.pre("save", function (next)
{
    this.slug = slugify(`${this.first_name} ${this.last_name}`, { lower: true, replacement: "-" });
    next();
});


export default connection.model("User", UserSchema);

