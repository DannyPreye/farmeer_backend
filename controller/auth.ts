import { NextFunction, Response, Request } from "express";
import passport from "passport";
import validator from "validator";

import User from "../model/User";
import { genPassword, issueJWT, validatePassword } from "../lib/utils";
import sendVerificationToken from "../lib/sendVerificationToken";
import Token from "../model/Token";

/**
 *  ::::::::::::::::::::::::: USER REGISTRATION CONTROLLER :::::::::::::::::::::::::::::::: 
 * @param req 
 * @param res 
 * @param next 
 * @returns void"/" + 
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
                await sendVerificationToken(saveUser.email as string, callbackUrl, token.token, saveUser.first_name as string);

                const tokenObject = issueJWT(saveUser);
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
                    },
                    token: tokenObject.token,
                    expiresIn: tokenObject.expiresIn
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


/**
 * :::::::::::::::::::::::::::::: VERIFY USER EMAIL ADDRESS :::::::::::::::::::::::::::::
 * @param req 
 * @param res 
 * @param next 
 */

export const verifyToken = async (req: Request, res: Response, next: NextFunction) =>
{
    const { token } = req.query;

    if (!token) {
        return res.status(404).json({
            message: "We were unable to find a user for this token",
            success: false
        });
    }

    try {
        const getToken = await Token.findOne({ token });

        if (!getToken) {
            return res.status(404).json({
                success: false,
                message: "We were unable to find a valid token. Your token may have expired"
            });
        }

        const user = await User.findOne({ _id: getToken.user });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "We are unable to find a user for this token"
            });
        }

        // Check if user has already been verified
        if (user?.isVerified) {
            return res.status(409).json({
                success: false,
                message: "This user has already been verified"
            });
        }

        user?.isVerified = true;
        const save = await user.save();

        if (save) {
            return res.status(200).json({
                success: true,
                message: "User has been successfully verified"
            });
        }


    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }


};

/**
 * :::::::::::::::::::::::::::::: RESEND VERIFICATION TOKEN ::::::::::::::::::::::::
 * @param req 
 * @param res 
 * @param next 
 */

export const resendToken = async (req: Request, res: Response, next: NextFunction) =>
{
    const { email, callbackUrl } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "We are unablt to find a user with that email"
        });
    }

    if (user.isVerified) {
        return res.status(409).json({
            success: false,
            message: "User is already verified"
        });
    }

    const generateToken = await user.generateToken();
    const messageReport = await sendVerificationToken(
        user.email as string,
        callbackUrl,
        generateToken.token as string,
        user.first_name as string
    );

    if (messageReport) {
        return res.status(200).json({
            success: true,
            message: "Message has been sent"
        });
    }
};



/**
 * ::::::::::::::::::::::::: RESET PASSWORD TOKEN :::::::::::::::::::::::
 * @param req 
 * @param res 
 * @returns 
 */

export const resetPasswordToken = async (req: Request, res: Response) =>
{
    const { email, callbackUrl } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "We were unable to find a user with that email." });
        }

        const token = await user.generateResetToken();


        const messageReport = await sendResetTokenMail(user.email as string, callbackUrl, token.token, user.first_name as string);
        if (messageReport) {
            return res.status(200).json({ message: "A password reset email has been sent to " + user.email + "." });
        }
        else {
            throw new Error("Something went wrong, mail not sent");
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" });
    }

};


/**
 * ::::::::::::::::::::::::::::::::: RESET PASSWORD ::::::::::::::::::::::::::::::::::
 * @param req 
 * @param res 
 */

export const resetPassword = async (req: Request, res: Response) =>
{
    const { confirmPassword, password, token } = req.body;

    try {
        const findToken = await Token.findOne({ token });

        if (!findToken) {
            return res.status(404).json({
                success: false,
                message: "token not found"
            });
        }

        const user = await User.findOne({ _id: findToken.user });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found"
            });
        }

        if (confirmPassword === password) {
            const { hash, salt } = genPassword(password);

            user.hash = hash;
            user.salt = salt;

            const savedUser = await user.save();

            if (savedUser) {
                return res.status(200).json({
                    success: true,
                    message: "Password has been changed"
                });
            }

        } else {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match"
            });
        }


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }



}


