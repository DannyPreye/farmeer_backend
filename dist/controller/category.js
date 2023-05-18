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
exports.postCreateCategory = exports.getSingleCategory = exports.getCategories = void 0;
const Category_1 = __importDefault(require("../model/Category"));
// -------------- get all categories ----------------
// @route GET /categories
// @desc Get all categories
// @access Public
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Category_1.default.addDefaultCategories();
    try {
        const categories = yield Category_1.default.find();
        res.status(200).json({ categories });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getCategories = getCategories;
/**  -------------- get single category ----------------
* @route GET /categories/:id
* @desc Get a single category
* @access Public
*/
const getSingleCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.getSingleCategory = getSingleCategory;
// -------------- create category ----------------
// @route POST /categories/create
// @desc Create a category
// @access Private
const postCreateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, subCategories } = req.body;
    try {
        const category = new Category_1.default({
            name,
            subCategories
        });
        yield category.save();
        res.status(201).json({ category });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.postCreateCategory = postCreateCategory;
