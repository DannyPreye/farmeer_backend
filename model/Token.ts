import mongoose from "mongoose";
import dbconnection from "../config/db.config";

const TokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    token: {
        type: String,
        require: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
        expires: 43200 // 12 hours
    },

}, { timestamps: true });


export default dbconnection.model("Token", TokenSchema);