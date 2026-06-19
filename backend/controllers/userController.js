import User from "../models/User.js";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";

const generateToken = (userId) => {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserData = async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true }).select("-__v");
    const carIds = cars.map(car => car._id);
    const bookings = await Booking.find({
      car: { $in: carIds },
      status: { $ne: 'cancelled' }
    }).select("pickupDate returnDate car status");

    const carsWithBookings = cars.map(car => {
      const carBookings = bookings.filter(b => b.car.toString() === car._id.toString());
      return {
        ...car._doc,
        activeBookings: carBookings
      };
    });

    return res.json({ success: true, cars: carsWithBookings || [] });
  } catch (error) {
    console.error("Get Cars Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Forgot Password - Send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User with this email does not exist" });
    }

    // Generate a 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();

    // Send email
    const emailResult = await sendEmail({
      email: user.email,
      subject: "🔒 Password Reset OTP - 4WHEELER",
      text: `Hello ${user.name},\n\nYour One-Time Password (OTP) for password reset is: ${otp}.\n\nWhat is an OTP?\nA One-Time Password (OTP) is a unique, time-sensitive security code used to verify your identity. It adds an extra layer of protection to your 4WHEELER account, ensuring that only you can authorize changes to your password.\n\nThis OTP is valid for 15 minutes. If you did not request this, please secure your account immediately.\n\nRegards,\n4WHEELER Support Team`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">4WHEELER</h1>
            <p style="color: #d1fae5; margin: 5px 0 0 0; font-size: 14px;">Premium Car Rental Experience</p>
          </div>
          
          <!-- Content Body -->
          <div style="padding: 30px 40px; color: #1f2937; line-height: 1.6;">
            <h2 style="color: #111827; margin-top: 0; font-size: 20px; font-weight: 700;">Password Reset Request</h2>
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>We received a request to reset the password for your 4WHEELER account. Please use the verification code below to authorize this change:</p>
            
            <!-- OTP Box -->
            <div style="background-color: #f0fdf4; border: 1px dashed #34d399; padding: 16px 20px; border-radius: 12px; font-size: 32px; font-weight: 800; text-align: center; letter-spacing: 8px; margin: 25px 0; color: #059669;">
              ${otp}
            </div>
            
            <p style="font-size: 13px; color: #6b7280; text-align: center; margin-top: -10px; margin-bottom: 25px;">This verification code is active for <strong>15 minutes</strong>.</p>
            
            <!-- What is OTP Box -->
            <div style="background-color: #f9fafb; border-left: 4px solid #10b981; padding: 15px 20px; border-radius: 0 12px 12px 0; margin-bottom: 25px;">
              <h4 style="margin: 0 0 5px 0; color: #0f766e; font-size: 14px; font-weight: 700;">💡 What is an OTP?</h4>
              <p style="margin: 0; font-size: 13px; color: #4b5563;">
                A <strong>One-Time Password (OTP)</strong> is a temporary, secure code generated automatically to verify your identity. It protects your account by ensuring that password modifications cannot be made without direct access to your registered email address.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #4b5563;">If you did not request a password reset, you can safely ignore this email. Your current password will remain secure and unchanged.</p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
            <p style="margin: 0 0 5px 0;">© ${new Date().getFullYear()} 4WHEELER Rentals. All rights reserved.</p>
            <p style="margin: 0;">For security reasons, never share this OTP with anyone.</p>
          </div>
        </div>
      `,
    });

    if (emailResult.success) {
      return res.json({ success: true, message: "OTP sent to your email ID successfully" });
    } else {
      return res.status(500).json({ success: false, message: "Failed to send email OTP. Check SMTP settings." });
    }
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Reset Password - Verify OTP & Set New Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }

    if (new Date() > user.otpExpire) {
      return res.status(400).json({ success: false, message: "Verification code has expired" });
    }

    // Update password (triggers hashing pre-save hook)
    user.password = newPassword;
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    return res.json({ success: true, message: "Password reset successful! You can now login." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Add Review to Car
export const addCarReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: "Rating and comment are required" });
    }

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    // Add review
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };

    car.reviews.push(review);
    await car.save();

    res.status(201).json({ success: true, message: "Review added successfully", reviews: car.reviews });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};