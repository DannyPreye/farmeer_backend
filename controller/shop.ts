import { Request, Response, NextFunction } from "express";
import Shop from "../model/Shop";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";
import User from "../model/User";


const PER_PAGE = 10;

// Validate the request 
export const createShopValidationRules = [
    body('name').notEmpty().trim().withMessage('Shop name is required'),
    body('description').notEmpty().withMessage('Shop description is required'),
    body('owner')
        .notEmpty()
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Valid owner ID is required'),
    body("categories")
        .notEmpty().isArray()
        .custom((value) =>
        {
            return Array.isArray(value) &&
                value.every(value => mongoose.Types.ObjectId.isValid(value));
        })
        .withMessage("Valid category ID is required")
    // Add validation for other fields if needed
];

/**
 * :::::::::::::::::::: CREATE SHOP :::::::::::::::::::::::::
 * @param req 
 * @param res 
 * @returns 
 */

export const createShop = async (req: Request, res: Response) =>
{
    try {
        // Validate the requests
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        // Extract the  user data from the body
        const { name, description, owner, categories } = req.body;

        const existingUser = await User.findOne({ _id: owner });

        // Check if the owner exists
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "Owner not found"
            });
        }

        // Create the Shop
        const newShop = new Shop({
            name,
            description,
            owner: existingUser._id,
            categories: categories ?
                categories.map((categoryId: string) => new mongoose.Types.ObjectId(categoryId)) : [],
            created_at: new Date()
        });

        await newShop.save();

        return res.status(201).json({
            success: true,
            message: "Shop has been created successfully",
            shop: newShop
        });



    } catch (error) {
        console.error('Error creating shop:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }

};



/**
 * :::::::::::::::::::::::: GET SINGLE SHOP :::::::::::::::::::::::::
 * @param req 
 * @param res 
 * @returns 
 */

export const getSingleShop = async (req: Request, res: Response) =>
{
    try {
        // Extract the shop ID from the request parameters
        const { id, page } = req.params;

        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid shop ID'
            });
        }

        // Find the shop by ID
        const shop = await Shop.findById(id).populate("owner", `
            first_name,
            last_name,
            profile_image,
            _id
        `);
        //     .populate({
        //     path: "products",
        //     options: {
        //         limit: PER_PAGE,
        //         skip: (parseInt(page as string) - 1) * PER_PAGE,
        //         sort: { createdAt: -1 }
        //     }
        // }).exec();

        // Check if the shop exists
        if (!shop) {
            return res.status(404).json({
                success: false,
                message: 'Shop not found'
            });
        }

        return res.json({
            success: true,
            shop
        });
    } catch (error) {
        console.error('Error fetching shop:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    };
};




/**
 * ::::::::::::::::::::::: GET SHOPS :::::::::::::::::::::::::::::
 * @param req 
 * @param res 
 * @returns 
 */
export const getShops = async (req: Request, res: Response) =>
{
    try {
        // Extract the query parameters from the request
        const { location, categories, createdDate, page } = req.query;

        // Construct the filter object based on the provided parameters
        const filter: any = {};

        if (location) {
            filter[ 'location.city' ] = { $regex: location, $options: 'i' };
        }

        if (categories) {
            const categoryIds = Array.isArray(categories) ? categories : [ categories ];
            filter.categories = { $in: categoryIds };
        }

        if (createdDate) {
            const startDate = new Date(createdDate as string);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1); // Add one day to include shops created until the end of the selected date
            filter.created_at = { $gte: startDate, $lt: endDate };
        }

        // Find the shops based on the filter
        const shops = await Shop.find(filter)
            .limit(PER_PAGE)
            .skip((parseInt(page as string) - 1) * PER_PAGE);

        const totalShops = await Shop.find(filter).count();
        const totalPages = Math.ceil(totalShops / PER_PAGE);

        return res.json({
            success: true,
            shops,
            totalShops,
            totalPages
        });

    } catch (error) {
        console.error('Error fetching shops:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};


/**
 * ::::::::::::::::::::: UPDATE SHOP :::::::::::::::::::::::::
 * @param req 
 * @param res 
 * @returns 
 */
export const updateShop = async (req: Request, res: Response) =>
{
    try {
        // Extract the shop ID from the request parameters
        const { id } = req.params;
        const coverImage = req.file?.path ? req.file?.path
            : "https://static.vecteezy.com/system/resources/previews/008/133/641/non_2x/shopping-cart-icon-design-templates-free-vector.jpg";



        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid shop ID' });
        }

        const existingShop = Shop.findOne({ _id: id });
        if (!existingShop) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        existingShop.setUpdate({});
        const _id = id;


        const shop = await Shop.findByIdAndUpdate(
            _id,
            {
                $set: { ...req.body, coverImage }, // Update the shop data with the request body
            },
            { new: true } // Return the updated shop as the response
        );




        return res.json({
            success: true,
            shop
        });

    } catch (error) {
        console.error('Error updating shop:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};


export const getAllProductsInShop = async (req: Request, res: Response) =>
{
    try {
        const { id, page } = req.params;

        const shop = await Shop.findById(id).populate({
            path: "products",
            options: {
                page: parseInt(page),
                limit: PER_PAGE,
            },
        });

        if (!shop) {
            return res.status(404).json({
                message: "Shop not found",
                success: false
            });
        }

        const products = shop.products;

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        console.error("Error retrieving products in shop:", error);
    }




};