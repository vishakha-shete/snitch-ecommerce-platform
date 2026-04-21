import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import UserModel from '../models/user.model.js';

export const authenticateseller = async (req, res, next) => {
    const token = req.cookies.token


    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        if (user.role !== "seller") {
            return res.status(403).json({ message: "forbidden" })
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

}