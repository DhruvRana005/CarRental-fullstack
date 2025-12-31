import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const NavbarOwner = () => {
  const { user } = useAppContext(); 

  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all'>
      <Link to="/" className="flex items-center gap-2.5">
        <img src="/favicon.png" alt="Logo" className="w-9 h-9 sm:w-10 sm:h-10"/>
        <span className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
          4WHEELER
        </span>
      </Link>
      <p>Welcome, {user?.name || "Owner"}</p>
    </div>
  );
};

export default NavbarOwner;