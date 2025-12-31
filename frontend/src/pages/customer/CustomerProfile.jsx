import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Title from '../../components/Title';

const CustomerProfile = () => {
  const { user } = useAppContext();

  return (
    <div className="space-y-8">
      <Title title="My Profile" subTitle="View and update your personal information" />

      <div className="bg-white rounded-xl shadow-md border p-8 max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-primary flex items-center justify-center text-3xl font-bold text-primary">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user?.name || 'Customer'}</h2>
            <p className="text-gray-600">{user?.email || 'email@example.com'}</p>
            <span className="inline-block px-4 py-1 mt-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              Customer Account
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <p className="text-lg text-gray-800">{user?.name || 'Not set'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <p className="text-lg text-gray-800">{user?.email || 'Not set'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <p className="text-lg text-gray-800">Not added yet</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
            <p className="text-lg text-gray-800">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dull transition">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;