import mongoose from 'mongoose';
import dbconnection from '../config/db.config';

// default categories
const defaultCategories = [

    { name: 'Vegetables', subcategories: [ 'Leafy Greens', 'Root Vegetables', 'Cucurbits' ] },
    { name: 'Fruits', subcategories: [ 'Berries', 'Citrus', 'Tropical Fruits' ] },
    { name: 'Grains', subcategories: [ 'Wheat', 'Rice', 'Corn', ] },
    { name: 'Livestock', subcategories: [ 'Cattle', 'Poultry', 'Swine', ] }
];


const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    subcategories: [ {
        type: String,
        trim: true,
    } ]

});


CategorySchema.statics.addDefaultCategories = async function ()
{
    const Category = this;
    try {
        // check if there are already categories in the database
        if (await Category.countDocuments() > 0) return;

        defaultCategories.forEach(async (category) =>
        {
            const newCategory = new Category({
                name: category.name,
                subcategories: []
            });
            category.subcategories.forEach(async (subcategory) =>
            {
                newCategory.subcategories.push(subcategory);
            });
            newCategory.save();
        });

    } catch (error) {
        console.log(error);
    }
};

export default dbconnection.model('Category', CategorySchema);
