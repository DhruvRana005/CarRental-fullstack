import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"));
        mongoose.connection.on('error', (err) => console.error("MongoDB connection error:", err.message));
        mongoose.connection.on('disconnected', () => console.log("MongoDB disconnected"));

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            maxPoolSize: 10,
            family: 4, // Force IPv4
        });
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        // Retry connection after 5 seconds
        console.log("Retrying connection in 5 seconds...");
        setTimeout(connectDB, 5000);
    }
}

export default connectDB;