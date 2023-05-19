import mongoose from "mongoose";
import dbconnection from "../config/db.config";

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    doc: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "docModel", //Reference multiple document
        require: true,
    },
    rating: {
        type: Number,
        require: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        require: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }

});

export default dbconnection.model("Review", ReviewSchema);