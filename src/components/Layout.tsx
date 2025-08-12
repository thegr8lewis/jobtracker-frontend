
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiMenu, FiX, FiHome, FiBriefcase, FiBarChart2, FiPlus } from 'react-icons/fi';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', path: '/', icon: <FiHome className="w-5 h-5" /> },
    { text: 'Pipeline', path: '/pipeline', icon: <FiBriefcase className="w-5 h-5" /> },
    { text: 'Analytics', path: '/analytics', icon: <FiBarChart2 className="w-5 h-5" /> },
    { text: 'Add Application', path: '/add-application', icon: <FiPlus className="w-5 h-5" /> },
  ];

  const drawer = (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Job Tracker</h1>
      </div>
      <div className="flex-1 p-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.text}
            href={item.path}
            className={`flex items-center p-3 rounded-lg mb-2 text-gray-300 hover:bg-gray-800 transition-colors ${
              router.pathname === item.path ? 'bg-gray-800 text-white' : ''
            }`}
            onClick={() => setMobileOpen(false)}
          >
            {item.icon}
            <span className="ml-3">{item.text}</span>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={handleDrawerToggle}
        />
      )}
      
      {/* Mobile drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        {drawer}
      </div>
      
      {/* Desktop drawer */}
      <div className="hidden md:flex md:w-64 md:flex-shrink-0">
        <div className="fixed w-64 h-full">
          {drawer}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-30">
          <div className="flex items-center">
            <button
              onClick={handleDrawerToggle}
              className="mr-4 p-1 rounded-md text-gray-400 hover:text-white focus:outline-none md:hidden"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-white">
              {menuItems.find((item) => item.path === router.pathname)?.text || 'Job Tracker'}
            </h1>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;