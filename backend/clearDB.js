import "dotenv/config";
import mongoose from "mongoose";
import Car from "./models/Car.js";
import User from "./models/User.js";
import Booking from "./models/Booking.js";

const MONGODB_URI = process.env.MONGODB_URI;

const clearDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      family: 4,
    });
    console.log("Connected to MongoDB for clearing...");

    // Clear all collections
    const carsResult = await Car.deleteMany({});
    const usersResult = await User.deleteMany({});
    const bookingsResult = await Booking.deleteMany({});

    console.log("Wiped all fake data from the database:");
    console.log(`  - Cars deleted: ${carsResult.deletedCount}`);
    console.log(`  - Users deleted: ${usersResult.deletedCount}`);
    console.log(`  - Bookings deleted: ${bookingsResult.deletedCount}`);

    console.log("\n✅ Database is now clean and empty! Ready for real data.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Clearing database failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

clearDatabase();
