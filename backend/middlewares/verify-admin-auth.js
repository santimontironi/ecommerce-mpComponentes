import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyAdminAuth = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        res.status(200).json({authorized: false})
        next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(200).json({authorized: false})
        next();
    }
};