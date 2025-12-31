import React, { useState } from 'react';
import Title from "../components/Title";
import CarCard from "../components/CarCard";
import assets from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

const Cars = () => {
  const { cars } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCars = cars.filter(car =>
    car.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  React.useEffect(() => {
    if (filteredCars.length === 0 && searchQuery.length > 0) {
      toast.info("No cars found for your search", { duration: 3000 });
    }
  }, [filteredCars.length, searchQuery]);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center py-20 bg-light px-4">
        <Title title="Available Cars" subTitle="Browse our selection of premium vehicles" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center border border-gray-300 rounded-full px-5 py-3 mt-8 max-w-2xl w-full shadow-lg bg-white">
          <img src={assets.search_icon} alt="search" className="w-6 h-6 mr-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search by brand, model or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-lg text-gray-700 placeholder-gray-400"/>
        </motion.div>
      </motion.div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-gray-600 mb-6">
          Showing {filteredCars.length} of {cars.length} cars
          {searchQuery && ` for "${searchQuery}"`}
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <AnimatePresence>
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <motion.div
                  key={car._id}
                  layout
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="cursor-pointer"
                >
                  <CarCard car={car} />
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center text-gray-500 text-lg py-20"
              >
                No cars match your search. Try different keywords!
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Cars;