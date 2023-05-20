import { Response, Request, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import Like from "../model/Like";
import mongoose from "mongoose";
import User from "../model/User";

export const validateMakeLike = [
    body("userId").custom((value) => mongoose.Types.ObjectId.isValid(value)),
    body("model").custom(value => [ "Product", "Post" ].includes(value.toUpperCase())),
    body("doc").custom((value) => mongoose.Types.ObjectId.isValid(value))

];

export const makeLike = async (req: Request, res: Response, next: NextFunction) =>
{

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const { userId, model, doc } = req.body;

        const user = await User.findOne({ _id: userId });


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const liked = await Like.findOne({ user: userId, docModel: doc });


        // Check if the user has already liked
        if (liked) {
            await liked.deleteOne({ _id: liked._id });
            return res.status(200).json({
                success: true,
                message: "Liked remove"
            });
        } else {
            const like = new Like({
                user: userId,
                liked: model,
                docModel: doc
            });

            await like.save();
            res.status(200).json({
                success: true,
                message: "Like added"
            });
        }
    } catch (error) {

    }
};

    // const like = new Like({

    // });

