import mongoose from "mongoose";
import dbconnection from "../config/db.config";



const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
    },
    doc: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "docModel"
    },
    media: [ String ],
    likes: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ],
    replies: [ { type: mongoose.Schema.Types.ObjectId, ref: "Comment" } ],
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }

});

CommentSchema.pre("save", function (next)
{

});

export default dbconnection.model("Comment", CommentSchema);