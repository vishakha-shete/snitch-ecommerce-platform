import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendTokenResponse( user, res , message){

    const token = jwt.sign({ 
        id: user._id }, 
        config.JWT_SECRET, {
            expiresIn: "7d"
    });

    res.cookie("token", token);

    res.status(200).json({
        message,
        success: true,
        token,
        user: {
            id: user._id,
            name: user.fullname,
            email: user.email,
            contact: user.contact,
            role: user.role
        }
    });

}

export const registerUser = async (req, res) => {
    const { fullname, email, password, contact , isSeller} = req.body;

    try {
        const existingUser = await UserModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or contact number already exists' });
        }

        const user = await UserModel.create({
            fullname,
            email,
            password,
            contact,
            role: isSeller ? 'seller' : 'buyer'
        });

        await sendTokenResponse(user, res, 'User registered successfully');

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
}