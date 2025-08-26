// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { FiMenu, FiX, FiHome, FiBriefcase, FiBarChart2, FiPlus, FiLogOut, FiUser } from 'react-icons/fi';
// import { auth } from '../lib/firebase'; // Adjust the import path to your Firebase config
// import { onAuthStateChanged, signOut, User } from 'firebase/auth';

// interface LayoutProps {
//   children: React.ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // Monitor authentication state
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
      
//       // Redirect to login if not authenticated
//       if (!currentUser && router.pathname !== '/login') {
//         router.push('/login');
//       }
//     });

//     return () => unsubscribe();
//   }, [router]);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       router.push('/login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const menuItems = [
//     { text: 'Dashboard', path: '/', icon: <FiHome className="w-5 h-5" /> },
//     { text: 'Pipeline', path: '/pipeline', icon: <FiBriefcase className="w-5 h-5" /> },
//     { text: 'Analytics', path: '/analytics', icon: <FiBarChart2 className="w-5 h-5" /> },
//     { text: 'Add Application', path: '/add-application', icon: <FiPlus className="w-5 h-5" /> },
//   ];

//   // Show loading state while checking authentication
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
//           <p>Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // Don't render the layout if user is not authenticated
//   if (!user) {
//     return null;
//   }

//   const drawer = (
//     <div className="flex flex-col h-full bg-gray-900 border-r border-gray-700">
//       <div className="p-4 border-b border-gray-700">
//         <h1 className="text-xl font-bold text-white">Job Tracker</h1>
//       </div>
      
//       {/* User info section */}
//       <div className="p-4 border-b border-gray-700">
//         <div className="flex items-center space-x-3">
//           <div className="flex-shrink-0">
//             {user.photoURL ? (
//               <img
//                 src={user.photoURL}
//                 alt="Profile"
//                 className="w-8 h-8 rounded-full"
//               />
//             ) : (
//               <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
//                 <FiUser className="w-4 h-4 text-gray-300" />
//               </div>
//             )}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-white truncate">
//               {user.displayName || 'User'}
//             </p>
//             <p className="text-xs text-gray-400 truncate">
//               {user.email}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 p-2 overflow-y-auto">
//         {menuItems.map((item) => (
//           <Link
//             key={item.text}
//             href={item.path}
//             className={`flex items-center p-3 rounded-lg mb-2 text-gray-300 hover:bg-gray-800 transition-colors ${
//               router.pathname === item.path ? 'bg-gray-800 text-white' : ''
//             }`}
//             onClick={() => setMobileOpen(false)}
//           >
//             {item.icon}
//             <span className="ml-3">{item.text}</span>
//           </Link>
//         ))}
//       </div>

//       {/* Sign out button */}
//       <div className="p-2 border-t border-gray-700">
//         <button
//           onClick={handleSignOut}
//           className="flex items-center w-full p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
//         >
//           <FiLogOut className="w-5 h-5" />
//           <span className="ml-3">Sign Out</span>
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="flex min-h-screen bg-gray-900 text-white">
//       {/* Mobile drawer overlay */}
//       {mobileOpen && (
//         <div 
//           className="fixed inset-0 z-40 bg-black/60 md:hidden"
//           onClick={handleDrawerToggle}
//         />
//       )}
      
//       {/* Mobile drawer */}
//       <div className={`fixed inset-y-0 left-0 z-50 w-64 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
//         {drawer}
//       </div>
      
//       {/* Desktop drawer */}
//       <div className="hidden md:flex md:w-64 md:flex-shrink-0">
//         <div className="fixed w-64 h-full">
//           {drawer}
//         </div>
//       </div>
      
//       {/* Main content */}
//       <div className="flex-1 flex flex-col min-w-0">
//         <header className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-30">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <button
//                 onClick={handleDrawerToggle}
//                 className="mr-4 p-1 rounded-md text-gray-400 hover:text-white focus:outline-none md:hidden"
//               >
//                 <FiMenu className="w-6 h-6" />
//               </button>
//               <h1 className="text-lg font-semibold text-white">
//                 {menuItems.find((item) => item.path === router.pathname)?.text || 'Job Tracker'}
//               </h1>
//             </div>
            
//             {/* User info in header (visible on larger screens) */}
//             <div className="hidden md:flex items-center space-x-3">
//               <div className="text-right">
//                 <p className="text-sm font-medium text-white">
//                   {user.displayName || 'User'}
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   {user.email}
//                 </p>
//               </div>
//               {user.photoURL ? (
//                 <img
//                   src={user.photoURL}
//                   alt="Profile"
//                   className="w-8 h-8 rounded-full"
//                 />
//               ) : (
//                 <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
//                   <FiUser className="w-4 h-4 text-gray-300" />
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>
        
//         <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
//           <div className="max-w-full">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;


import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiMenu, FiX, FiHome, FiBriefcase, FiBarChart2, FiPlus, FiLogOut, FiUser, FiSearch } from 'react-icons/fi';
import { auth } from '../lib/firebase'; // Adjust the import path to your Firebase config
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { Briefcase } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // Redirect to login if not authenticated
      if (!currentUser && router.pathname !== '/login') {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { text: 'Dashboard', path: '/', icon: <FiHome className="w-5 h-5" /> },
    { text: 'Pipeline', path: '/pipeline', icon: <FiBriefcase className="w-5 h-5" /> },
    { text: 'Analytics', path: '/analytics', icon: <FiBarChart2 className="w-5 h-5" /> },
    { text: 'Job SearchPage', path: '/JobSearchPage', icon: <FiSearch className="w-5 h-5" /> },
    { text: 'Add Application', path: '/add-application', icon: <FiPlus className="w-5 h-5" /> },
  ];

  // Show loading state while checking authentication
  if (loading) {
    return (
       <div className="flex justify-center items-center min-h-[60vh]">
      <div className="relative flex flex-col items-center">
        {/* Original Spinner - UNCHANGED */}
        <div className="relative mb-10">
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-2 sm:border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-2 sm:border-4 border-transparent border-r-blue-500 rounded-full animate-spin animate-reverse"></div>
        </div>
        
        {/* Clean, Modern Text */}
        <div className="relative group">
          {/* Subtle background glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg blur-sm group-hover:blur-md transition-all duration-700"></div>
          
          {/* Main text container */}
          <div className="relative flex items-center gap-4 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
            <Briefcase className="w-5 h-5 text-purple-400 animate-pulse" />
            
            <div className="flex gap-1">
              {["J", "O", "B"].map((letter, i) => (
                <span
                  key={i}
                  className="text-xl sm:text-2xl font-semibold text-purple-400 animate-[fadeSlide_1.2s_ease-out_infinite]"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {letter}
                </span>
              ))}
              
              <span className="text-xl sm:text-2xl font-semibold text-gray-400 mx-2">/</span>
              
              {["T", "R", "A", "C", "K", "E", "R"].map((letter, i) => (
                <span
                  key={i}
                  className="text-xl sm:text-2xl font-semibold text-blue-400 animate-[fadeSlide_1.2s_ease-out_infinite]"
                  style={{ animationDelay: `${(i + 4) * 0.1}s` }}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>
          
          {/* Minimal loading indicator */}
          <div className="mt-4 flex justify-center">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-[dot_1.4s_ease-in-out_infinite]"
                  style={{ animationDelay: `${i * 0.16}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeSlide {
          0%, 60% { opacity: 0.4; transform: translateY(0px); }
          30% { opacity: 1; transform: translateY(-2px); }
          100% { opacity: 0.4; transform: translateY(0px); }
        }
        
        @keyframes dot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
    
  }

  // Don't render the layout if user is not authenticated
  if (!user) {
    return null;
  }

  const drawer = (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Job Tracker</h1>
      </div>
      
      {/* User info section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <FiUser className="w-4 h-4 text-gray-300" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.displayName || 'User'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user.email}
            </p>
          </div>
        </div>
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

      {/* Sign out button */}
      <div className="p-2 border-t border-gray-700">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="ml-3">Sign Out</span>
        </button>
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
          <div className="flex items-center justify-between">
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
            
            {/* User info in header with dropdown (now visible on all screen sizes) */}
            <div className="relative group">
              <div className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-700 transition-colors">
                {/* <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {user.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user.email}
                  </p>
                </div> */}
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium text-white truncate">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <FiLogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
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