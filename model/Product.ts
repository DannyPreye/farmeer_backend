import mongoose from "mongoose";
import slugify from "slugify";

import dbconnection from "../config/db.config";
import Shop from "./Shop";


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

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Like"
        }
    ],
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        require: true
    },
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

// Store the newly created products to the shop
ProductSchema.post("save", async function ()
{
    const shop_Id = this.shop;
    const shop = await Shop.findOne({ _id: shop_Id });

    const products = [ ...new Set([ ...(shop?.products || []), this.id ]) ];

    !shop?.products.includes(this.id) && shop?.products.includes(this.id);

    await shop?.save();

});

export default dbconnection.model("Product", ProductSchema);