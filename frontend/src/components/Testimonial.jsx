import React from 'react';
import Title from './Title';
import assets from '../assets/assets';
import { motion } from 'motion/react';

const Testimonial = () => {
  const testimonials = [
    {
      name: "Sneha",
      location: "Indore, India",
      image: assets.testimonial_image_1,
      testimonial: "I've rented cars from various companies, but the experience with 4wheeler was exceptional."
    },
    {
      name: "Jassi",
      location: "Punjab, India",
      image: assets.testimonial_image_2,
      testimonial: "4Wheeler made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic."
    },
    {
      name: "Simmi",
      location: "Haryana, India",
      image: assets.testimonial_image_1,
      testimonial: "I've rented cars from various companies, but the experience with 4wheeler was exceptional."
    },
  ];

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">
      <Title
        title="What our Customers Say"
        subTitle="Discover why discerning travelers choose 4Wheeler for their luxury car rentals across India."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500"
          >
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className="text-xl font-medium">{testimonial.name}</p>
                <p className="text-gray-500 text-sm">{testimonial.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-4">
              {Array(5).fill(0).map((_, i) => (
                  <img key={i} src={assets.star_icon} alt="star" className="w-5 h-5" />
                ))}
            </div>

            <p className="text-gray-600 mt-4 font-light leading-relaxed">
              "{testimonial.testimonial}"
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;