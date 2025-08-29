import React from 'react';
import Layout from '../components/Layout';
import EmailSettings from '../components/EmailSettings';
import { FiSettings, FiShield, FiBell } from 'react-icons/fi';

const SettingsPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 text-gray-100 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8 sm:mb-12">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 rounded-xl flex items-center justify-center transition-transform hover:scale-105">
              <FiSettings className="text-purple-400 w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Settings</h1>
              <p className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2">Customize your account preferences and integrations</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Navigation */}
          <div className="w-full lg:w-80">
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/30 rounded-2xl p-4 sm:p-6 sticky top-4">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Preferences</h3>
              <nav className="space-y-2">
                <button className="w-full text-left px-4 py-2.5 sm:py-3 bg-purple-600/30 text-purple-300 rounded-lg font-medium text-sm sm:text-base hover:bg-purple-600/50 hover:text-purple-200 transition-all duration-200">
                  Email Integration
                </button>
                <button className="w-full text-left px-4 py-2.5 sm:py-3 text-gray-300 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-700/50 hover:text-white transition-all duration-200">
                  Notifications
                </button>
                <button className="w-full text-left px-4 py-2.5 sm:py-3 text-gray-300 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-700/50 hover:text-white transition-all duration-200">
                  Privacy & Security
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6 sm:space-y-8">
            <EmailSettings />
            
            {/* Notifications Settings */}
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/30 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-600/30 to-emerald-600/30 rounded-lg flex items-center justify-center transition-transform hover:scale-105">
                  <FiBell className="text-green-400 w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">Notifications</h3>
                  <p className="text-sm sm:text-base text-gray-400 mt-1">Manage how you receive updates</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-800/30 border border-gray-700/30 rounded-lg transition-all hover:bg-gray-800/50">
                  <div className="mb-3 sm:mb-0">
                    <h4 className="text-base sm:text-lg font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-400">Receive email updates about application status changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-10 h-5 sm:w-11 sm:h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 sm:h-5 sm:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-800/30 border border-gray-700/30 rounded-lg transition-all hover:bg-gray-800/50">
                  <div className="mb-3 sm:mb-0">
                    <h4 className="text-base sm:text-lg font-medium">Push Notifications</h4>
                    <p className="text-sm text-gray-400">Get browser notifications for important updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-10 h-5 sm:w-11 sm:h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 sm:h-5 sm:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/30 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600/30 to-pink-600/30 rounded-lg flex items-center justify-center transition-transform hover:scale-105">
                  <FiShield className="text-red-400 w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">Privacy & Security</h3>
                  <p className="text-sm sm:text-base text-gray-400 mt-1">Manage your data and privacy settings</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-800/30 border border-gray-700/30 rounded-lg transition-all hover:bg-gray-800/50">
                  <h4 className="text-base sm:text-lg font-medium mb-2">Data Usage</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Your email data is processed securely and never stored on our servers. 
                    We only access emails related to your job applications.
                  </p>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">
                    Delete All Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;