import { ExtractJwt } from 'passport-jwt';

import { NextFunction, Request, Response } from 'express';
import * as path from "path";
import * as fs from "fs";
import jsonwebtoken from "jsonwebtoken";

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

export function authMiddleWare(req: Request, res: Response, next: NextFunction)
{
    const tokenParts = req.headers?.authorization?.split(" ");


    if (tokenParts[ 0 ] == "Bearer" && tokenParts[ 1 ].match(/^[\w-]+\.[\w-]+\.[\w-]+$/) !== null) {



        try {
            const verification = jsonwebtoken.verify(tokenParts[ 1 ], PUB_KEY, {
                algorithms: [ "RS256" ]
            });

            req.jwt = verification;



            next();

        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "You're not authorized to view this resource"
            });
        }

    }
}


export const isVerified = (req: Request, res: Response, next: NextFunction) =>
{
    const jwt = req.jwt;

    if (jwt.verified) {
        next();
    } else {
        res.status(401).json({
            success: false,
            message: "User is has not been verified"
        });
    }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) =>
{
    const jwt = req.jwt;

    if (jwt.role == "admin") {
        next();
    } else {
        res.status(401).json({
            success: false,
            message: "User is not authorized"
        });
    }
};