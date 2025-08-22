// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Layout from '../components/Layout';
// import { statsAPI, applicationAPI, DashboardStats, Application } from '../lib/api';
// import { 
//   FiBriefcase, 
//   FiCalendar, 
//   FiTrendingUp, 
//   FiAward,
//   FiClock,
//   FiMapPin,
//   FiChevronRight,
//   FiPlus,
//   FiAlertCircle,
//   FiArrowUpRight,
//   FiMenu,
//   FiX
// } from 'react-icons/fi';
// import ProtectedRoute from '../components/ProtectedRoute';
// import { useAuth } from '../lib/auth-context';

// const Dashboard: React.FC = () => {
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [recentApplications, setRecentApplications] = useState<Application[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const router = useRouter();
//   const { logout, user } = useAuth();

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const [statsResponse, applicationsResponse] = await Promise.all([
//         statsAPI.getDashboard(),
//         applicationAPI.getAll(),
//       ]);
//       setStats(statsResponse.data);
//       setRecentApplications(applicationsResponse.data.slice(0, 5));
//     } catch (err: any) {
//       setError(err.message || 'Failed to fetch dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'applied':
//         return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30';
//       case 'interview':
//         return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30';
//       case 'offer':
//         return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30';
//       case 'rejected':
//         return 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border border-red-500/30';
//       case 'withdrawn':
//         return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border border-gray-500/30';
//       default:
//         return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 text-gray-300 border border-gray-400/30';
//     }
//   };

//   const StatCard = ({ icon: Icon, title, value, gradient, hoverColor }: {
//     icon: any;
//     title: string;
//     value: string | number;
//     gradient: string;
//     hoverColor: string;
//   }) => (
//     <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 p-4 md:p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-${hoverColor}-500/20`}>
//       <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-xl"></div>
//       <div className="relative">
//         <div className="flex items-center justify-between mb-2 md:mb-3">
//           <div className={`p-2 md:p-3 rounded-2xl bg-gradient-to-br ${gradient}`}>
//             <Icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
//           </div>
//         </div>
//         <div className="space-y-1">
//           <p className="text-white/70 text-xs md:text-sm font-medium">{title}</p>
//           <p className="text-xl md:text-3xl font-bold text-white">{value}</p>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-[400px]">
//           <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
//         </div>
//       </Layout>
//     );
//   }

//   if (error) {
//     return (
//       <Layout>
//         <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6 flex items-center gap-2">
//           <FiAlertCircle className="w-5 h-5" />
//           {error}
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <ProtectedRoute>
//       <Layout>
//         <div className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-6 md:space-y-8">
//           {/* Header */}
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
//                 Dashboard Overview
//               </h1>
//               <p className="text-white/60 text-sm md:text-base">Track your job search progress and recent applications</p>
//             </div>
//             <div className="flex gap-2 md:gap-4 w-full sm:w-auto">
//               <button 
//                 onClick={() => router.push('/add-application')}
//                 className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 text-sm md:text-base flex-1 sm:flex-none"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
//                 <div className="relative flex items-center gap-1 md:gap-2 justify-center">
//                   <FiPlus className="h-4 w-4 md:h-5 md:w-5" />
//                   <span className="hidden sm:inline">New Application</span>
//                   <span className="sm:hidden">New</span>
//                 </div>
//               </button>
//               <button 
//                 className="sm:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200"
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               >
//                 {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
//             <StatCard
//               icon={FiBriefcase}
//               title="Total Apps"
//               value={stats?.total_applications || 0}
//               gradient="from-indigo-500/20 to-blue-500/30"
//               hoverColor="indigo"
//             />
//             <StatCard
//               icon={FiCalendar}
//               title="This Month"
//               value={stats?.applications_this_month || 0}
//               gradient="from-blue-500/20 to-cyan-500/30"
//               hoverColor="blue"
//             />
//             <StatCard
//               icon={FiTrendingUp}
//               title="Interviews"
//               value={`${stats?.interview_rate || 0}%`}
//               gradient="from-purple-500/20 to-pink-500/30"
//               hoverColor="purple"
//             />
//             <StatCard
//               icon={FiAward}
//               title="Offers"
//               value={`${stats?.offer_rate || 0}%`}
//               gradient="from-green-500/20 to-emerald-500/30"
//               hoverColor="green"
//             />
//           </div>

//           {/* Recent Applications */}
//           <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 shadow-2xl">
//             <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl"></div>
            
//             <div className="relative p-4 md:p-6 lg:p-8">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
//                 <div>
//                   <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Recent Applications</h2>
//                   <p className="text-white/60 text-sm md:text-base">Your most recent job applications</p>
//                 </div>
//                 <button 
//                   onClick={() => router.push('/applications')}
//                   className="group flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 text-sm md:text-base self-end sm:self-auto"
//                 >
//                   View all 
//                   <FiChevronRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </div>

//               {recentApplications.length === 0 ? (
//                 <div className="text-center py-10 md:py-16">
//                   <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
//                     <FiBriefcase className="w-6 h-6 md:w-8 md:h-8 text-white/40" />
//                   </div>
//                   <p className="text-white/60 mb-4 md:mb-6 text-base md:text-lg">No applications found</p>
//                   <button 
//                     onClick={() => router.push('/application/new')}
//                     className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl font-medium transition-all duration-300 hover:scale-105 text-sm md:text-base"
//                   >
//                     Add your first application
//                   </button>
//                 </div>
//               ) : (
//                 <div className="grid gap-3 md:gap-4">
//                   {recentApplications.map((application, index) => (
//                     <div
//                       key={application.id}
//                       className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-white/5 to-white/2 backdrop-blur-sm border border-white/10 hover:border-white/20 p-4 md:p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10"
//                       onClick={() => router.push(`/application/${application.id}`)}
//                       style={{ animationDelay: `${index * 100}ms` }}
//                     >
//                       {/* Animated background gradient */}
//                       <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
//                       {/* Floating orb effect */}
//                       <div className="absolute top-2 md:top-4 right-2 md:right-4 w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      
//                       <div className="relative">
//                         <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-3 mb-3 md:mb-4">
//                           <div className="flex-1">
//                             <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
//                               <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-200 group-hover:to-purple-200 group-hover:bg-clip-text transition-all duration-300 line-clamp-1">
//                                 {application.job_title}
//                               </h3>
//                               {application.job_url && (
//                                 <button 
//                                   className="opacity-0 group-hover:opacity-100 p-1 md:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     window.open(application.job_url, '_blank');
//                                   }}
//                                 >
//                                   <FiArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
//                                 </button>
//                               )}
//                             </div>
//                             <p className="text-white/80 text-base md:text-lg font-medium mb-2 md:mb-3 line-clamp-1">{application.company_name}</p>
//                           </div>
                          
//                           <div className="flex items-center gap-2 md:gap-3 self-end md:self-auto">
//                             <span className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium backdrop-blur-sm ${getStatusColor(application.status)}`}>
//                               {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
//                             </span>
//                           </div>
//                         </div>

//                         <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm text-white/60">
//                           {application.location && (
//                             <div className="flex items-center gap-1 md:gap-2">
//                               <div className="p-1 md:p-1.5 rounded-lg bg-white/5">
//                                 <FiMapPin className="w-3 h-3 md:w-4 md:h-4" />
//                               </div>
//                               <span className="font-medium line-clamp-1">{application.location}</span>
//                             </div>
//                           )}
//                           <div className="flex items-center gap-1 md:gap-2">
//                             <div className="p-1 md:p-1.5 rounded-lg bg-white/5">
//                               <FiClock className="w-3 h-3 md:w-4 md:h-4" />
//                             </div>
//                             <span className="font-medium">
//                               {new Date(application.application_date).toLocaleDateString()}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Hover indicator */}
//                         <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </Layout>
//     </ProtectedRoute>
//   );
// };

// export default Dashboard;



import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { statsAPI, applicationAPI, DashboardStats, Application } from '../lib/api';
import { 
  FiBriefcase, 
  FiCalendar, 
  FiTrendingUp, 
  FiAward,
  FiClock,
  FiMapPin,
  FiChevronRight,
  FiPlus,
  FiAlertCircle,
  FiArrowUpRight,
  FiMenu,
  FiX
} from 'react-icons/fi';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../lib/auth-context';
import { getAuth, onAuthStateChanged } from "firebase/auth";


const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { logout, user } = useAuth();

  useEffect(() => {
      const auth = getAuth();

  // Wait for Firebase to initialize and get current user
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      fetchDashboardData(); // only now X-User-UID will be attached
    }
  });

  return () => unsubscribe();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsResponse, applicationsResponse] = await Promise.all([
        statsAPI.getDashboard(),
        applicationAPI.getAll(),
      ]);
      setStats(statsResponse.data);
      setRecentApplications(applicationsResponse.data.slice(0, 5));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30';
      case 'interview':
        return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30';
      case 'offer':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30';
      case 'rejected':
        return 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border border-red-500/30';
      case 'withdrawn':
        return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border border-gray-500/30';
      default:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 text-gray-300 border border-gray-400/30';
    }
  };

  const StatCard = ({ icon: Icon, title, value, gradient, hoverColor }: {
    icon: any;
    title: string;
    value: string | number;
    gradient: string;
    hoverColor: string;
  }) => (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 p-4 md:p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-${hoverColor}-500/20`}>
      <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-xl"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <div className={`p-2 md:p-3 rounded-2xl bg-gradient-to-br ${gradient}`}>
            <Icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-white/70 text-xs md:text-sm font-medium">{title}</p>
          <p className="text-xl md:text-3xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative">
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-2 sm:border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-2 sm:border-4 border-transparent border-r-blue-500 rounded-full animate-spin animate-reverse"></div>
        </div>
      </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6 flex items-center gap-2">
          <FiAlertCircle className="w-5 h-5" />
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-6 md:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
                Dashboard Overview
              </h1>
              <p className="text-white/60 text-sm md:text-base">Track your job search progress and recent applications</p>
            </div>
            <div className="flex gap-2 md:gap-4 w-full sm:w-auto">
              <button 
                onClick={() => router.push('/add-application')}
                className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 text-sm md:text-base flex-1 sm:flex-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative flex items-center gap-1 md:gap-2 justify-center">
                  <FiPlus className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">New Application</span>
                  <span className="sm:hidden">New</span>
                </div>
              </button>
              <button 
                className="sm:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <StatCard
              icon={FiBriefcase}
              title="Total Apps"
              value={stats?.total_applications || 0}
              gradient="from-indigo-500/20 to-blue-500/30"
              hoverColor="indigo"
            />
            <StatCard
              icon={FiCalendar}
              title="This Month"
              value={stats?.applications_this_month || 0}
              gradient="from-blue-500/20 to-cyan-500/30"
              hoverColor="blue"
            />
            <StatCard
              icon={FiTrendingUp}
              title="Interviews"
              value={`${stats?.interview_rate || 0}%`}
              gradient="from-purple-500/20 to-pink-500/30"
              hoverColor="purple"
            />
            <StatCard
              icon={FiAward}
              title="Offers"
              value={`${stats?.offer_rate || 0}%`}
              gradient="from-green-500/20 to-emerald-500/30"
              hoverColor="green"
            />
          </div>

          {/* Recent Applications */}
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl"></div>
            
            <div className="relative p-4 md:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Recent Applications</h2>
                  <p className="text-white/60 text-sm md:text-base">Your most recent job applications</p>
                </div>
                <button 
                  onClick={() => router.push('/add-application')}
                  className="group flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 text-sm md:text-base self-end sm:self-auto"
                >
                  View all 
                  <FiChevronRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {recentApplications.length === 0 ? (
                <div className="text-center py-10 md:py-16">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <FiBriefcase className="w-6 h-6 md:w-8 md:h-8 text-white/40" />
                  </div>
                  <p className="text-white/60 mb-4 md:mb-6 text-base md:text-lg">No applications found</p>
                  <button 
                    onClick={() => router.push('/add-application')}
                    className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl font-medium transition-all duration-300 hover:scale-105 text-sm md:text-base"
                  >
                    Add your first application
                  </button>
                </div>
              ) : (
                <div className="grid gap-3 md:gap-4">
                  {recentApplications.map((application, index) => (
                    <div
                      key={application.id}
                      className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-white/5 to-white/2 backdrop-blur-sm border border-white/10 hover:border-white/20 p-4 md:p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10"
                      onClick={() => router.push(`/application/${application.id}`)}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Animated background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Floating orb effect */}
                      <div className="absolute top-2 md:top-4 right-2 md:right-4 w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="relative">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-3 mb-3 md:mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                              <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-200 group-hover:to-purple-200 group-hover:bg-clip-text transition-all duration-300 line-clamp-1">
                                {application.job_title}
                              </h3>
                              {application.job_posting_url && (
                                <button 
                                  className="opacity-0 group-hover:opacity-100 p-1 md:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(application.job_posting_url, '_blank');
                                  }}
                                >
                                  <FiArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
                                </button>
                              )}
                            </div>
                            <p className="text-white/80 text-base md:text-lg font-medium mb-2 md:mb-3 line-clamp-1">{application.company_name}</p>
                          </div>
                          
                          <div className="flex items-center gap-2 md:gap-3 self-end md:self-auto">
                            <span className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium backdrop-blur-sm ${getStatusColor(application.status)}`}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm text-white/60">
                          {application.location && (
                            <div className="flex items-center gap-1 md:gap-2">
                              <div className="p-1 md:p-1.5 rounded-lg bg-white/5">
                                <FiMapPin className="w-3 h-3 md:w-4 md:h-4" />
                              </div>
                              <span className="font-medium line-clamp-1">{application.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 md:gap-2">
                            <div className="p-1 md:p-1.5 rounded-lg bg-white/5">
                              <FiClock className="w-3 h-3 md:w-4 md:h-4" />
                            </div>
                            <span className="font-medium">
                              Applied {new Date(application.application_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Hover indicator */}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Dashboard;