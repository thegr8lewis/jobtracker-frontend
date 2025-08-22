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
import { FiMenu, FiX, FiHome, FiBriefcase, FiBarChart2, FiPlus, FiLogOut, FiUser } from 'react-icons/fi';
import { auth } from '../lib/firebase'; // Adjust the import path to your Firebase config
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

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
    { text: 'Add Application', path: '/add-application', icon: <FiPlus className="w-5 h-5" /> },
  ];

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
         </div>
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