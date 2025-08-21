
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Layout from '../components/Layout';
// import { applicationAPI, Application } from '../lib/api';
// import { 
//   FiLoader, 
//   FiPlus, 
//   FiCalendar, 
//   FiMapPin, 
//   FiDollarSign, 
//   FiExternalLink, 
//   FiSearch,
//   FiChevronRight,
//   FiBriefcase,
//   FiX
// } from 'react-icons/fi';

// const statusColumns = [
//   { 
//     key: 'saved', 
//     label: 'Saved', 
//     description: 'Jobs you want to apply to',
//     iconColor: 'text-amber-400',
//     gradient: 'from-amber-500/20 to-yellow-500/20',
//     hoverShadow: 'hover:shadow-amber-500/20'
//   },
//   { 
//     key: 'applied', 
//     label: 'Applied', 
//     description: 'Applications submitted',
//     iconColor: 'text-blue-400',
//     gradient: 'from-blue-500/20 to-cyan-500/20',
//     hoverShadow: 'hover:shadow-blue-500/20'
//   },
//   { 
//     key: 'interview', 
//     label: 'Interview', 
//     description: 'In progress interviews',
//     iconColor: 'text-purple-400',
//     gradient: 'from-purple-500/20 to-fuchsia-500/20',
//     hoverShadow: 'hover:shadow-purple-500/20'
//   },
//   { 
//     key: 'offer', 
//     label: 'Offer', 
//     description: 'Received offers',
//     iconColor: 'text-emerald-400',
//     gradient: 'from-emerald-500/20 to-teal-500/20',
//     hoverShadow: 'hover:shadow-emerald-500/20'
//   },
//   { 
//     key: 'rejected', 
//     label: 'Rejected', 
//     description: 'Unsuccessful applications',
//     iconColor: 'text-rose-400',
//     gradient: 'from-rose-500/20 to-red-500/20',
//     hoverShadow: 'hover:shadow-rose-500/20'
//   },
//   { 
//     key: 'withdrawn', 
//     label: 'Withdrawn', 
//     description: 'Applications withdrawn',
//     iconColor: 'text-gray-400',
//     gradient: 'from-gray-500/20 to-slate-500/20',
//     hoverShadow: 'hover:shadow-gray-500/20'
//   },
// ];

// const PipelinePage: React.FC = () => {
//   const [applications, setApplications] = useState<Application[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
//   const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
//   const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const router = useRouter();

//   useEffect(() => {
//     fetchApplications();
//   }, []);

//   const fetchApplications = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await applicationAPI.getAll();
//       setApplications(response.data || response);
//     } catch (err: any) {
//       console.error('Error fetching applications:', err);
//       setError(err.response?.data?.message || err.message || 'Failed to fetch applications');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (applicationId: number, newStatus: string) => {
//     try {
//       setUpdatingStatus(applicationId);
//       setError(null);
      
//       let updateResponse;
//       try {
//         updateResponse = await applicationAPI.updateStatus(applicationId, newStatus);
//       } catch (firstError) {
//         try {
//           updateResponse = await applicationAPI.update(applicationId, { status: newStatus });
//         } catch (secondError) {
//           updateResponse = await fetch(`/api/applications/${applicationId}`, {
//             method: 'PATCH',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ status: newStatus }),
//           });
          
//           if (!updateResponse.ok) {
//             throw new Error(`HTTP error! status: ${updateResponse.status}`);
//           }
//         }
//       }
      
//       await fetchApplications();
//     } catch (err: any) {
//       console.error('Error updating status:', err);
//       setError(err.response?.data?.message || err.message || 'Failed to update status');
//     } finally {
//       setUpdatingStatus(null);
//     }
//   };

//   const handleDeleteApplication = async () => {
//     if (!selectedApplication) return;
//     try {
//       setError(null);
//       await applicationAPI.delete(selectedApplication.id);
//       await fetchApplications();
//       setDeleteDialogOpen(false);
//     } catch (err: any) {
//       console.error('Error deleting application:', err);
//       setError(err.response?.data?.message || err.message || 'Failed to delete application');
//     }
//   };

//   const handleAddApplication = () => {
//     router.push('/add-application');
//   };

//   const handleJobClick = (applicationId: number) => {
//     const possibleRoutes = [
//       `/application/${applicationId}`,
//       `/applications/${applicationId}`,
//       `/job/${applicationId}`,
//       `/jobs/${applicationId}`
//     ];
//     router.push(possibleRoutes[0]);
//   };

//   const handleEditApplication = (applicationId: number) => {
//     const possibleEditRoutes = [
//       `/application/${applicationId}/edit`,
//       `/applications/${applicationId}/edit`,
//       `/edit-application/${applicationId}`,
//       `/application/edit/${applicationId}`
//     ];
//     router.push(possibleEditRoutes[0]);
//   };

//   const getApplicationsByStatus = (status: string) => {
//     return applications
//       .filter((app) => app.status === status)
//       .filter((app) =>
//         searchQuery
//           ? app.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             app.company_name.toLowerCase().includes(searchQuery.toLowerCase())
//           : true
//       );
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'applied': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
//       case 'interview': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
//       case 'offer': return 'bg-green-500/20 text-green-300 border-green-500/30';
//       case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
//       case 'withdrawn': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
//       default: return 'bg-gray-400/20 text-gray-300 border-gray-400/30';
//     }
//   };

//   const ApplicationTable: React.FC<{ applications: Application[], status: string }> = ({ applications, status }) => {
//     const statusInfo = statusColumns.find(s => s.key === status);
    
//     return (
//       <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 shadow-2xl">
//         <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${statusInfo?.gradient} blur-3xl opacity-30`}></div>
        
//         <div className="relative p-6">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => setSelectedStatus(null)}
//                 className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
//               >
//                 <FiChevronRight className="rotate-180 w-5 h-5" />
//                 Back to Statuses
//               </button>
//               <h3 className="text-2xl font-bold text-white">
//                 {statusInfo?.label} Applications
//               </h3>
//             </div>
//             <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${statusInfo?.iconColor} bg-white/5 border border-white/10`}>
//               {applications.length} {applications.length === 1 ? 'application' : 'applications'}
//             </span>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-sm text-left text-gray-300">
//               <thead className="text-xs uppercase bg-white/5 border-b border-white/10">
//                 <tr>
//                   <th scope="col" className="px-6 py-4 font-medium text-white/80">#</th>
//                   <th scope="col" className="px-6 py-4 font-medium text-white/80">Job Title</th>
//                   <th scope="col" className="px-6 py-4 font-medium text-white/80">Company</th>
//                   <th scope="col" className="px-6 py-4 font-medium text-white/80">Date</th>
//                   <th scope="col" className="px-6 py-4 font-medium text-white/80">Location</th>
//                   <th scope="col" className="px-6 py-4 font-medium text-white/80">Salary</th>
//                   <th scope="col" className="px-6 py-4 font-medium text-white/80">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {applications.map((application, index) => (
//                   <tr 
//                     key={application.id} 
//                     className="group border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
//                     onClick={() => handleJobClick(application.id)}
//                   >
//                     <td className="px-6 py-4 font-medium text-white/70">{index + 1}</td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 rounded-lg bg-white/5">
//                           <FiBriefcase className="w-4 h-4 text-white/70" />
//                         </div>
//                         <span className="font-medium text-white">{application.job_title}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">{application.company_name}</td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <FiCalendar className="w-4 h-4 text-white/50" />
//                         {new Date(application.application_date).toLocaleDateString()}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       {application.location && (
//                         <div className="flex items-center gap-2">
//                           <FiMapPin className="w-4 h-4 text-white/50" />
//                           {application.location}
//                         </div>
//                       )}
//                     </td>
//                     <td className="px-6 py-4">
//                       {application.salary && (
//                         <div className="flex items-center gap-2">
//                           <FiDollarSign className="w-4 h-4 text-white/50" />
//                           {application.salary}
//                         </div>
//                       )}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex gap-3 items-center" onClick={(e) => e.stopPropagation()}>
//                         {application.job_url && (
//                           <button
//                             onClick={() => window.open(application.job_url, '_blank')}
//                             className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
//                             title="Open job posting"
//                           >
//                             <FiExternalLink className="w-4 h-4" />
//                           </button>
//                         )}
                        
//                         <button
//                           onClick={() => handleEditApplication(application.id)}
//                           className="px-3 py-1.5 text-xs rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
//                         >
//                           Edit
//                         </button>
                        
//                         <button
//                           onClick={() => {
//                             setSelectedApplication(application);
//                             setDeleteDialogOpen(true);
//                           }}
//                           className="px-3 py-1.5 text-xs rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white transition-colors"
//                         >
//                           Delete
//                         </button>
                        
//                         <select
//                           value={application.status}
//                           onChange={(e) => handleStatusChange(application.id, e.target.value)}
//                           disabled={updatingStatus === application.id}
//                           className={`bg-white/5 border ${getStatusColor(application.status)} rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
//                         >
//                           {statusColumns.map((status) => (
//                             <option key={status.key} value={status.key} className="bg-gray-900 text-white">
//                               {status.label}
//                             </option>
//                           ))}
//                         </select>
                        
//                         {updatingStatus === application.id && (
//                           <FiLoader className="w-4 h-4 text-primary animate-spin" />
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
          
//           {applications.length === 0 && (
//             <div className="text-center py-16">
//               <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
//                 <FiBriefcase className="w-8 h-8 text-white/40" />
//               </div>
//               <p className="text-white/60 mb-6 text-lg">No applications found in this category</p>
//               <button 
//                 onClick={handleAddApplication}
//                 className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl font-medium transition-all duration-300 hover:scale-105"
//               >
//                 Add New Application
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-[400px]">
//           <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="flex-1 px-4 py-6 max-w-7xl mx-auto space-y-6">
//         {error && (
//           <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-xl mb-6 flex items-center justify-between">
//             <span>{error}</span>
//             <button 
//               onClick={() => setError(null)}
//               className="text-red-300 hover:text-white ml-4"
//             >
//               <FiX className="w-5 h-5" />
//             </button>
//           </div>
//         )}

//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//           <div>
//             <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
//               Application Pipeline
//             </h2>
//             <p className="text-white/60">Track your job applications through each stage</p>
//           </div>
//           <div className="flex gap-4 w-full sm:w-auto">
//             <div className="relative flex-1 sm:flex-none">
//               <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by job title or company..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary w-full sm:w-64"
//               />
//             </div>
//             <button 
//               onClick={handleAddApplication}
//               className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
//               <div className="relative flex items-center gap-2">
//                 <FiPlus className="h-4 w-4" />
//                 Add Application
//               </div>
//             </button>
//           </div>
//         </div>

//         {!selectedStatus ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
//             {statusColumns.map(({ key, label, description, iconColor, gradient, hoverShadow }) => {
//               const columnApplications = getApplicationsByStatus(key);
              
//               return (
//                 <div
//                   key={key}
//                   className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} backdrop-blur-md border border-white/10 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${hoverShadow}`}
//                   onClick={() => setSelectedStatus(key)}
//                 >
//                   {/* Animated background element */}
//                   <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
//                   {/* Floating orb effect */}
//                   <div className={`absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br ${gradient} blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                  
//                   <div className="relative">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-md`}>
//                         <FiBriefcase className={`w-5 h-5 ${iconColor}`} />
//                       </div>
//                       <span className={`px-3 py-1 rounded-full text-xs font-semibold ${iconColor} bg-white/5 border border-white/10`}>
//                         {columnApplications.length}
//                       </span>
//                     </div>
                    
//                     <h3 className="text-xl font-bold text-white mb-2">{label}</h3>
//                     <p className="text-white/60 text-sm leading-relaxed">{description}</p>
                    
//                     {/* Hover indicator */}
//                     <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-white/0 via-white/50 to-white/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <ApplicationTable applications={getApplicationsByStatus(selectedStatus)} status={selectedStatus} />
//         )}

//         {deleteDialogOpen && (
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
//             <div className="bg-gray-900/95 border border-gray-700/50 p-6 max-w-sm w-full rounded-xl shadow-2xl">
//               <h2 className="text-xl font-bold text-white mb-4">Confirm Delete</h2>
//               <p className="text-gray-300 mb-6">
//                 Are you sure you want to delete the application for{' '}
//                 <span className="font-semibold text-white">
//                   {selectedApplication?.job_title} at {selectedApplication?.company_name}
//                 </span>? This action cannot be undone.
//               </p>
//               <div className="flex justify-end gap-4">
//                 <button
//                   onClick={() => setDeleteDialogOpen(false)}
//                   className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDeleteApplication}
//                   className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 rounded-lg transition-colors font-medium"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default PipelinePage;


import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { applicationAPI, Application, ApplicationStatus } from '../lib/api';
import { 
  FiLoader, 
  FiPlus, 
  FiCalendar, 
  FiMapPin, 
  FiDollarSign, 
  FiExternalLink, 
  FiSearch,
  FiChevronRight,
  FiBriefcase,
  FiX
} from 'react-icons/fi';

const statusColumns: { key: ApplicationStatus; label: string; description: string; iconColor: string; gradient: string; hoverShadow: string }[] = [
  { key: 'saved', label: 'Saved', description: 'Jobs you want to apply to', iconColor: 'text-amber-400', gradient: 'from-amber-500/20 to-yellow-500/20', hoverShadow: 'hover:shadow-amber-500/20' },
  { key: 'applied', label: 'Applied', description: 'Applications submitted', iconColor: 'text-blue-400', gradient: 'from-blue-500/20 to-cyan-500/20', hoverShadow: 'hover:shadow-blue-500/20' },
  { key: 'interview', label: 'Interview', description: 'In progress interviews', iconColor: 'text-purple-400', gradient: 'from-purple-500/20 to-fuchsia-500/20', hoverShadow: 'hover:shadow-purple-500/20' },
  { key: 'offer', label: 'Offer', description: 'Received offers', iconColor: 'text-emerald-400', gradient: 'from-emerald-500/20 to-teal-500/20', hoverShadow: 'hover:shadow-emerald-500/20' },
  { key: 'rejected', label: 'Rejected', description: 'Unsuccessful applications', iconColor: 'text-rose-400', gradient: 'from-rose-500/20 to-red-500/20', hoverShadow: 'hover:shadow-rose-500/20' },
  { key: 'withdrawn', label: 'Withdrawn', description: 'Applications withdrawn', iconColor: 'text-gray-400', gradient: 'from-gray-500/20 to-slate-500/20', hoverShadow: 'hover:shadow-gray-500/20' },
];

const PipelinePage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await applicationAPI.getAll();
      setApplications(response.data || response);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: number, newStatus: ApplicationStatus) => {
    try {
      setUpdatingStatus(applicationId);
      setError(null);
      
      let updateResponse;
      try {
        updateResponse = await applicationAPI.updateStatus(applicationId, newStatus);
      } catch (firstError) {
        try {
          updateResponse = await applicationAPI.update(applicationId, { status: newStatus });
        } catch (secondError) {
          updateResponse = await fetch(`/api/applications/${applicationId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
          });
          if (!updateResponse.ok) throw new Error(`HTTP error! status: ${updateResponse.status}`);
        }
      }
      await fetchApplications();
    } catch (err: any) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteApplication = async () => {
    if (!selectedApplication) return;
    try {
      setError(null);
      await applicationAPI.delete(selectedApplication.id);
      await fetchApplications();
      setDeleteDialogOpen(false);
    } catch (err: any) {
      console.error('Error deleting application:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete application');
    }
  };

  const handleAddApplication = () => router.push('/add-application');
  const handleJobClick = (applicationId: number) => router.push(`/applications/${applicationId}`);
  const handleEditApplication = (applicationId: number) => router.push(`/applications/${applicationId}/edit`);

  const getApplicationsByStatus = (status: ApplicationStatus) => applications
    .filter(app => app.status === status)
    .filter(app => searchQuery ? app.job_title.toLowerCase().includes(searchQuery.toLowerCase()) || app.company_name.toLowerCase().includes(searchQuery.toLowerCase()) : true);

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'applied': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'interview': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'offer': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'withdrawn': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-400/20 text-gray-300 border-gray-400/30';
    }
  };

  const ApplicationTable: React.FC<{ applications: Application[]; status: ApplicationStatus }> = ({ applications, status }) => {
    const statusInfo = statusColumns.find(s => s.key === status);
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${statusInfo?.gradient} blur-3xl opacity-30`}></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedStatus(null)} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                <FiChevronRight className="rotate-180 w-5 h-5" /> Back to Statuses
              </button>
              <h3 className="text-2xl font-bold text-white">{statusInfo?.label} Applications</h3>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${statusInfo?.iconColor} bg-white/5 border border-white/10`}>
              {applications.length} {applications.length === 1 ? 'application' : 'applications'}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium text-white/80">#</th>
                  <th className="px-6 py-4 font-medium text-white/80">Job Title</th>
                  <th className="px-6 py-4 font-medium text-white/80">Company</th>
                  <th className="px-6 py-4 font-medium text-white/80">Date</th>
                  <th className="px-6 py-4 font-medium text-white/80">Location</th>
                  <th className="px-6 py-4 font-medium text-white/80">Salary</th>
                  <th className="px-6 py-4 font-medium text-white/80">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application, index) => (
                  <tr key={application.id} className="group border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors" onClick={() => handleJobClick(application.id)}>
                    <td className="px-6 py-4 font-medium text-white/70">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5">
                          <FiBriefcase className="w-4 h-4 text-white/70" />
                        </div>
                        <span className="font-medium text-white">{application.job_title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{application.company_name}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-white/50" /> {new Date(application.application_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{application.location && <div className="flex items-center gap-2"><FiMapPin className="w-4 h-4 text-white/50" />{application.location}</div>}</td>
                    <td className="px-6 py-4">{application.salary_range && <div className="flex items-center gap-2"><FiDollarSign className="w-4 h-4 text-white/50" />{application.salary_range}</div>}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3 items-center" onClick={e => e.stopPropagation()}>
                        {application.job_posting_url && (
                          <button onClick={() => window.open(application.job_posting_url, '_blank')} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors" title="Open job posting">
                            <FiExternalLink className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleEditApplication(application.id)} className="px-3 py-1.5 text-xs rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors">Edit</button>
                        <button onClick={() => { setSelectedApplication(application); setDeleteDialogOpen(true); }} className="px-3 py-1.5 text-xs rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white transition-colors">Delete</button>
                        <select value={application.status} onChange={(e) => handleStatusChange(application.id, e.target.value as ApplicationStatus)} disabled={updatingStatus === application.id} className={`bg-white/5 border ${getStatusColor(application.status)} rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}>
                          {statusColumns.map(status => (
                            <option key={status.key} value={status.key} className="bg-gray-900 text-white">{status.label}</option>
                          ))}
                        </select>
                        {updatingStatus === application.id && <FiLoader className="w-4 h-4 text-primary animate-spin" />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <Layout><div className="flex justify-center items-center min-h-[400px]"><div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div></div></Layout>;

  return (
    <Layout>
      <div className="flex-1 px-4 py-6 max-w-7xl mx-auto space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-xl mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-300 hover:text-white ml-4">
              <FiX className="w-5 h-5" />
            </button>
          </div>
        )}
        {/* Add your search and status grid here */}
        {!selectedStatus ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {statusColumns.map(({ key, label, description, iconColor, gradient, hoverShadow }) => {
              const columnApplications = getApplicationsByStatus(key);
              return (
                <div key={key} className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} backdrop-blur-md border border-white/10 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${hoverShadow}`} onClick={() => setSelectedStatus(key)}>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className={`absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br ${gradient} blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-md`}>
                        <FiBriefcase className={`w-5 h-5 ${iconColor}`} />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${iconColor} bg-white/5 border border-white/10`}>{columnApplications.length}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{label}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <ApplicationTable applications={getApplicationsByStatus(selectedStatus)} status={selectedStatus} />
        )}
      </div>
    </Layout>
  );
};

export default PipelinePage;
