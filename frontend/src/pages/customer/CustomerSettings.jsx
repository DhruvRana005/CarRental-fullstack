import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Title from '../../components/Title';

const CustomerSettings = () => {
  const { user } = useAppContext();

  return (
    <div className="space-y-10">
      <Title title="Settings" subTitle="Manage your account preferences and security" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md border p-8">
          <h2 className="text-2xl font-semibold mb-6">Notification Preferences</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive booking updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Alerts</p>
                <p className="text-sm text-gray-500">Get instant alerts on your phone</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Promotional Offers</p>
                <p className="text-sm text-gray-500">Receive exclusive deals and discounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-xl shadow-md border p-8">
          <h2 className="text-2xl font-semibold mb-6">Account Security</h2>
          <div className="space-y-6">
            <div>
              <p className="font-medium mb-2">Change Password</p>
              <button className="text-primary hover:underline font-medium">
                Update Password →
              </button>
            </div>

            <div>
              <p className="font-medium mb-2">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500 mb-3">Add an extra layer of security</p>
              <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dull transition">
                Enable 2FA
              </button>
            </div>

            <div>
              <p className="font-medium mb-2">Active Sessions</p>
              <p className="text-sm text-gray-500 mb-3">Manage devices logged into your account</p>
              <button className="text-red-600 hover:underline font-medium">
                View Sessions →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-red-800 mb-4">Danger Zone</h2>
        <p className="text-gray-700 mb-6">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">
          Delete My Account
        </button>
      </div>
    </div>
  );
};

export default CustomerSettings;