// import React, { useEffect, useState } from 'react';
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   RadialBarChart,
//   RadialBar,
//   PieChart,
//   Pie,
//   Cell,
// } from 'recharts';
// import Layout from '../components/Layout';
// import { statsAPI, AnalyticsData } from '../lib/api';
// import { FiLoader } from 'react-icons/fi';

// const Analytics: React.FC = () => {
//   const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [period, setPeriod] = useState('30d');

//   useEffect(() => {
//     fetchAnalyticsData();
//   }, [period]);

//   const fetchAnalyticsData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await statsAPI.getAnalytics(period);
//       setAnalyticsData(response.data);
//     } catch (err: any) {
//       setError(err.message || 'Failed to fetch analytics data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//   };

//   const chartData = analyticsData.map((item) => ({
//     date: formatDate(item.date),
//     applications: item.applications_count,
//     interviews: item.interviews_count,
//     offers: item.offers_count,
//   }));

//   const totalApplications = analyticsData.reduce((sum, item) => sum + item.applications_count, 0);
//   const totalInterviews = analyticsData.reduce((sum, item) => sum + item.interviews_count, 0);
//   const totalOffers = analyticsData.reduce((sum, item) => sum + item.offers_count, 0);
//   const interviewRate = totalApplications > 0 ? ((totalInterviews / totalApplications) * 100).toFixed(1) : '0';
//   const offerRate = totalApplications > 0 ? ((totalOffers / totalApplications) * 100).toFixed(1) : '0';

//   const conversionData = [
//     { name: 'Interview Rate', value: parseFloat(interviewRate), fill: '#8B5CF6' },
//     { name: 'Offer Rate', value: parseFloat(offerRate), fill: '#10B981' },
//   ];

//   const statusData = [
//     { name: 'Applications', value: totalApplications, fill: '#3B82F6' },
//     { name: 'Interviews', value: totalInterviews, fill: '#F59E0B' },
//     { name: 'Offers', value: totalOffers, fill: '#10B981' },
//   ];

//   const CustomTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
//           <p className="text-white/90 font-medium mb-2">{label}</p>
//           {payload.map((entry: any, index: number) => (
//             <p key={index} className="text-sm" style={{ color: entry.color }}>
//               {entry.name}: {entry.value}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   const StatCard = ({ title, value, color, icon }: { title: string; value: string | number; color: string; icon: React.ReactNode }) => (
//     <div className="relative overflow-hidden rounded-3xl glass-card bg-gradient-to-tr from-gray-800 via-gray-900 to-black p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 backdrop-blur-xl border border-white/10">
//       <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-xl"></div>
//       <div className="relative">
//         <div className="flex items-center justify-between mb-3">
//           <span className="text-white/70 text-sm font-medium">{title}</span>
//           {icon}
//         </div>
//         <div className="flex items-end gap-2">
//           <span className={`text-3xl font-bold ${color}`}>{value}</span>
//         </div>
//       </div>
//     </div>
//   );

//   const ChartContainer = ({ children, title, className = "" }: { children: React.ReactNode; title: string; className?: string }) => (
//     <div className={`relative overflow-hidden rounded-3xl glass-card bg-gradient-to-tr from-gray-800 via-gray-900 to-black backdrop-blur-xl border border-white/10 p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 ${className}`}>
//       <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl"></div>
//       <h3 className="text-xl font-semibold mb-6 text-white relative z-10">{title}</h3>
//       <div className="relative z-10">{children}</div>
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
//         <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6">{error}</div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="flex-1 space-y-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
//               Analytics Dashboard
//             </h1>
//             <p className="text-white/60 mt-2">Track your job application progress</p>
//           </div>
//           <select
//             value={period}
//             onChange={(e) => setPeriod(e.target.value)}
//             className="px-4 py-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
//           >
//             <option value="7d">7 Days</option>
//             <option value="30d">30 Days</option>
//             <option value="90d">90 Days</option>
//           </select>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard
//             title="Total Applications"
//             value={totalApplications}
//             color="text-blue-400"
//             icon={<div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">📊</div>}
//           />
//           <StatCard
//             title="Total Interviews"
//             value={totalInterviews}
//             color="text-amber-400"
//             icon={<div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">💼</div>}
//           />
//           <StatCard
//             title="Interview Rate"
//             value={`${interviewRate}%`}
//             color="text-purple-400"
//             icon={<div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">📈</div>}
//           />
//           <StatCard
//             title="Offer Rate"
//             value={`${offerRate}%`}
//             color="text-emerald-400"
//             icon={<div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">🎯</div>}
//           />
//         </div>

//         {/* Charts Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Applications Trend - Area Chart */}
//           <ChartContainer title="Applications Trend">
//             <ResponsiveContainer width="100%" height={320}>
//               <AreaChart data={chartData}>
//                 <defs>
//                   <linearGradient id="applicationsGradient" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
//                     <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
//                 <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" fontSize={12} axisLine={false} tickLine={false}/>
//                 <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} axisLine={false} tickLine={false}/>
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={3} fill="url(#applicationsGradient)" dot={{ fill: '#3B82F6', strokeWidth: 0, r: 6 }} activeDot={{ r: 8, fill: '#3B82F6', stroke: '#1E40AF', strokeWidth: 2 }}/>
//               </AreaChart>
//             </ResponsiveContainer>
//           </ChartContainer>

//           {/* Conversion Rates - Radial Chart */}
//           <ChartContainer title="Conversion Metrics">
//             <div className="flex items-center justify-center h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="80%" data={conversionData}>
//                   <RadialBar dataKey="value" cornerRadius={10} fill="#8B5CF6" background={{ fill: 'rgba(139, 92, 246, 0.1)' }}/>
//                   <Legend iconSize={12} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ color: '#fff', fontSize: '14px' }}/>
//                   <Tooltip content={<CustomTooltip />} />
//                 </RadialBarChart>
//               </ResponsiveContainer>
//             </div>
//           </ChartContainer>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Analytics;



import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Layout from '../components/Layout';
import { statsAPI, AnalyticsData } from '../lib/api';
import { FiLoader } from 'react-icons/fi';

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await statsAPI.getAnalytics(period);
      setAnalyticsData(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = analyticsData.map((item) => ({
    date: formatDate(item.date),
    applications: item.applications_count,
    interviews: item.interviews_count,
    offers: item.offers_count,
  }));

  const totalApplications = analyticsData.reduce((sum, item) => sum + item.applications_count, 0);
  const totalInterviews = analyticsData.reduce((sum, item) => sum + item.interviews_count, 0);
  const totalOffers = analyticsData.reduce((sum, item) => sum + item.offers_count, 0);
  const interviewRate = totalApplications > 0 ? ((totalInterviews / totalApplications) * 100).toFixed(1) : '0';
  const offerRate = totalApplications > 0 ? ((totalOffers / totalApplications) * 100).toFixed(1) : '0';

  const conversionData = [
    { name: 'Interview Rate', value: parseFloat(interviewRate), fill: '#8B5CF6' },
    { name: 'Offer Rate', value: parseFloat(offerRate), fill: '#10B981' },
  ];

  const statusData = [
    { name: 'Applications', value: totalApplications, fill: '#3B82F6' },
    { name: 'Interviews', value: totalInterviews, fill: '#F59E0B' },
    { name: 'Offers', value: totalOffers, fill: '#10B981' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-2xl">
          <p className="text-white/90 font-medium mb-1 md:mb-2 text-sm md:text-base">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs md:text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ title, value, color, icon }: { title: string; value: string | number; color: string; icon: React.ReactNode }) => (
    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl glass-card bg-gradient-to-tr from-gray-800 via-gray-900 to-black p-4 md:p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl md:hover:shadow-2xl hover:shadow-purple-500/20 backdrop-blur-xl border border-white/10">
      <div className="absolute -top-8 -right-8 md:-top-10 md:-right-10 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-xl"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <span className="text-white/70 text-xs md:text-sm font-medium">{title}</span>
          {icon}
        </div>
        <div className="flex items-end gap-2">
          <span className={`text-xl md:text-2xl lg:text-3xl font-bold ${color}`}>{value}</span>
        </div>
      </div>
    </div>
  );

  const ChartContainer = ({ children, title, className = "" }: { children: React.ReactNode; title: string; className?: string }) => (
    <div className={`relative overflow-hidden rounded-2xl md:rounded-3xl glass-card bg-gradient-to-tr from-gray-800 via-gray-900 to-black backdrop-blur-xl border border-white/10 p-4 md:p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 ${className}`}>
      <div className="absolute -top-16 -right-16 md:-top-20 md:-right-20 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl"></div>
      <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-white relative z-10">{title}</h3>
      <div className="relative z-10">{children}</div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-500/20 border border-red-500/50 text-white p-3 md:p-4 rounded-lg mb-6 text-sm md:text-base">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-white/60 mt-1 md:mt-2 text-sm md:text-base">Track your job application progress</p>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 md:px-4 md:py-2 rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 text-sm md:text-base"
          >
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Total Applications"
            value={totalApplications}
            color="text-blue-400"
            icon={<div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs md:text-base">📊</div>}
          />
          <StatCard
            title="Total Interviews"
            value={totalInterviews}
            color="text-amber-400"
            icon={<div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs md:text-base">💼</div>}
          />
          <StatCard
            title="Interview Rate"
            value={`${interviewRate}%`}
            color="text-purple-400"
            icon={<div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs md:text-base">📈</div>}
          />
          <StatCard
            title="Offer Rate"
            value={`${offerRate}%`}
            color="text-emerald-400"
            icon={<div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs md:text-base">🎯</div>}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Applications Trend - Area Chart */}
          <ChartContainer title="Applications Trend">
            <ResponsiveContainer width="100%" height={280} className="text-xs md:text-sm">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="applicationsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" fontSize={10} axisLine={false} tickLine={false}/>
                <YAxis stroke="rgba(255,255,255,0.6)" fontSize={10} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} fill="url(#applicationsGradient)" dot={{ fill: '#3B82F6', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#3B82F6', stroke: '#1E40AF', strokeWidth: 2 }}/>
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Conversion Rates - Radial Chart */}
          <ChartContainer title="Conversion Metrics">
            <div className="flex items-center justify-center h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="80%" data={conversionData}>
                  <RadialBar dataKey="value" cornerRadius={8} fill="#8B5CF6" background={{ fill: 'rgba(139, 92, 246, 0.1)' }}/>
                  <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ color: '#fff', fontSize: '12px' }}/>
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
