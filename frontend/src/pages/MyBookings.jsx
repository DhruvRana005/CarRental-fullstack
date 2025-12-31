import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Title from '../components/Title';
import assets from '../assets/assets';
import { motion } from 'motion/react'

const MyBookings = () => {
  const { userBookings, fetchUserBookings, currency } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      await fetchUserBookings();
      setLoading(false);
    };
    loadBookings();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading your bookings...</div>;
  }

  if (userBookings.length === 0) {
    return (
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'>
        <Title title='My Bookings' subTitle='View and manage your all car bookings' align="left" />
        <p className="text-center py-10 text-gray-500">You have no bookings yet.</p>
      </div>
    );
  }

  return (
    <motion.div 
    initial={{ opacity: 0, y: 30}}
    animate={{ opacity: 1, y: 0}}
    transition={{ duration: 0.6 }}
    className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'>
      <Title title='My Bookings' subTitle='View and manage your all car bookings' align="left" />

      <div>
        {userBookings.map((booking, index) => (
          <div key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>
            {/* Car Image + Info */}
            <div className='md:col-span-1'>
              <div className='rounded-md overflow-hidden mb-3'>
                <img src={booking.car?.image} alt="" className='w-full h-auto aspect-video object-cover' />
              </div>
              <p className='text-lg font-medium mt-2'>{booking.car?.brand} {booking.car?.model}</p>
              <p className='text-gray-500'>{booking.car?.year} • {booking.car?.category} • {booking.car?.location}</p>
            </div>

            {/* Booking Info */}
            <div className='md:col-span-2'>
              <div className='flex items-center gap-2'>
                <p className='px-3 py-1.5 bg-light rounded'>Booking #{index + 1}</p>
                <p className={`px-3 py-1 text-xs rounded-full ${
                  booking.status === 'confirmed' ? 'bg-green-400/15 text-green-600' : 'bg-red-400/15 text-red-600'
                }`}>
                  {booking.status}
                </p>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1' />
                <div>
                  <p className='text-gray-500'>Rental Period</p>
                  <p>{new Date(booking.pickupDate).toLocaleDateString()} To {new Date(booking.returnDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1' />
                <div>
                  <p className='text-gray-500'>Pick-up Location</p>
                  <p>{booking.car?.location}</p>
                </div>
              </div>
            </div>

            {/* Price & Date */}
            <div className='md:col-span-1 flex flex-col justify-between gap-6'>
              <div className='text-sm text-gray-500 text-right'>
                <p>Total Price</p>
                <h1 className='text-2xl font-semibold text-primary'>{currency}{booking.price?.toLocaleString()}</h1>
                <p>Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MyBookings;