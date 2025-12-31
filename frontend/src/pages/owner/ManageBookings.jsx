import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import Title from '../../components/owner/Title';
import assets from '../../assets/assets';
import toast from 'react-hot-toast';
import axios from 'axios';

const ManageBookings = () => {
  const { ownerBookings, fetchOwnerBookings, currency } = useAppContext();

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.post("/api/booking/change-status", { bookingId, status: newStatus });
      toast.success("Status updated");
      fetchOwnerBookings();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title="Manage Bookings" subTitle="Track and manage all customer bookings" />

      {ownerBookings.length === 0 ? (
        <p className="text-center py-10 text-gray-500">No bookings yet.</p>
      ) : (
        <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
          <table className='w-full border-collapse text-left text-sm text-gray-600'>
            <thead className='text-gray-500'>
              <tr>
                <th className='p-3 font-medium'>Car</th>
                <th className='p-3 font-medium max-md:hidden'>Date Range</th>
                <th className='p-3 font-medium'>Total</th>
                <th className='p-3 font-medium max-md:hidden'>Status</th>
                <th className='p-3 font-medium'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ownerBookings.map((booking) => (
                <tr key={booking._id} className='border-t border-borderColor'>
                  <td className='p-3 flex items-center gap-3'>
                    <img src={booking.car?.image} alt="" className='h-12 w-12 rounded-md object-cover' />
                    <p className='font-medium max-md:hidden'>{booking.car?.brand} {booking.car?.model}</p>
                  </td>
                  <td className='p-3 max-md:hidden'>
                    {new Date(booking.pickupDate).toLocaleDateString()} to {new Date(booking.returnDate).toLocaleDateString()}
                  </td>
                  <td className='p-3'>{currency}{booking.price}</td>
                  <td className='p-3'>
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className='px-2 py-1.5 border border-borderColor rounded-md'
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;