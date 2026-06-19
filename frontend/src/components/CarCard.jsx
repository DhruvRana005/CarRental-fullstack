import React from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const CarCard = ({car}) => {

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()
    const { pickupDate, returnDate } = useAppContext()

    const getYYYYMMDD = (dateVal) => {
      if (!dateVal) return "";
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return "";
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const isCarBookedForDates = (car, start, end) => {
      if (!car || !car.activeBookings || car.activeBookings.length === 0) return false;
      
      let targetStartStr = start;
      let targetEndStr = end;
      
      if (!start || !end) {
        const todayStr = getYYYYMMDD(new Date());
        targetStartStr = todayStr;
        targetEndStr = todayStr;
      }
      
      return car.activeBookings.some(b => {
        const bStartStr = getYYYYMMDD(b.pickupDate);
        const bEndStr = getYYYYMMDD(b.returnDate);
        return bStartStr <= targetEndStr && bEndStr >= targetStartStr;
      });
    };

    const isBooked = isCarBookedForDates(car, pickupDate, returnDate);

  return (
    <div onClick={()=> {navigate(`/car-details/${car._id}`); scrollTo(0,0)}} className='group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer'>

      <div className='relative h-48 overflow-hidden'>
        <img src= {car.image} alt="Car Image" className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'/>
        {car.isAvailable && !isBooked ? (
          <p className='absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full'>Available Now</p>
        ) : car.isAvailable && isBooked ? (
          <p className='absolute top-4 left-4 bg-red-600/90 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md'>Out of Stock</p>
        ) : null}
        <div className='absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg'>
        <span className='font-semibold'>{currency}{car.pricePerDay}</span>
        <span className='text-sm text-white/80'> / day</span>
        </div>
      </div>
      <div className='p-4 sm:p-5'>
        <div className='flex justify-between items-start mb-2'>
            <div>
                <h3 className='text-lg font-medium'>{car.brand} {car.model}</h3>
                <p className='text-muted-foreground text-sm'>{car.category} • {car.year}</p>
            </div>
        </div>
        <div className='mt-4 grid grid-cols-2 gap-y-2 text-gray-600'>
            <div className='flex items-center text-sm text-muted-foreground'>
              <img src={assets.users_icon} alt="" className='h-4 mr-2'/>
              <span>{car.seating_capacity} Seats</span>
            </div>
            <div className='flex items-center text-sm text-muted-foreground'>
              <img src={assets.fuel_icon} alt="" className='h-4 mr-2'/>
              <span>{car.fuel_type}</span>
            </div>
            <div className='flex items-center text-sm text-muted-foreground'>
              <img src={assets.car_icon} alt="" className='h-4 mr-2'/>
              <span>{car.transmission}</span>
            </div>
            <div className='flex items-center text-sm text-muted-foreground'>
              <img src={assets.location_icon} alt="" className='h-4 mr-2'/>
              <span>{car.location}</span>
            </div>
        </div>
        
        {/* Rating and Review section at the bottom of the card */}
        <div className='mt-5 pt-3 border-t border-gray-100 flex items-center justify-between' onClick={(e) => {
          e.stopPropagation();
          navigate(`/car-details/${car._id}`);
          scrollTo(0,0);
        }}>
          <div className='flex items-center gap-1.5'>
            <div className='flex gap-0.5'>
              {Array(5).fill(0).map((_, i) => {
                const avgRating = car.reviews && car.reviews.length > 0
                  ? car.reviews.reduce((sum, r) => sum + r.rating, 0) / car.reviews.length
                  : 5; // Default 5 stars if no reviews yet
                return (
                  <img 
                    key={i} 
                    src={assets.star_icon} 
                    alt="star" 
                    className={`w-3.5 h-3.5 ${i < Math.round(avgRating) ? 'opacity-100' : 'opacity-30'}`} 
                  />
                )
              })}
            </div>
            <span className='text-xs font-semibold text-gray-700'>
              {car.reviews && car.reviews.length > 0 
                ? (car.reviews.reduce((sum, r) => sum + r.rating, 0) / car.reviews.length).toFixed(1)
                : "5.0"}
            </span>
            <span className='text-[11px] text-gray-400'>
              ({car.reviews ? car.reviews.length : 0})
            </span>
          </div>
          <span className='text-primary hover:text-primary-dull text-xs font-bold transition-colors'>
            Write Review
          </span>
        </div>
      </div>
    </div>
  )
}

export default CarCard
