import React, { useState } from 'react';
import assets from '../assets/assets';
import { cityList } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import {motion} from 'motion/react'

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext();

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
    className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center'>
      <motion.h1 initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2}}
      className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight'>
        Luxury Cars on Rent
      </motion.h1>

      <motion.form
      initial={{ scale: 0.95, opacity: 0, y: 50}}
      animate={{ scale: 1, opacity: 1, y: 0}}
      transition={{ duration: 0.6, delay: 0.4 }}
        onSubmit={handleSearch}
        className='flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-2xl md:rounded-full w-full max-w-4xl bg-white shadow-2xl'
      >
        <div className='flex flex-col gap-2 w-full md:w-auto'>
          <select
            required
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className='px-6 py-4 text-lg font-medium text-gray-700 bg-transparent rounded-xl focus:outline-none focus:border-primary transition cursor-pointer'
          >
            <option value="" disabled>Pickup Location</option>
            {cityList.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <p className='text-left px-1 text-sm md:text-base'>
            {pickupLocation ? (
              <span className='font-semibold text-primary'>{pickupLocation}</span>
            ) : (
              <span className='text-gray-400 italic'>Please select a location</span>
            )}
          </p>
        </div>

        <div className='flex flex-col gap-2 w-full md:w-auto'>
          <label htmlFor="pickup-date">Pick-up Date</label>
          <input
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            type="date"
            id="pickup-date"
            min={new Date().toISOString().split('T')[0]}
            className='text-sm text-gray-500'
            required
          />
        </div>

        <div className='flex flex-col gap-2 w-full md:w-auto'>
          <label htmlFor="return-date">Return Date</label>
          <input
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            type="date"
            id="return-date"
            className='text-sm text-gray-500'
            required
          />
        </div>

        <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
          type='submit' className='flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer'> <img src={assets.search_icon} alt="search" className='brightness-300' />Search
        </motion.button>
      </motion.form>

      <motion.img initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.6}} src={assets.main_car} alt='Luxury Car' className='max-h-74 mt-8 animate-fade-in'/>
    </motion.div>
  );
};

export default Hero;