"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const db_config_1 = __importDefault(require("../config/db.config"));
// default categories
const defaultCategories = [
    { name: 'Vegetables', subcategories: ['Leafy Greens', 'Root Vegetables', 'Cucurbits'] },
    { name: 'Fruits', subcategories: ['Berries', 'Citrus', 'Tropical Fruits'] },
    { name: 'Grains', subcategories: ['Wheat', 'Rice', 'Corn',] },
    { name: 'Livestock', subcategories: ['Cattle', 'Poultry', 'Swine',] }
];
const CategorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    subcategories: [{
            type: String,
            trim: true,
        }]
});
CategorySchema.statics.addDefaultCategories = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const Category = this;
        try {
            // check if there are already categories in the database
            if ((yield Category.countDocuments()) > 0)
                return;
            defaultCategories.forEach((category) => __awaiter(this, void 0, void 0, function* () {
                const newCategory = new Category({
                    name: category.name,
                    subcategories: []
                });
                category.subcategories.forEach((subcategory) => __awaiter(this, void 0, void 0, function* () {
                    newCategory.subcategories.push(subcategory);
                }));
                newCategory.save();
            }));
        }
        catch (error) {
            console.log(error);
        }
    });
};
exports.default = db_config_1.default.model('Category', CategorySchema);
