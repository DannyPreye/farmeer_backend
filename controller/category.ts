import Category from "../model/Category";
import { Request, Response } from "express";



// -------------- get all categories ----------------
// @route GET /categories
// @desc Get all categories
// @access Public

export const getCategories = async (req: Request, res: Response) =>
{

    await Category.addDefaultCategories();
    try {
        const categories = await Category.find();
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


/**  -------------- get single category ----------------
* @route GET /categories/:id
* @desc Get a single category
* @access Public
*/
export const getSingleCategory = async (req: Request, res: Response) => { };



// -------------- create category ----------------
// @route POST /categories/create
// @desc Create a category
// @access Private
export const postCreateCategory = async (req: Request, res: Response) =>
{
    const { name, subCategories } = req.body;

    try {
        const category = new Category({
            name,
            subCategories
        });

        await category.save();
        res.status(201).json({ category });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }

};