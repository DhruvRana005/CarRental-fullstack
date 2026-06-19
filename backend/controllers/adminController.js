import User from "../models/User.js";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";
import jwt from "jsonwebtoken";

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
      const token = jwt.sign(
        { role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
      return res.json({
        success: true,
        token,
        user: { email, role: "admin", name: "Administrator" }
      });
    }
    return res.status(401).json({ success: false, message: "Invalid Admin Credentials" });
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Dashboard Data
export const getDashboardData = async (req, res) => {
  try {
    // 1. Revenue & Bookings
    const bookings = await Booking.find().populate("car").populate("user");
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.price || 0), 0);

    // 2. Users
    const users = await User.find().select("-password");

    // 3. Cars
    const cars = await Car.find();

    // 4. Analytics
    // Let's count cars by category
    const categoryCounts = {};
    cars.forEach(car => {
      categoryCounts[car.category] = (categoryCounts[car.category] || 0) + 1;
    });

    // Let's count user registrations by role
    const roleCounts = { customer: 0, owner: 0 };
    users.forEach(user => {
      if (user.role === "owner") roleCounts.owner++;
      else roleCounts.customer++;
    });

    res.json({
      success: true,
      data: {
        revenue: {
          totalRevenue,
          bookingCount: bookings.length,
          bookings
        },
        users,
        cars,
        analytics: {
          categoryCounts,
          roleCounts,
          totalUsers: users.length,
          totalCars: cars.length,
          totalBookings: bookings.length
        }
      }
    });
  } catch (error) {
    console.error("Admin Dashboard Data Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Add Car
export const adminAddCar = async (req, res) => {
  try {
    const { brand, model, image, year, category, seating_capacity, fuel_type, transmission, pricePerDay, location, description } = req.body;
    
    if (!brand || !model || !year || !category || !pricePerDay || !location) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newCar = await Car.create({
      brand,
      model,
      image: image || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=80",
      year: Number(year),
      category,
      seating_capacity: Number(seating_capacity) || 5,
      fuel_type: fuel_type || "Petrol",
      transmission: transmission || "Automatic",
      pricePerDay: Number(pricePerDay),
      location,
      description: description || "",
      isAvailable: true,
      owner: null // Null represents platform/admin owned
    });

    res.status(201).json({ success: true, message: "Car added successfully", car: newCar });
  } catch (error) {
    console.error("Admin Add Car Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Edit Car
export const adminEditCar = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCar = await Car.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCar) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    res.json({ success: true, message: "Car updated successfully", car: updatedCar });
  } catch (error) {
    console.error("Admin Edit Car Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Delete Car
export const adminDeleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCar = await Car.findByIdAndDelete(id);
    if (!deletedCar) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }
    res.json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    console.error("Admin Delete Car Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Delete User
export const adminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete user's bookings and cars if they are an owner
    await Booking.deleteMany({ $or: [{ user: id }, { owner: id }] });
    await Car.deleteMany({ owner: id });
    await User.findByIdAndDelete(id);

    res.json({ success: true, message: "User and associated data deleted successfully" });
  } catch (error) {
    console.error("Admin Delete User Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Change Booking Status
export const adminChangeBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, message: "Booking status updated successfully", booking });
  } catch (error) {
    console.error("Admin Update Booking Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Delete Booking
export const adminDeleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Admin Delete Booking Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
