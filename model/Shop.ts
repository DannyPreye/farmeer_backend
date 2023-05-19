import mongoose from "mongoose";
import dbconnection from "../config/db.config";


const ShopSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: {
        type: String,
        required: true
    },
    location: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [ { type: mongoose.Schema.Types.ObjectId, ref: "Product" } ],
    coverImage: {
        type: String,
        required: true,
        default: "https://static.vecteezy.com/system/resources/previews/008/133/641/non_2x/shopping-cart-icon-design-templates-free-vector.jpg"
    },
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    // reviews: {

    // },
    created_at: { type: Date, default: Date.now },




});

export default dbconnection.model("Shop", ShopSchema);