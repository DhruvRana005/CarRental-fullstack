import Car from "../models/Car.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import fs from "fs";
import imagekit from "../utils/imagekit.js";

export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { role: "owner" },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Now you can list cars",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Change Role Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    let carData;
    try {
      carData = JSON.parse(req.body.carData);
    } catch (parseError) {
      return res.status(400).json({ success: false, message: "Invalid carData JSON format" });
    }

    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ success: false, message: "No image file uploaded" });
    }

    // Image upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: imageFile.buffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    const optimizedImageURL = imagekit.url({
      path: uploadResponse.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    const newCar = await Car.create({
      ...carData,
      owner: _id,
      image: optimizedImageURL,
    });

    res.status(201).json({ success: true, message: "Car Added Successfully", car: newCar });
  } catch (error) {
    console.error("Add Car Error:", error.message);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message).join(", ");
      return res.status(400).json({ success: false, message: errors });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, cars });
  } catch (error) {
    console.error("Get Owner Cars Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    if (car.owner.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.status(200).json({ success: true, message: "Availability Toggled", car });
  } catch (error) {
    console.error("Toggle Availability Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    if (car.owner.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    car.owner = null;
    car.isAvailable = false;
    await car.save();

    res.status(200).json({ success: true, message: "Car Removed" });
  } catch (error) {
    console.error("Delete Car Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get owner dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    const pendingBookings = bookings.filter(b => b.status === "pending");
    const completedBookings = bookings.filter(b => b.status === "confirmed");

    const monthlyRevenue = completedBookings.reduce((acc, b) => acc + b.price, 0);

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    };

    res.status(200).json({ success: true, dashboardData });
  } catch (error) {
    console.error("Get Dashboard Data Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const uploadResponse = await imagekit.upload({
      file: imageFile.buffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    const optimizedImageURL = imagekit.url({
      path: uploadResponse.filePath,
      transformation: [
        { width: "400" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    await User.findByIdAndUpdate(_id, { image: optimizedImageURL });

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      image: optimizedImageURL,
    });
  } catch (error) {
    console.error("Update User Image Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};