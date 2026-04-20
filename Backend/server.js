import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import dns from "node:dns/promises"
dns.setServers(["8.8.8.8", "1.1.1.1"])


// Connect to MongoDB (non-blocking)
connectDB().catch(err => console.error('MongoDB connection issue:', err.message));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

