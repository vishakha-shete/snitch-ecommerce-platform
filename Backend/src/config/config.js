import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in environment variables.");
}

if (!process.env.JWT_SECRET) {
    console.error("Error: JWT_SECRET is not defined in environment variables.");
}
if (!process.env.GOOGLE_CLIENT_ID) {
    console.error("Error: GOOGLE_CLIENT_ID is not defined in environment variables.");
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
    console.error("Error: GOOGLE_CLIENT_SECRET is not defined in environment variables.");
}
if (!process.env.GOOGLE_CALLBACK_URL) {
    console.error("Error: GOOGLE_CALLBACK_URL is not defined in environment variables.");
}
if (!process.env.ImageKit_private_key) {
    console.error("Error: ImageKit_private_key is not defined in environment variables.");
}


export const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    ImageKit_private_key: process.env.ImageKit_private_key
}; 