import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import Title from '../../components/owner/Title';
import assets from '../../assets/assets';

const Dashboard = () => {
  const { dashboardData, fetchDashboardData, isOwner, currency } = useAppContext();

  useEffect(() => {
    if (isOwner) {
      fetchDashboardData();
    }
  }, [isOwner]);

  if (!isOwner) {
    return <div className="p-10 text-center text-red-600">Access denied. Owner only.</div>;
  }

  if (!dashboardData) {
    return <div className="p-10 text-center">Loading dashboard data...</div>;
  }

  const dashboardCards = [
    { title: "Total Cars", value: dashboardData.totalCars, icon: assets.carIconColored },
    { title: "Total Bookings", value: dashboardData.totalBookings, icon: assets.listIconColored },
    { title: "Pending", value: dashboardData.pendingBookings, icon: assets.cautionIconColored },
    { title: "Confirmed", value: dashboardData.completedBookings, icon: assets.listIconColored },
  ];

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>
      <Title
        title="Admin Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, revenue and recent activities"
      />

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
        {/* Recent Bookings */}
        <div className='p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full'>
          <h1 className='text-lg font-medium'>Recent Bookings</h1>
          <p className='text-gray-500'>Latest customer bookings</p>

          {dashboardData.recentBookings.length === 0 ? (
            <p className="text-center text-gray-500 mt-6">No recent bookings yet.</p>
          ) : (
            dashboardData.recentBookings.map((booking, index) => (
              <div key={index} className='mt-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10'>
                    <img src={assets.listIconColored} alt="Booking" className='h-5 w-5'/>
                  </div>
                  <div>
                    <p>{booking.car?.brand} {booking.car?.model}</p>
                    <p className='text-sm text-gray-500'>
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2 font-medium'>
                  <p className='text-sm text-gray-500'>
                    {currency}{booking.price}
                  </p>
                  <p className={`px-3 py-0.5 border border-borderColor rounded-full text-sm ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {booking.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Monthly Revenue */}
        <div className='p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-xs'>
          <h1 className='text-lg font-medium'>Monthly Revenue</h1>
          <p className='text-gray-500'>Revenue for current month</p>
          <p className='text-3xl mt-6 font-semibold text-primary'>
            {currency}{dashboardData.monthlyRevenue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;