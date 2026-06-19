import React, { useState } from "react";
import assets from "../assets/assets";
import { menuLinks } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import {motion} from 'motion/react'

const Navbar = () => {
  const { setShowLogin, logout, isOwner, axios, setIsOwner, token, user } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const changeRole = async () => {
    if (!token) {
      toast.warning("Please login first!");
      setShowLogin(true);
      return;
    }
  
    try {
      console.log("Authorization header before request:", axios.defaults.headers.common["Authorization"]);
      const { data } = await axios.post("/api/owner/change-role");
      console.log("Response from change-role:", data);
  
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message || "Now you can list cars!");
        navigate("/owner");
      } else {
        toast.error(data.message || "Failed to change role");
      }
    } catch (error) {
      console.error("Change Role Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <motion.div initial={{y: -20, opacity: 0}} animate={{y: 0, opacity:1}} transition={{duration: 0.5}}>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <motion.img whileHover={{scale: 1.05}} src="/favicon.png" alt="Logo" className="w-9 h-9 sm:w-10 sm:h-10" />
            <motion.span whileHover={{scale: 1.05}} className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
              4WHEELER
            </motion.span>
          </Link>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden z-50">
            {menuOpen ? (
              <img src={assets.close_icon} alt="Close" className="w-7 h-7" />
            ) : (
              <img src={assets.menu_icon} alt="Menu" className="w-7 h-7" />
            )}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {menuLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `font-medium hover:text-blue-600 transition-colors ${
                    isActive ? "text-blue-600 font-bold" : "text-gray-700"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="search-bar flex items-center border border-gray-300 rounded-full px-4 py-2">
              <input type="text" placeholder="Search..." className="outline-none w-48" />
              <img src={assets.search_icon} alt="search" className="w-5 h-5 ml-2" />
            </div>

            {/* Dashboard / Listcars Button */}
            <button
              onClick={() => {
                if (!token) {
                  toast.warning("Please login to list your cars");
                  setShowLogin(true);
                  return;
                }
                if (isOwner) {
                  navigate("/owner");
                } else {
                  changeRole();
                }
              }}
              className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isOwner ? "Dashboard" : "Listcars"}
            </button>

            {/* User display */}
            {token && user && (
              <div className="flex items-center gap-2 border-l border-gray-200 pl-4 py-1">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm uppercase shadow-sm">
                  {user.name ? user.name.charAt(0) : "U"}
                </div>
                <span className="text-gray-700 font-semibold text-sm max-w-[120px] truncate">
                  {user.name}
                </span>
              </div>
            )}

            {/* Login/Logout Button */}
            <button
              onClick={() => (token ? logout() : setShowLogin(true))}
              className={`px-7 py-2.5 rounded-lg font-medium text-white transition-colors ${
                token ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {token ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 top-16 bg-white z-40 transition-transform duration-300 lg:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-8 py-10 flex flex-col gap-8">
          {token && user && (
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-base uppercase">
                {user.name ? user.name.charAt(0) : "U"}
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium">Logged in as</p>
                <p className="text-gray-800 font-bold text-lg leading-tight">{user.name}</p>
              </div>
            </div>
          )}

          {menuLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-2xl font-medium ${isActive ? "text-blue-600 font-bold" : "text-gray-700"}`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <div className="search-bar flex items-center border-2 border-gray-300 rounded-full px-5 py-3">
            <input type="text" placeholder="Search cars..." className="flex-1 outline-none text-lg" />
            <img src={assets.search_icon} alt="search" className="w-6 h-6" />
          </div>

          <div className="flex flex-col gap-5 mt-6">
            <button
              onClick={() => {
                if (!token) {
                  toast.warning("Please login to list your cars");
                  setShowLogin(true);
                  setMenuOpen(false);
                  return;
                }
                if (isOwner) {
                  navigate("/owner");
                } else {
                  changeRole();
                }
                setMenuOpen(false);
              }}
              className="text-xl text-left font-medium text-gray-700 hover:text-blue-600"
            >
              {isOwner ? "Dashboard" : "Listcars"}
            </button>

            <button
              onClick={() => {
                token ? logout() : setShowLogin(true);
                setMenuOpen(false);
              }}
              className={`py-4 rounded-xl text-lg font-medium text-white ${
                token ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {token ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-20"></div>
    </motion.div>
  );
};

export default Navbar;