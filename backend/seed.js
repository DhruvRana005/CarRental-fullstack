import "dotenv/config";
import mongoose from "mongoose";
import Car from "./models/Car.js";
import User from "./models/User.js";
import Booking from "./models/Booking.js";

const MONGODB_URI = process.env.MONGODB_URI;

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      family: 4,
    });
    console.log("Connected to MongoDB for seeding...");

    // Check if data already exists
    const existingCars = await Car.countDocuments();
    const existingUsers = await User.countDocuments();
    if (existingCars > 0 || existingUsers > 0) {
      console.log(`Database already has ${existingUsers} users and ${existingCars} cars.`);
      console.log("Skipping seed to preserve existing data. Use clearDB.js first if you want to reset.");
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create Users
    const users = await User.create([
      {
        name: "Dhruv Rana",
        email: "dhruv@example.com",
        password: "password123",
        role: "customer",
      },
      {
        name: "Arjun Singh",
        email: "arjun@example.com",
        password: "password123",
        role: "customer",
      },
      {
        name: "Ravi Motors",
        email: "ravi@example.com",
        password: "password123",
        role: "owner",
      },
      {
        name: "Priya Sharma",
        email: "priya@example.com",
        password: "password123",
        role: "customer",
      },
      {
        name: "Elite Cars",
        email: "elite@example.com",
        password: "password123",
        role: "owner",
      },
    ]);
    console.log(`Created ${users.length} users.`);

    const owner1 = users.find((u) => u.email === "ravi@example.com");
    const owner2 = users.find((u) => u.email === "elite@example.com");
    const customer1 = users.find((u) => u.email === "dhruv@example.com");
    const customer2 = users.find((u) => u.email === "arjun@example.com");
    const customer3 = users.find((u) => u.email === "priya@example.com");

    // Create Cars
    const cars = await Car.create([
      {
        owner: owner1._id,
        brand: "Mercedes-Benz",
        model: "S-Class",
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=80",
        year: 2024,
        category: "Luxury Sedan",
        seating_capacity: 5,
        fuel_type: "Petrol",
        transmission: "Automatic",
        pricePerDay: 18000,
        location: "Mumbai",
        description: "The Mercedes-Benz S-Class is the flagship luxury sedan offering unmatched comfort and performance.",
        isAvailable: true,
        reviews: [
          { name: "Dhruv Rana", rating: 5, comment: "Absolutely stunning car! Smooth ride and premium feel.", createdAt: new Date("2026-06-10") },
          { name: "Priya Sharma", rating: 5, comment: "Best luxury rental experience ever. Highly recommend!", createdAt: new Date("2026-06-12") }
        ]
      },
      {
        owner: owner1._id,
        brand: "BMW",
        model: "M5 Competition",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80",
        year: 2023,
        category: "Sports Sedan",
        seating_capacity: 5,
        fuel_type: "Petrol",
        transmission: "Automatic",
        pricePerDay: 22000,
        location: "Delhi",
        description: "High performance meets executive luxury in the ultimate driving machine.",
        isAvailable: true,
        reviews: [
          { name: "Arjun Singh", rating: 5, comment: "The power and handling is unreal. Dream car to drive!", createdAt: new Date("2026-06-11") }
        ]
      },
      {
        owner: owner2._id,
        brand: "Audi",
        model: "e-tron GT",
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80",
        year: 2024,
        category: "Electric GT",
        seating_capacity: 4,
        fuel_type: "Electric",
        transmission: "Automatic",
        pricePerDay: 25000,
        location: "Bangalore",
        description: "The Audi e-tron GT combines progressive design with high athletic performance.",
        isAvailable: true,
        reviews: [
          { name: "Dhruv Rana", rating: 4, comment: "Silent, fast, and super futuristic. Loved every minute.", createdAt: new Date("2026-06-14") }
        ]
      },
      {
        owner: owner2._id,
        brand: "Porsche",
        model: "911 Carrera S",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
        year: 2023,
        category: "Supercar",
        seating_capacity: 2,
        fuel_type: "Petrol",
        transmission: "Automatic",
        pricePerDay: 35000,
        location: "Pune",
        description: "The iconic Porsche 911 offers pure driving pleasure and classic sportscar aesthetics.",
        isAvailable: true,
        reviews: []
      },
      {
        owner: owner1._id,
        brand: "Range Rover",
        model: "Autobiography",
        image: "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&auto=format&fit=crop&q=80",
        year: 2024,
        category: "Luxury SUV",
        seating_capacity: 7,
        fuel_type: "Diesel",
        transmission: "Automatic",
        pricePerDay: 20000,
        location: "Mumbai",
        description: "The ultimate luxury SUV offering legendary off-road capabilities and commanding presence.",
        isAvailable: true,
        reviews: [
          { name: "Priya Sharma", rating: 5, comment: "Perfect for our family trip. Spacious and comfortable.", createdAt: new Date("2026-06-15") }
        ]
      },
      {
        owner: owner2._id,
        brand: "Tesla",
        model: "Model S Plaid",
        image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80",
        year: 2023,
        category: "Electric Sedan",
        seating_capacity: 5,
        fuel_type: "Electric",
        transmission: "Automatic",
        pricePerDay: 24000,
        location: "Hyderabad",
        description: "Tesla Model S Plaid is the quickest accelerating electric sedan packed with futurist technology.",
        isAvailable: true,
        reviews: []
      },
    ]);
    console.log(`Created ${cars.length} cars.`);

    // Create Bookings
    const bookings = await Booking.create([
      {
        car: cars[0]._id,
        user: customer1._id,
        owner: owner1._id,
        pickupDate: new Date("2026-06-10"),
        returnDate: new Date("2026-06-15"),
        status: "confirmed",
        price: 108000,
      },
      {
        car: cars[1]._id,
        user: customer2._id,
        owner: owner1._id,
        pickupDate: new Date("2026-06-12"),
        returnDate: new Date("2026-06-14"),
        status: "confirmed",
        price: 66000,
      },
      {
        car: cars[2]._id,
        user: customer3._id,
        owner: owner2._id,
        pickupDate: new Date("2026-06-20"),
        returnDate: new Date("2026-06-23"),
        status: "pending",
        price: 100000,
      },
      {
        car: cars[3]._id,
        user: customer1._id,
        owner: owner2._id,
        pickupDate: new Date("2026-06-25"),
        returnDate: new Date("2026-06-27"),
        status: "pending",
        price: 105000,
      },
      {
        car: cars[4]._id,
        user: customer2._id,
        owner: owner1._id,
        pickupDate: new Date("2026-06-08"),
        returnDate: new Date("2026-06-10"),
        status: "cancelled",
        price: 60000,
      },
    ]);
    console.log(`Created ${bookings.length} bookings.`);

    console.log("\n✅ Database seeded successfully!");
    console.log("Summary:");
    console.log(`  - Users: ${users.length} (3 customers, 2 owners)`);
    console.log(`  - Cars: ${cars.length} (with reviews)`);
    console.log(`  - Bookings: ${bookings.length}`);
    console.log(`  - Total Revenue: ₹${bookings.reduce((s, b) => s + b.price, 0).toLocaleString()}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedData();
