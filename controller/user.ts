import { Request, Response } from "express";
import User from "../model/User";
import mongoose from "mongoose";


export const getUser = async (req: Request, res: Response) =>
{
    const { id } = req.params;

    console.log(id);

    try {
        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({
                success: false,
                message: "user id is invalid"
            });
        }

        const user = await User.findById(id).select("-salt -hash");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "no user found for the provided id"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });


    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            success: false
        });
    }

};