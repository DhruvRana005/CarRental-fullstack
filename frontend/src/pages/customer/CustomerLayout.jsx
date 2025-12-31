import React from 'react';
import CustomerNavbar from '../../components/customer/CustomerNavbar';
import CustomerSidebar from '../../components/customer/CustomerSidebar';
import { Outlet } from 'react-router-dom';

const CustomerLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <CustomerNavbar />
      <div className='flex flex-1'>
        <CustomerSidebar />
        <main className='flex-1 p-6 overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;