import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import assets from "../assets/assets";

const AdminPanel = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    !!localStorage.getItem("adminToken")
  );
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("bookings"); // 'bookings' | 'users' | 'cars' | 'analytics'

  // Admin Dashboard Data
  const [dashboardData, setDashboardData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Edit / Add Car states
  const [showCarModal, setShowCarModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' | 'edit'
  const [editingCarId, setEditingCarId] = useState(null);
  const [carForm, setCarForm] = useState({
    brand: "",
    model: "",
    image: "",
    year: "",
    category: "",
    seating_capacity: "5",
    fuel_type: "Petrol",
    transmission: "Automatic",
    pricePerDay: "",
    location: "",
    description: "",
  });

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  });

  // Fetch Dashboard Stats
  const fetchDashboardStats = async () => {
    setDataLoading(true);
    try {
      const { data } = await axios.get("/api/admin/dashboard", getHeaders());
      if (data.success) {
        setDashboardData(data.data);
      } else {
        toast.error("Failed to load dashboard data");
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchDashboardStats();
    }
  }, [isAdminLoggedIn]);

  useEffect(() => {
    if (!isAdminLoggedIn) return;

    let logoutTimeout;

    const checkInactiveTimeOnLoad = () => {
      const lastActive = localStorage.getItem("adminLastActive");
      if (lastActive) {
        const timeDiff = Date.now() - parseInt(lastActive, 10);
        if (timeDiff >= 3 * 60 * 1000) {
          handleLogout();
          toast.error("Session expired due to inactivity");
        }
      }
    };

    checkInactiveTimeOnLoad();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        localStorage.setItem("adminLastActive", Date.now().toString());
        logoutTimeout = setTimeout(() => {
          handleLogout();
          toast.error("Logged out due to inactivity");
        }, 3 * 60 * 1000);
      } else {
        if (logoutTimeout) clearTimeout(logoutTimeout);
        const lastActive = localStorage.getItem("adminLastActive");
        if (lastActive) {
          const timeDiff = Date.now() - parseInt(lastActive, 10);
          if (timeDiff >= 3 * 60 * 1000) {
            handleLogout();
            toast.error("Session expired due to inactivity");
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleBeforeUnload = () => {
      localStorage.setItem("adminLastActive", Date.now().toString());
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (logoutTimeout) clearTimeout(logoutTimeout);
      // Automatically log out admin when component unmounts (closes/removed)
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminLastActive");
    };
  }, [isAdminLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/login", {
        email: adminEmail,
        password: adminPassword,
      });
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminLastActive", Date.now().toString());
        setIsAdminLoggedIn(true);
        toast.success("Welcome Admin!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Admin Credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminLastActive");
    setIsAdminLoggedIn(false);
    setDashboardData(null);
    toast.success("Admin Logged Out");
  };

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        const { data } = await axios.post("/api/admin/car", carForm, getHeaders());
        if (data.success) {
          toast.success(data.message);
          setShowCarModal(false);
          fetchDashboardStats();
        }
      } else {
        const { data } = await axios.put(`/api/admin/car/${editingCarId}`, carForm, getHeaders());
        if (data.success) {
          toast.success(data.message);
          setShowCarModal(false);
          fetchDashboardStats();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEditClick = (car) => {
    setModalMode("edit");
    setEditingCarId(car._id);
    setCarForm({
      brand: car.brand,
      model: car.model,
      image: car.image,
      year: car.year.toString(),
      category: car.category,
      seating_capacity: car.seating_capacity.toString(),
      fuel_type: car.fuel_type,
      transmission: car.transmission,
      pricePerDay: car.pricePerDay.toString(),
      location: car.location,
      description: car.description || "",
    });
    setShowCarModal(true);
  };

  const handleAddNewClick = () => {
    setModalMode("add");
    setEditingCarId(null);
    setCarForm({
      brand: "",
      model: "",
      image: "",
      year: new Date().getFullYear().toString(),
      category: "Luxury Sedan",
      seating_capacity: "5",
      fuel_type: "Petrol",
      transmission: "Automatic",
      pricePerDay: "",
      location: "",
      description: "",
    });
    setShowCarModal(true);
  };

  const handleDeleteCar = async (carId) => {
    if (!window.confirm("Are you sure you want to remove this car?")) return;
    try {
      const { data } = await axios.delete(`/api/admin/car/${carId}`, getHeaders());
      if (data.success) {
        toast.success(data.message);
        fetchDashboardStats();
      }
    } catch (error) {
      toast.error("Failed to delete car");
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.put(`/api/admin/booking/${bookingId}/status`, { status }, getHeaders());
      if (data.success) {
        toast.success(data.message);
        fetchDashboardStats();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking record?")) return;
    try {
      const { data } = await axios.delete(`/api/admin/booking/${bookingId}`, getHeaders());
      if (data.success) {
        toast.success(data.message);
        fetchDashboardStats();
      }
    } catch (error) {
      toast.error("Failed to delete booking");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This will also remove their cars & bookings.")) return;
    try {
      const { data } = await axios.delete(`/api/admin/user/${userId}`, getHeaders());
      if (data.success) {
        toast.success(data.message);
        fetchDashboardStats();
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-height-screen flex items-center justify-center p-6 bg-black text-white py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 rounded-2xl bg-emerald-950/10 backdrop-blur-xl border border-emerald-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        >
          <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            Admin Panel Login
          </h2>
          <form onSubmit={handleLogin} className="admin-login-form space-y-5">
            <div>
              <label className="block text-sm font-semibold text-emerald-400 mb-1">Admin Email</label>
              <div className="w-full px-4 py-3 bg-black/45 border border-emerald-500/20 rounded-xl focus-within:border-emerald-500 transition">
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full bg-transparent border-none outline-none text-white p-0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-400 mb-1">Password</label>
              <div className="w-full px-4 py-3 bg-black/45 border border-emerald-500/20 rounded-xl focus-within:border-emerald-500 transition flex items-center justify-between">
                <input
                  type={showPassword ? "text" : "password"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent border-none outline-none text-white p-0 pr-3"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-emerald-500/60 hover:text-emerald-400 focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-bold rounded-xl cursor-pointer transition shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
            >
              {loading ? "Authenticating..." : "Login As Admin"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-panel-container min-h-screen bg-black text-white p-6 md:p-12 pt-28">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-emerald-500/20 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent border-none outline-none select-none">
            4WHEELER ADMIN
          </h1>
          <p className="text-gray-400 text-sm mt-1">Platform-wide system configuration and overview</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-2.5 bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-900/20 rounded-xl cursor-pointer transition text-sm font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-emerald-500/10 mb-8 overflow-x-auto gap-2">
        {["bookings", "users", "cars", "analytics"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold uppercase tracking-wider text-sm border-b-2 cursor-pointer transition whitespace-nowrap ${
              activeTab === tab
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab === "bookings" ? "Manage Bookings" : tab}
          </button>
        ))}
      </div>

      {dataLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* REVENUE/BOOKINGS TAB */}
          {activeTab === "bookings" && dashboardData && (
            <div className="space-y-6">
              {/* Stats overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
                  <p className="text-gray-400 text-sm font-medium">Total Bookings Revenue</p>
                  <p className="text-3xl font-bold text-emerald-400 mt-2">
                    ₹{dashboardData.revenue.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
                  <p className="text-gray-400 text-sm font-medium">Total Bookings Placed</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {dashboardData.revenue.bookingCount} Bookings
                  </p>
                </div>
                <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
                  <p className="text-gray-400 text-sm font-medium">Average Order Value</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    ₹
                    {dashboardData.revenue.bookingCount > 0
                      ? Math.round(
                          dashboardData.revenue.totalRevenue /
                            dashboardData.revenue.bookingCount
                        ).toLocaleString()
                      : 0}
                  </p>
                </div>
              </div>

              {/* Bookings List */}
              <div className="bg-emerald-950/5 border border-emerald-500/10 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold mb-4">Bookings Details</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-emerald-500/20 text-gray-400 text-sm">
                        <th className="pb-3">User</th>
                        <th className="pb-3">Car</th>
                        <th className="pb-3">Duration</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-500/5 text-sm">
                      {dashboardData.revenue.bookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-emerald-950/5">
                          <td className="py-4">
                            <p className="font-semibold text-emerald-400">{booking.user?.name || "Deleted User"}</p>
                            <div className="text-xs text-gray-400 space-y-0.5 mt-1">
                              <p><span className="text-gray-500">Email:</span> {booking.userEmail || booking.user?.email}</p>
                              <p><span className="text-gray-500">Phone:</span> {booking.phone || "N/A"}</p>
                              <p className="max-w-[200px] break-words"><span className="text-gray-500">Address:</span> {booking.address || "N/A"}</p>
                            </div>
                          </td>
                          <td className="py-4">
                            <p className="font-semibold">
                              {booking.car?.brand} {booking.car?.model}
                            </p>
                            <p className="text-xs text-gray-500">{booking.car?.category}</p>
                          </td>
                          <td className="py-4">
                            {new Date(booking.pickupDate).toLocaleDateString()} to{" "}
                            {new Date(booking.returnDate).toLocaleDateString()}
                          </td>
                          <td className="py-4 text-emerald-400 font-bold">
                            ₹{booking.price?.toLocaleString()}
                          </td>
                          <td className="py-4">
                            <select
                              value={booking.status}
                              onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                              className="bg-black border border-emerald-500/20 text-xs rounded-lg px-2 py-1 outline-none text-emerald-400 focus:border-emerald-500 cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => handleDeleteBooking(booking._id)}
                              className="px-2 py-1 text-xs bg-red-950/20 border border-red-500/30 hover:bg-red-900/30 text-red-400 rounded-lg cursor-pointer transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {dashboardData.revenue.bookings.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-10 text-gray-500">
                            No bookings found on the platform.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && dashboardData && (
            <div className="bg-emerald-950/5 border border-emerald-500/10 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Registered Platform Users</h3>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full">
                  Total Users: {dashboardData.users.length}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-emerald-500/20 text-gray-400 text-sm">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email Address</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Registered On</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-500/5 text-sm">
                    {dashboardData.users.map((user) => (
                      <tr key={user._id} className="hover:bg-emerald-950/5">
                        <td className="py-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-900/30 flex items-center justify-center font-bold text-emerald-400 uppercase">
                            {user.name.charAt(0)}
                          </div>
                          <p className="font-semibold">{user.name}</p>
                        </td>
                        <td className="py-4 text-gray-300">{user.email}</td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                              user.role === "owner"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="px-2.5 py-1 text-xs bg-red-950/20 border border-red-500/30 hover:bg-red-900/30 text-red-400 rounded-lg cursor-pointer transition"
                          >
                            Delete User
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CARS TAB */}
          {activeTab === "cars" && dashboardData && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Manage Cars Catalogue</h3>
                <button
                  onClick={handleAddNewClick}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-bold rounded-xl cursor-pointer transition shadow-[0_4px_12px_rgba(16,185,129,0.3)] text-sm"
                >
                  + Add New Car
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.cars.map((car) => (
                  <div
                    key={car._id}
                    className="bg-emerald-950/5 border border-emerald-500/10 hover:border-emerald-500/35 transition rounded-2xl overflow-hidden flex flex-col h-full shadow-lg"
                  >
                    <img
                      src={car.image}
                      alt={car.model}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xl font-bold">
                            {car.brand} {car.model}
                          </h4>
                          <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 text-xs font-semibold rounded">
                            {car.year}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                          {car.category} • {car.location}
                        </p>
                        <p className="text-sm text-gray-400 mt-3 line-clamp-2">
                          {car.description || "No description provided."}
                        </p>
                      </div>

                      <div className="mt-6">
                        <div className="flex justify-between items-center mb-4 border-t border-emerald-500/5 pt-4">
                          <span className="text-emerald-400 font-bold text-lg">
                            ₹{car.pricePerDay} / Day
                          </span>
                          <span className="text-xs text-gray-400">
                            Seats: {car.seating_capacity}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleEditClick(car)}
                            className="py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-xl cursor-pointer transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car._id)}
                            className="py-2.5 bg-red-950/20 border border-red-500/25 hover:bg-red-900/20 text-red-400 text-sm font-semibold rounded-xl cursor-pointer transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {dashboardData.cars.length === 0 && (
                <div className="col-span-full text-center py-20 text-gray-500 bg-emerald-950/5 border border-emerald-500/10 rounded-2xl">
                  No cars found in the fleet. Click "+ Add New Car" above to list your first vehicle.
                </div>
              )}
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === "analytics" && dashboardData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Core numbers */}
              <div className="bg-emerald-950/5 border border-emerald-500/10 rounded-2xl p-6 shadow-xl">
                <h4 className="text-lg font-bold mb-4 border-b border-emerald-500/10 pb-2">
                  System Stats
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Registered Users</span>
                    <span className="font-bold text-white">
                      {dashboardData.analytics.totalUsers}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Cars listed</span>
                    <span className="font-bold text-white">
                      {dashboardData.analytics.totalCars}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Bookings Completed</span>
                    <span className="font-bold text-white">
                      {dashboardData.analytics.totalBookings}
                    </span>
                  </div>
                </div>
              </div>

              {/* Roles Breakdown */}
              <div className="bg-emerald-950/5 border border-emerald-500/10 rounded-2xl p-6 shadow-xl">
                <h4 className="text-lg font-bold mb-4 border-b border-emerald-500/10 pb-2">
                  Users Breakdown
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Customers</span>
                    <span className="font-bold text-blue-400">
                      {dashboardData.analytics.roleCounts.customer}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Owners</span>
                    <span className="font-bold text-amber-400">
                      {dashboardData.analytics.roleCounts.owner}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-emerald-950/5 border border-emerald-500/10 rounded-2xl p-6 shadow-xl md:col-span-2">
                <h4 className="text-lg font-bold mb-4 border-b border-emerald-500/10 pb-2">
                  Cars by Category
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                  {Object.entries(dashboardData.analytics.categoryCounts).map(
                    ([cat, count]) => (
                      <div
                        key={cat}
                        className="bg-black/35 border border-emerald-500/15 rounded-xl p-4 text-center"
                      >
                        <p className="text-gray-400 text-xs font-semibold uppercase">
                          {cat}
                        </p>
                        <p className="text-2xl font-bold text-emerald-400 mt-1">
                          {count}
                        </p>
                      </div>
                    )
                  )}
                  {Object.keys(dashboardData.analytics.categoryCounts).length ===
                    0 && (
                    <p className="col-span-full text-center text-gray-500 py-4">
                      No categories found.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ADD/EDIT CAR MODAL */}
      {showCarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-[#030704] border border-emerald-500/30 rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <h3 className="text-2xl font-bold mb-6 text-emerald-400">
              {modalMode === "add" ? "Add New Car to Fleet" : "Edit Car Details"}
            </h3>

            <form onSubmit={handleCarSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    required
                    value={carForm.brand}
                    onChange={(e) =>
                      setCarForm({ ...carForm, brand: e.target.value })
                    }
                    placeholder="e.g. Mercedes-Benz"
                    className="w-full bg-black border border-emerald-500/20 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    required
                    value={carForm.model}
                    onChange={(e) =>
                      setCarForm({ ...carForm, model: e.target.value })
                    }
                    placeholder="e.g. S-Class"
                    className="w-full bg-black border border-emerald-500/20 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={carForm.image}
                    onChange={(e) =>
                      setCarForm({ ...carForm, image: e.target.value })
                    }
                    placeholder="Leave empty for default image"
                    className="w-full bg-black border border-emerald-500/20 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    required
                    value={carForm.year}
                    onChange={(e) =>
                      setCarForm({ ...carForm, year: e.target.value })
                    }
                    placeholder="e.g. 2024"
                    className="w-full bg-black border border-emerald-500/20 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={carForm.category}
                    onChange={(e) =>
                      setCarForm({ ...carForm, category: e.target.value })
                    }
                    placeholder="e.g. Luxury Sedan, SUV"
                    className="w-full bg-black border border-emerald-500/20 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    required
                    value={carForm.seating_capacity}
                    onChange={(e) =>
                      setCarForm({
                        ...carForm,
                        seating_capacity: e.target.value,
                      })
                    }
                    className="w-full bg-black border border-emerald-500/20 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">
                    Fuel Type
                  </label>
                  <select
                    value={carForm.fuel_type}
                    onChange={(e) =>
                      setCarForm({ ...carForm, fuel_type: e.target.value })
                    }
                    className="w-full bg-black border border-emerald-500/20 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500 text-sm"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">
                    Transmission
                  </label>
                  <select
                    value={carForm.transmission}
                    onChange={(e) =>
                      setCarForm({ ...carForm, transmission: e.target.value })
                    }
                    className="w-full bg-black border border-emerald-500/20 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500 text-sm"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">
                    Price Per Day (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={carForm.pricePerDay}
                    onChange={(e) =>
                      setCarForm({ ...carForm, pricePerDay: e.target.value })
                    }
                    placeholder="e.g. 15000"
                    className="w-full bg-black border border-emerald-500/20 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">
                    Location City
                  </label>
                  <input
                    type="text"
                    required
                    value={carForm.location}
                    onChange={(e) =>
                      setCarForm({ ...carForm, location: e.target.value })
                    }
                    placeholder="e.g. Mumbai"
                    className="w-full bg-black border border-emerald-500/20 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-1">
                  Description
                </label>
                <textarea
                  value={carForm.description}
                  onChange={(e) =>
                    setCarForm({ ...carForm, description: e.target.value })
                  }
                  rows="3"
                  className="w-full bg-black border border-emerald-500/20 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCarModal(false)}
                  className="px-5 py-2.5 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 text-gray-300 rounded-xl cursor-pointer text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-bold rounded-xl cursor-pointer transition text-sm"
                >
                  {modalMode === "add" ? "Save Car" : "Update Car"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
