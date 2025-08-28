import React from 'react';
import Layout from '../components/Layout';
import EmailSettings from '../components/EmailSettings';
import { FiSettings, FiShield, FiBell } from 'react-icons/fi';

const SettingsPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center">
            <FiSettings className="text-purple-400 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-400">Manage your account preferences and integrations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Preferences</h3>
              <nav className="space-y-2">
                <button className="w-full text-left px-3 py-2 bg-purple-600/20 text-purple-400 rounded-xl">
                  Email Integration
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700/30 rounded-xl transition-colors">
                  Notifications
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700/30 rounded-xl transition-colors">
                  Privacy & Security
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <EmailSettings />
            
            {/* Notifications Settings */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                  <FiBell className="text-green-400 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Notifications</h3>
                  <p className="text-gray-400 text-sm">Manage how you receive updates</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700/30 rounded-xl">
                  <div>
                    <h4 className="text-white font-medium">Email Notifications</h4>
                    <p className="text-gray-400 text-sm">Receive email updates about application status changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700/30 rounded-xl">
                  <div>
                    <h4 className="text-white font-medium">Push Notifications</h4>
                    <p className="text-gray-400 text-sm">Get browser notifications for important updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                  <FiShield className="text-red-400 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Privacy & Security</h3>
                  <p className="text-gray-400 text-sm">Manage your data and privacy settings</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-800/30 border border-gray-700/30 rounded-xl">
                  <h4 className="text-white font-medium mb-2">Data Usage</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Your email data is processed securely and never stored on our servers. 
                    We only access emails related to your job applications.
                  </p>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm transition-colors">
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