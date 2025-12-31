import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Hero from '../components/Hero';
import FeaturedSection from '../components/FeaturedSection';
import Banner from '../components/Banner';
import Testimonial from '../components/Testimonial';
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
      <Testimonial />
      <Newsletter />
    </>
  );
};

export default Home;