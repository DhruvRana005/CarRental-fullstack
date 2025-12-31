import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import assets from '../assets/assets';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(true);
  const currency = import.meta.env.VITE_CURRENCY || '₹';

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await axios.get(`/api/user/cars`);
        const foundCar = data.cars.find((c) => c._id === id);
        if (foundCar) setCar(foundCar);
        else {
          toast.error("Car not found");
          navigate('/cars');
        }
      } catch (error) {
        toast.error("Failed to load car details");
        navigate('/cars');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, navigate]);

  useEffect(() => {
    if (pickupDate && returnDate && pickupDate <= returnDate) {
      const pickup = new Date(pickupDate);
      const returnD = new Date(returnDate);
      const days = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24)) + 1;
      setTotalDays(days > 0 ? days : 0);
      setTotalPrice(days > 0 ? days * car?.pricePerDay : 0);
    } else {
      setTotalDays(0);
      setTotalPrice(0);
    }
  }, [pickupDate, returnDate, car]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickupDate || !returnDate) {
      toast.error('Please select both pickup and return dates.');
      return;
    }
    if (pickupDate > returnDate) {
      toast.error('Return date must be after pickup date.');
      return;
    }
    try {
      const { data } = await axios.post('/api/booking/create', {
        car: id,
        pickupDate,
        returnDate,
      });
      if (data.success) {
        toast.success(`Booking confirmed with ${paymentMethod.toUpperCase()}! Total: ${currency}${totalPrice}`);
        navigate('/my-bookings');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) return <Loader />;
  if (!car) return <div className="text-center py-20 text-red-600 text-2xl">Car not found</div>;

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-8 text-gray-500 cursor-pointer hover:text-gray-700 transition"
      >
        <img src={assets.arrow_icon} alt="back" className="rotate-180 opacity-65 w-5 h-5" />
        Back to all Cars
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-auto md:max-h-96 lg:max-h-full object-cover rounded-xl mb-6 shadow-2xl"
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-8"
          >
            <div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-5xl font-bold text-gray-800"
              >
                {car.brand} {car.model}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-500 text-lg mt-2"
              >
                {car.category} • {car.year}
              </motion.p>
            </div>
            <hr className="border-borderColor" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex flex-col items-center bg-light p-5 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  <img src={spec.icon} alt="" className="h-8 mb-3" />
                  <p className="text-sm text-center font-medium">{spec.text}</p>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-2xl font-medium mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{car.description}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h2 className="text-2xl font-medium mb-4">Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Camera", "Keyless Entry"].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-center text-gray-700 text-lg"
                  >
                    <img src={assets.check_icon} className="h-5 mr-3 text-primary" alt="check" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>

        <motion.form
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="shadow-2xl h-max sticky top-20 rounded-2xl p-8 space-y-8 bg-white text-gray-700 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <motion.p
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold text-gray-800"
            >
              {currency}{car.pricePerDay}
            </motion.p>
            <span className="text-lg text-gray-500 font-normal">per day</span>
          </div>
          {totalDays > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl"
            >
              <p className="text-2xl font-bold text-primary">
                Total: {currency}{totalPrice}
              </p>
              <p className="text-gray-600 mt-1">
                ({totalDays} {totalDays === 1 ? 'day' : 'days'})
              </p>
            </motion.div>
          )}
          <hr className="border-borderColor" />
          <div className="space-y-6">
            <div>
              <label htmlFor="pickup-date" className="block text-sm font-medium mb-2">Pickup Date</label>
              <input
                type="date"
                id="pickup-date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={today}
                required
                className="w-full border border-gray-300 px-5 py-3.5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
            <div>
              <label htmlFor="return-date" className="block text-sm font-medium mb-2">Return Date</label>
              <input
                type="date"
                id="return-date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={pickupDate || today}
                required
                className="w-full border border-gray-300 px-5 py-3.5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-gray-300 px-5 py-3.5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition"
              >
                <option value="upi">UPI</option>
                <option value="card">Credit/Debit Card</option>
                <option value="cash">Cash on Delivery</option>
              </select>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-primary hover:bg-primary-dull transition-all py-4 font-bold text-white rounded-xl cursor-pointer text-xl shadow-lg"
          >
            Book Now
          </motion.button>
          <p className="text-center text-sm text-gray-500">No credit card required to reserve</p>
        </motion.form>
      </div>
    </div>
  );
};

export default CarDetails;