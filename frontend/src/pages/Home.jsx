import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Hero from '../components/Hero';
import FeaturedSection from '../components/FeaturedSection';
import Banner from '../components/Banner';
import Newsletter from '../components/Newsletter';

const Home = () => {
  const { fetchCars} = useAppContext();

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <>
      <Hero />
      <FeaturedSection />
      <Banner />
      <Newsletter />
    </>
  );
};

export default Home;