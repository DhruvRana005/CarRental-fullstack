import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    let token;

    // Token extract karo header se
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // Agar token nahi mila, 401 bhejo
    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized - No token provided" });
    }

    try {
        // Token verify karo
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Debug ke liye full payload log karo
        console.log("Decoded payload:", decoded);
        console.log("Decoded userId from token:", decoded.userId);

        // Agar userId undefined hai, error bhejo
        if (!decoded.userId) {
            console.log("Invalid token: userId missing");
            return res.status(401).json({ success: false, message: "Not authorized - Invalid token payload" });
        }

        // User ko DB se find karo (password exclude karo)
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            console.log("User not found for ID:", decoded.userId);
            return res.status(401).json({ success: false, message: "Not authorized - User not found" });
        }

        // req.user mein full user object set karo
        req.user = user;
        next();  // Agla middleware/route call karo
    } catch (error) {
        console.error("JWT Error:", error.message);
        return res.status(401).json({ success: false, message: "Not authorized - Invalid token" });
    }
};

export const isAdmin = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized - No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role === "admin") {
            req.admin = true;
            next();
        } else {
            return res.status(403).json({ success: false, message: "Forbidden - Admin access only" });
        }
    } catch (error) {
        console.error("Admin JWT Error:", error.message);
        return res.status(401).json({ success: false, message: "Not authorized - Invalid token" });
    }
};