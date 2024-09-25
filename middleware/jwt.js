import createError from "../utils/createError.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
export const verifyToken = (req, res, next) => {

    const token = req.cookies.accessToken;
    // if (!token) return res.status(401).send("You are not  authorized");
    if (!token) return next(createError(401,"You are not  authorized"));


    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if (err)          
            return next(createError(403,"Token is not valid"));  
        req.userId = payload.id;
        req.isSeller = payload.isSeller;
        next();
    });
}

