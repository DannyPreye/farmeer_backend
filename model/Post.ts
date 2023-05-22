import mongoose from "mongoose";
import dbconnection from "../config/db.config";

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
    },
    media: [ String ],
    likes: [ { type: mongoose.Schema.Types.ObjectId, ref: "Like" } ],
    comments: [ { type: mongoose.Schema.Types.ObjectId, ref: "Comment" } ],
    created_at: {
        type: Date,
        default: Date.now,
    },


});


export default dbconnection.model("Post", PostSchema);