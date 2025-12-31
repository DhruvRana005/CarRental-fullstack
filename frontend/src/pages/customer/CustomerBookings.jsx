import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import Title from '../../components/Title';
import { Link } from 'react-router-dom';

const CustomerBookings = () => {
  const { userBookings, currency } = useAppContext();

  const upcoming = userBookings.filter(b => new Date(b.pickupDate) > new Date());
  const past = userBookings.filter(b => new Date(b.returnDate) < new Date());

  return (
    <div className="space-y-8">
      <Title title="My Bookings" subTitle="Track and manage your car rentals" />

      {/* Upcoming Bookings */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Bookings</h2>
        {upcoming.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">No upcoming bookings</p>
            <Link to="/cars" className="mt-4 inline-block bg-primary text-white px-6 py-3 rounded-lg">
              Book a Car
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((booking) => (
              <div key={booking._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <img src={booking.car?.image} alt={booking.car?.model} className="w-32 h-24 object-cover rounded-lg" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-semibold">{booking.car?.brand} {booking.car?.model}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 mb-4">{booking.car?.location}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-bold text-primary">{currency}{booking.price}</p>
                      <Link to={`/car-details/${booking.car?._id}`} className="text-primary hover:underline">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Bookings */}
      {past.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Past Bookings</h2>
          <div className="space-y-4">
            {past.slice(0, 5).map((booking) => (
              <div key={booking._id} className="bg-gray-50 p-4 rounded-xl border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={booking.car?.image} alt={booking.car?.model} className="w-16 h-12 object-cover rounded" />
                    <div>
                      <p className="font-medium">{booking.car?.brand} {booking.car?.model}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-primary">{currency}{booking.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBookings;