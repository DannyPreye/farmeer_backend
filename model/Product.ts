import mongoose from "mongoose";
import dbconnection from "../config/db.config";
import slugify from "slugify";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,

    },
    slug: {
        type: String,

    },
    price: {
        type: Number,
        require: true,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    mainImage: {
        type: String,
        require: [ true, "Product must have a main image" ],

    },
    minium_Purchase: {
        type: Number,
        require: true,
        default: 1,
    },
    images: {
        type: [ String ],
        require: [ true, "Product must have at least one image" ]
    },
    quantity: {
        type: Number,
    },
    isOutOfStock: {
        type: Boolean,
        default: false,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Likes"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    created_at: {
        type: Date,
        default: Date.now,
    }
});

ProductSchema.pre("save", function (next)
{
    this.slug = slugify(this.name as string, { lower: true });
    next();
});


export default dbconnection.model("Product", ProductSchema);