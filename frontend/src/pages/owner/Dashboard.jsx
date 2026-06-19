import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Title from '../../components/owner/Title';
import assets from '../../assets/assets';

const Dashboard = () => {
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
    return <div className="p-10 text-center text-gray-500">Loading dashboard data...</div>;
  }

  // Calculate statistics from the user's bookings
  const totalBookings = userBookings.length;
  const pendingBookings = userBookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = userBookings.filter(b => b.status === 'confirmed').length;
  const cancelledBookings = userBookings.filter(b => b.status === 'cancelled').length;

  const dashboardCards = [
    { title: "Total Booked Cars", value: totalBookings, icon: assets.carIconColored },
    { title: "Pending Bookings", value: pendingBookings, icon: assets.cautionIconColored },
    { title: "Confirmed Bookings", value: confirmedBookings, icon: assets.listIconColored },
    { title: "Cancelled Bookings", value: cancelledBookings, icon: assets.listIconColored },
  ];

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>
      <Title
        title="Dashboard"
        subTitle="Track your booked cars, rental periods, status and total spending details"
      />

      {/* Overview Cards */}
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl'>
        {dashboardCards.map((card, index) => (
          <div key={index} className='flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor'>
            <div>
              <h1 className='text-xs text-gray-500'>{card.title}</h1>
              <p className='text-lg font-semibold'>{card.value}</p>
            </div>
            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-primary/10'>
              <img src={card.icon} alt={card.title} className='h-4 w-4'/>
            </div>
          </div>
        ))}
      </div>

      <div className='flex flex-wrap items-start gap-6 mb-8 w-full'>
        {/* Booked Cars List */}
        <div className='p-4 md:p-6 border border-borderColor rounded-md max-w-2xl w-full'>
          <h1 className='text-lg font-medium'>My Booked Cars</h1>
          <p className='text-gray-500 mb-4'>Detailed list of cars booked by you</p>

          {userBookings.length === 0 ? (
            <p className="text-center text-gray-500 py-6">You haven't booked any cars yet.</p>
          ) : (
            <div className="space-y-4">
              {userBookings.map((booking, index) => (
                <div key={booking._id || index} className='flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-borderColor rounded-md gap-4'>
                  <div className='flex items-center gap-3'>
                    <img 
                      src={booking.car?.image || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=100&auto=format&fit=crop&q=80"} 
                      alt="" 
                      className='w-16 h-12 rounded object-cover'
                    />
                    <div>
                      <p className='font-semibold'>{booking.car?.brand} {booking.car?.model}</p>
                      <p className='text-xs text-gray-500'>
                        Period: {new Date(booking.pickupDate).toLocaleDateString()} to {new Date(booking.returnDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center justify-between sm:justify-end gap-4'>
                    <div className='text-right'>
                      <p className='text-sm font-semibold text-primary'>{currency}{booking.price?.toLocaleString()}</p>
                      <p className='text-[10px] text-gray-400'>Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;