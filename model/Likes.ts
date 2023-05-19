import mongoose from "mongoose";
import dbconnection from "../config/db.config";


const LikeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    liked: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "docModel"

    }



}, { timestamps: true });


export default dbconnection.model("Like", LikeSchema);