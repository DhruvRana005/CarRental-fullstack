import React from 'react';
import assets from '../assets/assets';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
const Footer = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    const socialVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        hover: { scale: 1.2, rotate: 10 },
    };

    return (
        <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className='px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500'>
            <div className='flex flex-wrap justify-between items-start gap-8 pb-6 border-b border-gray-300'>
                <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-3 mb-4">
                        <img src="/favicon.png" alt="logo" className='h-8 md:h-9' />
                        <span className="text-xl sm:text-2xl font-bold text-gray-800">
                            4WHEELER
                        </span>
                    </div>
                    <p className='max-w-80 mt-3 text-gray-600'>
                        Premium Car rental service with a wide selection of luxury and everyday vehicles for all your driving needs.
                    </p>

                    <div className='flex items-center gap-4 mt-6'>
                        <motion.a
                            href="#"
                            variants={socialVariants}
                            whileHover="hover"
                            className="block">
                            <img src={assets.facebook_logo} className='w-6 h-6' alt="Facebook" />
                        </motion.a>
                        <motion.a
                            href="#"
                            variants={socialVariants}
                            whileHover="hover"
                            className="block">
                            <img src={assets.instagram_logo} className='w-6 h-6' alt="Instagram" />
                        </motion.a>
                        <motion.a
                            href="#"
                            variants={socialVariants}
                            whileHover="hover"
                            className="block">
                            <img src={assets.twitter_logo} className='w-6 h-6' alt="Twitter" />
                        </motion.a>
                        <motion.a
                            href="#"
                            variants={socialVariants}
                            whileHover="hover"
                            className="block"
                        >
                            <img src={assets.gmail_logo} className='w-6 h-6' alt="Email" />
                        </motion.a>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <h2 className='text-base font-medium text-gray-800 uppercase mb-4'>Quick Links</h2>
                    <ul className='flex flex-col gap-2'>
                        <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
                        <li><Link to="/cars" className="hover:text-primary transition">Browse Cars</Link></li>
                        <li><Link to="/owner/add-car" className="hover:text-primary transition">List Your Car</Link></li>
                        <li><a href="#" className="hover:text-primary transition">About Us</a></li>
                    </ul>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <h2 className='text-base font-medium text-gray-800 uppercase mb-4'>Resources</h2>
                    <ul className='flex flex-col gap-2'>
                        <li><a href="#" className="hover:text-primary transition">Help Center</a></li>
                        <li><a href="#" className="hover:text-primary transition">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-primary transition">Insurance</a></li>
                    </ul>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <h2 className='text-base font-medium text-gray-800 uppercase mb-4'>Contact</h2>
                    <ul className='flex flex-col gap-2'>
                        <li>1234 Luxury Drive</li>
                        <li>Faridabad, Haryana</li>
                        <li>+91 1234567890</li>
                        <li>info@4wheeler.com</li>
                    </ul>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className='flex flex-col md:flex-row gap-4 items-center justify-between py-6 text-center'
            >
                <p className="text-sm">
                    © {new Date().getFullYear()} <a href="https://prebuiltui.com" className="hover:text-primary transition">4Wheeler</a>. All rights reserved.
                </p>
                <ul className='flex items-center gap-4 text-sm'>
                    <li><a href="#" className="hover:text-primary transition">Privacy</a></li>
                    <li className="text-gray-400">|</li>
                    <li><a href="#" className="hover:text-primary transition">Terms</a></li>
                    <li className="text-gray-400">|</li>
                    <li><a href="#" className="hover:text-primary transition">Cookies</a></li>
                </ul>
            </motion.div>
        </motion.footer>
    );
};

export default Footer;