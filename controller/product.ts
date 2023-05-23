import { Request, Response } from "express";
import { body, check, validationResult } from "express-validator";
import Product from "../model/Product";
import mongoose from "mongoose";
import Shop from "../model/Shop";
import Category from "../model/Category";

const PER_PAGE = 10;

export const createProductValidation = [
    body("name").trim().isString(),
    body("description"),
    body("price").isNumeric(),
    body("categories")
        .notEmpty()
        .custom((value) =>
        {
            return mongoose.Types.ObjectId.isValid(value);
        }),

    body('featureImage')
        .custom((value, { req }) =>
        {
            // Check if a file is uploaded
            const image = req.files[ "featureImage" ][ 0 ];
            if (!image) {
                throw new Error('main image is required');
            }
            const allowedFileTypes = [ 'image/jpeg', 'image/png', "image/jpg" ];
            if (!allowedFileTypes.includes(image.mimetype)) {
                throw new Error('Invalid file type. Only JPEG and PNG files are allowed.');
            }

            return true;
        }),
    body("productImages").custom((value, { req }) =>
    {

        if (req.files[ "productImages" ].length < 1) {
            throw new Error('You must add atleast one image');
        }
        const allowedFileTypes = [ 'image/jpeg', 'image/png', "image/jpg" ];

        const files = req.files[ "productImages" ];

        // / Check if all files have allowed MIME types;
        const areAllFilesAllowed = files.every((file: any) => allowedFileTypes.includes(file.mimetype));

        if (!areAllFilesAllowed) {
            throw new Error('Some of the files have invalid MIME types');
        }
        return true;
    }),
    body("shop").custom(value =>
    {
        return mongoose.Types.ObjectId.isValid(value);
    }),



];

export const createProduct = async (req: Request, res: Response) =>
{
    const errors = validationResult(req);



    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const {
            name,
            description,
            price,
            category,
            minimumPurchase,
            quantity,
            seller,
            shop,
        } = req.body;

        const shopAvailable = await Shop.findOne({ _id: shop });

        if (!shopAvailable) {
            return res.status(404).json({
                success: false,
                message: "The shop could not be found"
            });
        }

        const mainImage = req.files[ "featureImage" ][ 0 ].path;
        const getImages = req.files[ "productImages" ];

        const productImages = getImages.map((image: any) => image.path);

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            minimumPurchase,
            quantity,
            seller,
            shop,
            images: productImages,
            mainImage: mainImage
        });

        await newProduct.save();

        if (newProduct) {
            return res.status(201).json({
                success: true,
                newProduct

            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }


};

export const getProductsByCategory = async (req: Request, res: Response) =>
{
    try {
        const { categoryName, page } = req.params;

        const category = await Category.findOne({ name: categoryName });

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                success: false
            });
        }

        const products = await Product.find({ category: category._id })
            .limit(PER_PAGE)
            .skip((parseInt(page as string) - 1) * PER_PAGE);


        res.status(200).json({
            products,
            success: true
        });
    } catch (error) {
        console.error("Error retrieving products by category:", error);
        res.status(500).json({
            message: "Failed to retrieve products by category",
            success: false
        });
    }
};

export const getByName = async (req: Request, res: Response) =>
{
    try {
        const { name,
            category,
            price,
            minimumPurchase,
            isOutOfStock,
            page = 1,
            limit = 10
        } = req.query;

        const filters: any = {};

        if (name) {
            filters.name = { $regex: new RegExp(name as string, "i") };
        }

        if (category) {
            filters.category = category;
        }

        if (price) {
            filters.price = price;
        }

        if (minimumPurchase) {
            filters.minium_Purchase = minimumPurchase;
        }

        if (isOutOfStock) {
            filters.isOutOfStock = isOutOfStock === "true";
        }

        const options = {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
        };

        const products = await Product.find(filters)
            .skip((parseInt(page as string) - 1) * PER_PAGE)
            .limit(PER_PAGE);


        res.status(200).json({
            success: true,
            products
        });

    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ error: "Failed to retrieve products" });
    }
};

export const getSingleProduct = async (req: Request, res: Response) =>
{
    const { id } = req.query;

    const product = await Product.findOne({ _id: id });

    if (!product) {
        return res.status(400).json({
            message: "Could not find product",
            success: false
        });
    }


    res.status(200).json({
        success: true,
        product
    });
};

export const updateProducts = async (req: Request, res: Response) =>
{
    try {
        const { id } = req.params;

        const existingProduct = await Product.findOne({ _id: id });

        if (!existingProduct) {
            return res.status(400).json({
                message: "Product not found",
                success: false
            });
        }

        const _id = id;

        const product = await Product.findByIdAndDelete(
            _id,
            {
                $set: { ...req.body, },
            },
        );
        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.log(error);

    }
};