import { NextFunction, Response, Request } from "express";
import passport from "passport";
import validator from "validator";

import User from "../model/User";
import { genPassword, issueJWT, validatePassword } from "../lib/utils";
import sendVerificationToken from "../lib/sendVerificationToken";

/**
 *  ::::::::::::::::::::::::: USER REGISTRATION CONTROLLER :::::::::::::::::::::::::::::::: 
 * @param req 
 * @param res 
 * @param next 
 * @returns void
 */

export const registerUsers = async (req: Request, res: Response, next: NextFunction) =>
{
    const { callbackUrl, first_name, last_name, email, password,
        phone, accountType, street, country, state, city } = req.body;

    try {

        // Check if the user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        // Validate the email user inputs
        if (validator.isEmail(email) == false) {
            return res.status(400).json({
                success: false,
                message: "The email is not valid "
            });
        }

        if ((accountType === "farmer") || (accountType === "buyer") || (accountType === "supplier") || (accountType === "admin")) {


            const { hash, salt } = genPassword(password);

            const newUser = new User({
                hash,
                salt,
                first_name,
                last_name,
                email,
                phone,
                account_type: accountType,
                location: {
                    city,
                    country,
                    state,
                    street,
                }
            });

            const saveUser = await newUser.save();

            if (saveUser) {
                const token = saveUser.generateToken();
                sendVerificationToken(saveUser.email as string, callbackUrl, token.token, saveUser.first_name as string);

                return res.status(201).json({
                    success: true,
                    message: "User has been created",
                    data: {
                        first_name: saveUser.first_name,
                        last_name: saveUser.last_name,
                        email: saveUser.email,
                        location: saveUser.location,
                        accountTYpe: saveUser.account_type,
                        phone: saveUser.phone
                    }
                });
            }


        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid Account type"
            });
        }

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }

};



/**
 * :::::::::::::::::::::::::: LOGIN USER CONTROLLER ::::::::::::::::::::::::::::::::::::::
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */

export const loginUsers = async (req: Request, res: Response, next: NextFunction) =>
{
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Could not find user"
            });
        }

        // check if user password is valid
        const isValid = validatePassword(password, user.hash as string, user.salt as string);

        if (isValid) {
            const tokenObject = issueJWT(user);

            res.status(200).json({
                success: true,
                token: tokenObject.token,
                expiresIn: tokenObject.expiresIn
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Email or password is not correct"
            });
        }

    } catch (error) {
        next(error);
    }
};