import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in environment variables.");
}

if (!process.env.JWT_SECRET) {
    console.error("Error: JWT_SECRET is not defined in environment variables.");
}

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT || 3000,
}; 