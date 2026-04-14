import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendTokenResponse( user, res){
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        id: user._id,
    });
}

export const registerUser = async (req, res) => {
    const { fullname, email, password, contact } = req.body;
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

        const user = new UserModel({
            name: fullname,
            email,
            password,
            contact
        });

       const token = await user.generateAuthToken();

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
}