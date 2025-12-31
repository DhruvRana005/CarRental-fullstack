import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import Title from '../../components/Title';
import assets from '../../assets/assets';
import toast from 'react-hot-toast';
import axios from 'axios';

const ManageCars = () => {
  const { ownerCars, fetchOwnerCars, currency } = useAppContext();

  useEffect(() => {
    fetchOwnerCars();
  }, []);

  const toggleAvailability = async (carId, isAvailable) => {
    try {
      await axios.post("/api/owner/toggle-car", { carId });
      toast.success(`Car ${isAvailable ? "unavailable" : "available"} now`);
      fetchOwnerCars();
    } catch (error) {
      toast.error("Failed to toggle");
    }
  };

  const deleteCar = async (carId) => {
    if (!window.confirm("Delete this car?")) return;
    try {
      await axios.post("/api/owner/delete-car", { carId });
      toast.success("Car deleted");
      fetchOwnerCars();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title="Manage Cars" subTitle="View and manage your listed cars" />

      {ownerCars.length === 0 ? (
        <p className="text-center py-10 text-gray-500">No cars listed yet.</p>
      ) : (
        <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
          <table className='w-full border-collapse text-left text-sm text-gray-600'>
            <thead className='text-gray-500'>
              <tr>
                <th className='p-3 font-medium'>Car</th>
                <th className='p-3 font-medium max-md:hidden'>Category</th>
                <th className='p-3 font-medium'>Price</th>
                <th className='p-3 font-medium max-md:hidden'>Status</th>
                <th className='p-3 font-medium'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ownerCars.map((car) => (
                <tr key={car._id} className='border-t border-borderColor'>
                  <td className='p-3 flex items-center gap-3'>
                    <img src={car.image} alt="" className='h-12 w-12 rounded-md object-cover' />
                    <div className='max-md:hidden'>
                      <p className='font-medium'>{car.brand} {car.model}</p>
                    </div>
                  </td>
                  <td className='p-3 max-md:hidden'>{car.category}</td>
                  <td className='p-3'>{currency}{car.pricePerDay}/day</td>
                  <td className='p-3 max-md:hidden'>
                    <span className={`px-3 py-1 rounded-full text-xs ${car.isAvailable ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                      {car.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className='flex items-center p-3 gap-3'>
                    <button onClick={() => toggleAvailability(car._id, car.isAvailable)}>
                      <img src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon} alt="Toggle" className='cursor-pointer' />
                    </button>
                    <button onClick={() => deleteCar(car._id)}>
                      <img src={assets.delete_icon} alt="Delete" className='cursor-pointer' />
                    </button>
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

export default ManageCars;