import React, { useState, useEffect, useRef } from 'react';
import assets from '../assets/assets';
import { cityList } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import {motion} from 'motion/react'

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleResize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Create stars
    const stars = [];
    const starCount = 80;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random()
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${star.opacity})`;
        ctx.fill();

        // Move star
        star.x += star.speedX;
        star.y += star.speedY;

        // Wrap around borders
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Twinkle
        star.opacity += (Math.random() - 0.5) * 0.05;
        if (star.opacity < 0.1) star.opacity = 0.1;
        if (star.opacity > 0.8) star.opacity = 0.8;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!pickupDate || !returnDate) {
      toast.error("Please select both pickup and return dates");
      return;
    }

    if (pickupDate > returnDate) {
      toast.error("Return date must be after pickup date");
      return;
    }

    try {
      const { data } = await axios.post("/api/booking/check-availability", {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });

      if (data.success && data.availableCars.length === 0) {
        toast.error("No cars available for selected dates and location");
        return;
      }

      if (data.success) {
        navigate(`/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`);
      } else {
        toast.error(data.message || "Failed to check availability");
      }
    } catch (error) {
      console.error("Availability Check Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className='relative h-screen flex flex-col items-center justify-center gap-14 bg-transparent text-center overflow-hidden'
    >
      {/* Moving Stars Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2}}
        className='relative z-10 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight'
      >
        Luxury Cars on Rent
      </motion.h1>

      <motion.form
        initial={{ scale: 0.95, opacity: 0, y: 50}}
        animate={{ scale: 1, opacity: 1, y: 0}}
        transition={{ duration: 0.6, delay: 0.4 }}
        onSubmit={handleSearch}
        className='hero-search-bar relative z-10 flex flex-col md:flex-row items-stretch justify-between p-2.5 w-full max-w-4xl bg-black/45 backdrop-blur-xl border border-emerald-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
      >
        {/* Column 1: Location */}
        <div className='flex-1 flex flex-col justify-center px-6 py-3 hover:bg-emerald-950/20 transition cursor-pointer group'>
          <label className='text-xs font-semibold text-emerald-400 uppercase tracking-wider text-left mb-1'>Location</label>
          <div className='flex items-center gap-2'>
            <select
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className='w-full text-base font-medium text-white bg-transparent border-none outline-none focus:ring-0 cursor-pointer p-0 appearance-none'
              style={{ background: 'transparent' }}
            >
              <option value="" disabled className="bg-black text-gray-400">Select City</option>
              {cityList.map((city) => (
                <option key={city} value={city} className="bg-black text-white">{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Divider */}
        <div className='hidden md:block w-[1px] bg-emerald-500/10 my-3' />

        {/* Column 2: Pickup Date */}
        <div className='flex-1 flex flex-col justify-center px-6 py-3 hover:bg-emerald-950/20 transition cursor-pointer group'>
          <label htmlFor="pickup-date" className='text-xs font-semibold text-emerald-400 uppercase tracking-wider text-left mb-1'>Pick-up Date</label>
          <input
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            type="date"
            id="pickup-date"
            min={new Date().toISOString().split('T')[0]}
            className='w-full text-base font-medium text-white bg-transparent border-none outline-none focus:ring-0 p-0 cursor-pointer'
            required
            style={{ colorScheme: 'dark' }}
          />
        </div>

        {/* Divider */}
        <div className='hidden md:block w-[1px] bg-emerald-500/10 my-3' />

        {/* Column 3: Return Date */}
        <div className='flex-1 flex flex-col justify-center px-6 py-3 hover:bg-emerald-950/20 transition cursor-pointer group'>
          <label htmlFor="return-date" className='text-xs font-semibold text-emerald-400 uppercase tracking-wider text-left mb-1'>Return Date</label>
          <input
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            type="date"
            id="return-date"
            className='w-full text-base font-medium text-white bg-transparent border-none outline-none focus:ring-0 p-0 cursor-pointer'
            required
            style={{ colorScheme: 'dark' }}
          />
        </div>

        {/* Action button */}
        <div className='flex items-center justify-center p-2'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type='submit'
            className='flex items-center justify-center gap-2 px-8 py-3.5 w-full md:w-auto bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-bold cursor-pointer transition shadow-[0_4px_15px_rgba(16,185,129,0.3)]'
          >
            <img src={assets.search_icon} alt="search" className='brightness-0 h-4 w-4' />
            Search
          </motion.button>
        </div>
      </motion.form>

      <motion.img initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.6}} src={assets.main_car} alt='Luxury Car' className='relative z-10 max-h-74 mt-8 animate-fade-in'/>
    </motion.div>
  );
};

export default Hero;