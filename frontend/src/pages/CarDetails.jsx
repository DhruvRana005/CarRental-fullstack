import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import assets from '../assets/assets';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, token, fetchCars, user, pickupDate: contextPickup, returnDate: contextReturn } = useAppContext();
  const [car, setCar] = useState(null);
  const [pickupDate, setPickupDate] = useState(contextPickup || '');
  const [returnDate, setReturnDate] = useState(contextReturn || '');

  const getYYYYMMDD = (dateVal) => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isCarBookedForDates = (carObj, start, end) => {
    if (!carObj || !carObj.activeBookings || carObj.activeBookings.length === 0) return false;
    
    let targetStartStr = start;
    let targetEndStr = end;
    
    if (!start || !end) {
      const todayStr = getYYYYMMDD(new Date());
      targetStartStr = todayStr;
      targetEndStr = todayStr;
    }
    
    return carObj.activeBookings.some(b => {
      const bStartStr = getYYYYMMDD(b.pickupDate);
      const bEndStr = getYYYYMMDD(b.returnDate);
      return bStartStr <= targetEndStr && bEndStr >= targetStartStr;
    });
  };

  const isBooked = isCarBookedForDates(car, pickupDate, returnDate);
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [userEmail, setUserEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const currency = import.meta.env.VITE_CURRENCY || '₹';

  useEffect(() => {
    if (user && user.email) {
      setUserEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (cars && cars.length > 0) {
      const foundCar = cars.find((c) => c._id === id);
      if (foundCar) {
        setCar(foundCar);
        setLoading(false);
      } else {
        toast.error("Car not found");
        navigate('/cars');
      }
    }
  }, [id, cars, navigate]);

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
    if (!userEmail.trim() || !phone.trim() || !address.trim()) {
      toast.error('Please fill in your Email, Phone Number, and Address.');
      return;
    }
    try {
      const { data } = await axios.post('/api/booking/create', {
        car: id,
        pickupDate,
        returnDate,
        userEmail,
        phone,
        address
      });
      if (data.success) {
        toast.success(`Booking confirmed with ${paymentMethod.toUpperCase()}! Total: ${currency}${totalPrice}`);
        navigate('/my-bookings');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to submit a review.");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please enter a comment.");
      return;
    }
    setSubmittingReview(true);
    try {
      const { data } = await axios.post(`/api/user/car/${id}/review`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      if (data.success) {
        toast.success("Review posted successfully!");
        setReviewComment('');
        setReviewRating(5);
        // Refresh local car reviews
        setCar(prev => ({
          ...prev,
          reviews: data.reviews
        }));
        fetchCars(); // Refresh overall state
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post review");
    } finally {
      setSubmittingReview(false);
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

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="pt-6 border-t border-gray-100"
            >
              <h2 className="text-2xl font-medium mb-6">User Reviews ({car.reviews ? car.reviews.length : 0})</h2>
              
              {/* Display existing reviews */}
              <div className="space-y-6 mb-8 max-h-[350px] overflow-y-auto pr-2">
                {car.reviews && car.reviews.length > 0 ? (
                  car.reviews.map((rev, index) => (
                    <div key={index} className="bg-light p-5 rounded-xl border border-gray-100 space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-800">{rev.name}</p>
                        <span className="text-xs text-gray-400">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-0.5">
                        {Array(5).fill(0).map((_, starIdx) => (
                          <img
                            key={starIdx}
                            src={assets.star_icon}
                            alt="star"
                            className={`w-4 h-4 ${starIdx < rev.rating ? 'opacity-100' : 'opacity-25'}`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No reviews yet for this vehicle. Be the first to review!</p>
                )}
              </div>

              {/* Add a review form */}
              {token ? (
                <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
                  <h3 className="font-medium text-lg text-gray-850">Write a Review</h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-600">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none transition-transform active:scale-95 cursor-pointer"
                        >
                          <img
                            src={assets.star_icon}
                            alt="star"
                            className={`w-7 h-7 ${star <= reviewRating ? 'opacity-100 scale-110' : 'opacity-30'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="review-comment" className="block text-sm font-medium mb-1.5 text-gray-600">Your Comment</label>
                    <textarea
                      id="review-comment"
                      rows="3"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your rental experience..."
                      required
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition text-sm leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-primary hover:bg-primary-dull text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {submittingReview ? "Posting..." : "Post Review"}
                  </button>
                </form>
              ) : (
                <div className="bg-light/80 p-5 rounded-xl border border-dashed border-gray-300 text-center">
                  <p className="text-gray-500 text-sm">Please login to write a review for this car.</p>
                </div>
              )}
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
          {isBooked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <p className="text-xl font-bold text-red-600">
                Out of Stock
              </p>
              <p className="text-gray-650 text-sm mt-1">
                This car is already rented for the selected dates.
              </p>
            </motion.div>
          )}
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
              <label htmlFor="user-email" className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                id="user-email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-300 px-5 py-3.5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
            <div>
              <label htmlFor="user-phone" className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                id="user-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                required
                className="w-full border border-gray-300 px-5 py-3.5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
            <div>
              <label htmlFor="user-address" className="block text-sm font-medium mb-2">Delivery Address</label>
              <textarea
                id="user-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete delivery/pickup address"
                required
                rows="2"
                className="w-full border border-gray-300 px-5 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition resize-none"
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
            whileHover={!isBooked ? { scale: 1.05 } : {}}
            whileTap={!isBooked ? { scale: 0.95 } : {}}
            type="submit"
            disabled={isBooked}
            className={`w-full transition-all py-4 font-bold text-white rounded-xl text-xl shadow-lg ${isBooked ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dull cursor-pointer'}`}
          >
            {isBooked ? "Out of Stock" : "Book Now"}
          </motion.button>
          <p className="text-center text-sm text-gray-500">No credit card required to reserve</p>
        </motion.form>
      </div>
    </div>
  );
};

export default CarDetails;