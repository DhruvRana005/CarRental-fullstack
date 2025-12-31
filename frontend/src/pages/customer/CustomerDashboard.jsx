import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import Title from '../../components/Title';
import assets from '../../assets/assets';

const CustomerDashboard = () => {
  const { userBookings, currency } = useAppContext();

  const stats = [
    { title: "Total Bookings", value: userBookings.length, icon: assets.listIcon },
    { title: "Confirmed", value: userBookings.filter(b => b.status === 'confirmed').length, icon: assets.check_icon },
    { title: "Pending", value: userBookings.filter(b => b.status === 'pending').length, icon: assets.clock_icon },
    { title: "Total Spent", value: userBookings.reduce((sum, b) => sum + b.price, 0), icon: assets.rupee_icon },
  ];

  return (
    <div className="space-y-8">
      <Title title="Customer Dashboard" subTitle="Manage your bookings and track your rentals" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.title.includes('Spent') ? `${currency}${stat.value.toLocaleString()}` : stat.value}
                </p>
              </div>
              <img src={stat.icon} alt={stat.title} className="w-10 h-10" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        {userBookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet. Book your first car!</p>
        ) : (
          <div className="space-y-4">
            {userBookings.slice(0, 3).map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <img src={booking.car?.image} alt={booking.car?.model} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <p className="font-medium">{booking.car?.brand} {booking.car?.model}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{currency}{booking.price}</p>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
            {userBookings.length > 3 && (
              <div className="text-center pt-4">
                <Link to="/customer/bookings" className="text-primary hover:underline">
                  View All Bookings
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;