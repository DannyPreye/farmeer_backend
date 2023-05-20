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

    },
    docModel: {
        type: String,
        required: true,
        enum: [ "Post", "Product" ],
    }

}, { timestamps: true });


LikeSchema.post("save", async function ()
{
    const model = mongoose.model(this.docModel);
    const likedDocument = await model.findById(this.liked);

    if (likedDocument) {
        likedDocument.likes.push(this._id);
        await likedDocument.save();
    }
});



export default dbconnection.model("Like", LikeSchema);