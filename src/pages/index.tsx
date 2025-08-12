import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { statsAPI, applicationAPI, DashboardStats, Application } from '../lib/api';
import { 
  FiLoader, 
  FiBriefcase, 
  FiCalendar, 
  FiTrendingUp, 
  FiAward,
  FiClock,
  FiMapPin,
  FiChevronRight,
  FiPlus,
  FiAlertCircle,
  FiExternalLink,
  FiArrowUpRight
} from 'react-icons/fi';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
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
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-${hoverColor}-500/20`}>
      <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-xl"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-white/70 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
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
    <Layout>
      <div className="flex-1 px-4 py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
              Dashboard Overview
            </h1>
            <p className="text-white/60">Track your job search progress and recent applications</p>
          </div>
          <button 
            onClick={() => router.push('/add-application')}
            className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <div className="relative flex items-center gap-2">
              <FiPlus className="h-5 w-5" />
              New Application
            </div>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FiBriefcase}
            title="Total Applications"
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
            title="Interview Rate"
            value={`${stats?.interview_rate || 0}%`}
            gradient="from-purple-500/20 to-pink-500/30"
            hoverColor="purple"
          />
          <StatCard
            icon={FiAward}
            title="Offer Rate"
            value={`${stats?.offer_rate || 0}%`}
            gradient="from-green-500/20 to-emerald-500/30"
            hoverColor="green"
          />
        </div>

        {/* Recent Applications */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl"></div>
          
          <div className="relative p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Recent Applications</h2>
                <p className="text-white/60">Your most recent job applications</p>
              </div>
              <button 
                onClick={() => router.push('/applications')}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200"
              >
                View all 
                <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {recentApplications.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <FiBriefcase className="w-8 h-8 text-white/40" />
                </div>
                <p className="text-white/60 mb-6 text-lg">No applications found</p>
                <button 
                  onClick={() => router.push('/application/new')}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl font-medium transition-all duration-300 hover:scale-105"
                >
                  Add your first application
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {recentApplications.map((application, index) => (
                  <div
                    key={application.id}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-white/5 to-white/2 backdrop-blur-sm border border-white/10 hover:border-white/20 p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10"
                    onClick={() => router.push(`/application/${application.id}`)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Floating orb effect */}
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="relative">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-200 group-hover:to-purple-200 group-hover:bg-clip-text transition-all duration-300">
                              {application.job_title}
                            </h3>
                            {application.job_url && (
                              <button 
                                className="opacity-0 group-hover:opacity-100 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(application.job_url, '_blank');
                                }}
                              >
                                <FiArrowUpRight className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-white/80 text-lg font-medium mb-3">{application.company_name}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${getStatusColor(application.status)}`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 text-sm text-white/60">
                        {application.location && (
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-white/5">
                              <FiMapPin className="w-4 h-4" />
                            </div>
                            <span className="font-medium">{application.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-white/5">
                            <FiClock className="w-4 h-4" />
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
  );
};

export default Dashboard;