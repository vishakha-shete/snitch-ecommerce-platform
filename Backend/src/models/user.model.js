import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false, // optional for Google OAuth users
    },
    contact: {
        type: String,
        required: false, // optional for Google OAuth users
    },
    role: {
        type: String,
        enum: ['buyer', 'seller'],
        default: 'buyer',
    },
    googleId: {
        type: String,
        required: false,
    },
});

// Bug fix: 'next' was never declared as a parameter but was called
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const UserModel = mongoose.model("User", userSchema);

export default UserModel;