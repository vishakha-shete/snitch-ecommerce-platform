import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendTokenResponse(user, res, message) {

    const token = jwt.sign({
        id: user._id
    },
        config.JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie("token", token, { httpOnly: true });

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
    const { fullname, email, password, contact, isSeller } = req.body;

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

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        await sendTokenResponse(user, res, 'User logged in successfully');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Google OAuth callback — finds or creates user, then issues a JWT and redirects to frontend
export const GoogleCallback = async (req, res) => {
    try {
        const profile = req.user; // set by passport with session: false
        const email = profile.emails?.[0]?.value;
        const fullname = profile.displayName;
        const googleId = profile.id;

        if (!email) {
            return res.redirect('http://localhost:5173/login?error=no_email');
        }

        // Find existing user or create a new one
        let user = await UserModel.findOne({ $or: [{ googleId }, { email }] });

        if (!user) {
            user = await UserModel.create({
                fullname,
                email,
                googleId,
                role: 'buyer',
                // contact and password are optional for Google OAuth users
            });
        } else if (!user.googleId) {
            // Existing email-based user — link their Google account
            user.googleId = googleId;
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, { httpOnly: true });

        // Redirect to frontend dashboard with token in query (frontend can store it)
        res.redirect(`http://localhost:5173/?token=${token}`);

    } catch (error) {
        console.error('Google callback error:', error);
        res.redirect('http://localhost:5173/login?error=google_auth_failed');
    }
}


export const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const user = req.user;

        res.status(200).json({
            message: "user fetched successfully",
            success: true,
            user: {
                id: user._id,
                email: user.email,
                contact: user.contact,
                fullname: user.fullname,
                role: user.role
            }
        });

    } catch (error) {
        console.error("GET ME ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
};