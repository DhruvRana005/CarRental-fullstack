import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [cars, setCars] = useState([]);
  const [ownerCars, setOwnerCars] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const fetchUser = async () => {
    if (!token) return;

    try {
      const { data } = await axios.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
        if (data.user.role === "owner") toast.success("Welcome Owner!");
      }
    } catch (error) {
      console.error("Fetch User Error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
      }
    }
  };

  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      if (data.success) setCars(data.cars || []);
    } catch (error) {
      console.error("Fetch Cars Error:", error);
    }
  };

  const fetchOwnerCars = async () => {
    if (!token || !isOwner) return;
    try {
      const { data } = await axios.get("/api/owner/cars");
      if (data.success) setOwnerCars(data.cars || []);
    } catch (error) {
      console.error("Fetch Owner Cars Error:", error);
    }
  };

  const fetchUserBookings = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("/api/booking/user");
      if (data.success) setUserBookings(data.bookings || []);
    } catch (error) {
      console.error("Fetch User Bookings Error:", error);
    }
  };

  const fetchOwnerBookings = async () => {
    if (!token || !isOwner) return;
    try {
      const { data } = await axios.get("/api/booking/owner");
      if (data.success) setOwnerBookings(data.bookings || []);
    } catch (error) {
      console.error("Fetch Owner Bookings Error:", error);
    }
  };

  const fetchDashboardData = async () => {
    if (!token || !isOwner) return;
    try {
      const { data } = await axios.get("/api/owner/dashboard");
      console.log("Dashboard API Response:", data);
      if (data.success) setDashboardData(data.dashboardData);
    } catch (error) {
      console.error("Dashboard fetch error:", error.response?.data);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    delete axios.defaults.headers.common["Authorization"];
    setCars([]);
    setOwnerCars([]);
    setOwnerBookings([]);
    setUserBookings([]);
    setDashboardData(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchCars();
      fetchUserBookings();
      if (isOwner) {
        fetchOwnerCars();
        fetchOwnerBookings();
        fetchDashboardData();
      }
    }
  }, [token, isOwner]);

  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    token,
    setToken,
    isOwner,
    setIsOwner,
    showLogin,
    setShowLogin,
    logout,
    fetchUser,
    fetchCars,
    cars,
    setCars,
    ownerCars,
    ownerBookings,
    userBookings,
    dashboardData,
    fetchOwnerCars,
    fetchUserBookings,
    fetchOwnerBookings,
    fetchDashboardData,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};