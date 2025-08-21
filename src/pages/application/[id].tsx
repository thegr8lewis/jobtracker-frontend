// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs, { Dayjs } from 'dayjs';
// import Layout from '../../components/Layout';
// import { applicationAPI, Application, TimelineEvent } from '../../lib/api';
// import { 
//   FiArrowLeft, 
//   FiEdit, 
//   FiSave, 
//   FiX, 
//   FiPlus, 
//   FiLoader, 
//   FiExternalLink, 
//   FiCheckCircle, 
//   FiCircle, 
//   FiClock, 
//   FiEye,
//   FiDownload,
//   FiFileText,
//   FiUser,
//   FiChevronDown,
//   FiChevronUp,
//   FiCalendar,
//   FiDollarSign,
//   FiLink,
//   FiBriefcase,
//   FiAlertCircle,
//   FiTrash2,
//   FiMapPin
// } from 'react-icons/fi';

// const ApplicationDetails: React.FC = () => {
//   const [application, setApplication] = useState<Application | null>(null);
//   const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [editData, setEditData] = useState<Partial<Application>>({});
//   const [editDate, setEditDate] = useState<Dayjs | null>(null);
//   const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
//   const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
//   const [previewType, setPreviewType] = useState<'resume' | 'cover_letter'>('resume');
//   const [downloadingPDF, setDownloadingPDF] = useState(false);
//   const [newEvent, setNewEvent] = useState({
//     event_type: 'note',
//     title: '',
//     description: '',
//     date: dayjs().format('YYYY-MM-DD'),
//     completed: false
//   });
//   const [expandedSection, setExpandedSection] = useState<string | null>('jobInfo');
//   const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
//   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
//   const [eventToDelete, setEventToDelete] = useState<number | null>(null);
//   const [timelineProcessing, setTimelineProcessing] = useState(false);
//   const router = useRouter();
//   const { id } = router.query;

//   useEffect(() => {
//     if (id) {
//       fetchApplication();
//     }
//   }, [id]);

//   const fetchApplication = async () => {
//   try {
//     setLoading(true);
//     setError(null);
    
//     const response = await applicationAPI.getById(Number(id));
//     const appData = response.data;
    
//     // Transform the data to match your frontend expectations if needed
//     const transformedData = {
//       ...appData,
//       resume_url: appData.resume || '',  // Map resume to resume_url
//       cover_letter_url: appData.cover_letter || ''  // Map cover_letter to cover_letter_url
//     };
    
//     // Fetch timeline events
//     const timelineResponse = await applicationAPI.getTimelineEvents(Number(id));
    
//     // Merge the data
//     const fullData = {
//       ...transformedData,
//       timeline: timelineResponse.data
//     };
    
//     setApplication(fullData);
//     setEditData(fullData);
//     setEditDate(dayjs(fullData.application_date));
//     setTimeline(fullData.timeline || []);
    
//   } catch (err: any) {
//     console.error('Error fetching application:', err);
//     setError(err.message || 'Failed to fetch application');
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleEdit = () => {
//     setEditing(true);
//     setEditData(application || {});
//     setEditDate(dayjs(application?.application_date));
//   };

//   const handleSave = async () => {
//     if (!application) return;
//     try {
//       setSaving(true);
//       const updateData = {
//         ...editData,
//         application_date: editDate?.format('YYYY-MM-DD'),
//       };
//       await applicationAPI.update(application.id, updateData);
//       await fetchApplication();
//       setEditing(false);
//     } catch (err: any) {
//       setError(err.message || 'Failed to update application');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDownloadPDF = async () => {
//     if (!application) return;
//     try {
//       setDownloadingPDF(true);
//       const { jsPDF } = await import('jspdf');
//       const doc = new jsPDF();
      
//       doc.setFontSize(20);
//       doc.text('Job Application Details', 20, 30);
      
//       doc.setFontSize(16);
//       doc.text('Job Information', 20, 50);
//       doc.setFontSize(12);
//       doc.text(`Job Title: ${application.job_title}`, 20, 65);
//       doc.text(`Company: ${application.company_name}`, 20, 75);
//       doc.text(`Location: ${application.location || 'Not specified'}`, 20, 85);
//       doc.text(`Salary Range: ${application.salary_range || 'Not specified'}`, 20, 95);
//       doc.text(`Application Date: ${dayjs(application.application_date).format('MMMM D, YYYY')}`, 20, 105);
//       doc.text(`Status: ${application.status}`, 20, 115);
      
//       if (application.notes) {
//         doc.text('Notes:', 20, 130);
//         const splitNotes = doc.splitTextToSize(application.notes, 170);
//         doc.text(splitNotes, 20, 140);
//       }
      
//       doc.save(`${application.job_title}_${application.company_name}_Application.pdf`);
//     } catch (err: any) {
//       setError(err.message || 'Failed to download PDF');
//     } finally {
//       setDownloadingPDF(false);
//     }
//   };

//   const handleCancel = () => {
//     setEditing(false);
//     setEditData(application || {});
//     setEditDate(dayjs(application?.application_date));
//   };

//   const handleAddTimelineEvent = async () => {
//     if (!application || !newEvent.title.trim()) return;
//     try {
//       setTimelineProcessing(true);
//       const response = await applicationAPI.addTimelineEvent(application.id, {
//         ...newEvent,
//         date: dayjs(newEvent.date).format('YYYY-MM-DD')
//       });
      
//       setTimeline(prev => [response.data, ...prev]);
//       resetTimelineForm();
//     } catch (err: any) {
//       setError(err.message || 'Failed to add timeline event');
//     } finally {
//       setTimelineProcessing(false);
//     }
//   };

//   const handleEditEvent = (event: TimelineEvent) => {
//     setEditingEvent(event);
//     setNewEvent({
//       event_type: event.event_type,
//       title: event.title,
//       description: event.description || '',
//       date: event.date,
//       completed: event.completed
//     });
//     setTimelineDialogOpen(true);
//   };

//   const handleUpdateTimelineEvent = async () => {
//     if (!application || !editingEvent || !newEvent.title.trim()) return;
//     try {
//       setTimelineProcessing(true);
//       const response = await applicationAPI.updateTimelineEvent(
//         application.id,
//         editingEvent.id,
//         {
//           ...newEvent,
//           date: dayjs(newEvent.date).format('YYYY-MM-DD')
//         }
//       );

//       setTimeline(prev => 
//         prev.map(event => 
//           event.id === editingEvent.id ? response.data : event
//         )
//       );
//       resetTimelineForm();
//     } catch (err: any) {
//       setError(err.message || 'Failed to update event');
//     } finally {
//       setTimelineProcessing(false);
//     }
//   };

//   const handleDeleteEvent = async () => {
//     if (!application || !eventToDelete) return;
//     try {
//       setTimelineProcessing(true);
//       await applicationAPI.deleteTimelineEvent(application.id, eventToDelete);
//       setTimeline(prev => prev.filter(event => event.id !== eventToDelete));
//       setDeleteConfirmOpen(false);
//     } catch (err: any) {
//       setError(err.message || 'Failed to delete event');
//     } finally {
//       setTimelineProcessing(false);
//     }
//   };

//   const resetTimelineForm = () => {
//     setNewEvent({
//       event_type: 'note',
//       title: '',
//       description: '',
//       date: dayjs().format('YYYY-MM-DD'),
//       completed: false
//     });
//     setEditingEvent(null);
//     setTimelineDialogOpen(false);
//   };

//   const handlePreview = (type: 'resume' | 'cover_letter') => {
//     setPreviewType(type);
//     setPreviewDialogOpen(true);
//   };

//   const toggleSection = (section: string) => {
//     setExpandedSection(expandedSection === section ? null : section);
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'applied': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
//       case 'interview': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
//       case 'offer': return 'bg-green-500/20 text-green-400 border-green-500/30';
//       case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
//       case 'withdrawn': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
//       default: return 'bg-gray-400/20 text-gray-400 border-gray-400/30';
//     }
//   };

//   const getStatusGradient = (status: string) => {
//     switch (status) {
//       case 'applied': return 'from-blue-500/10 to-blue-700/10';
//       case 'interview': return 'from-purple-500/10 to-purple-700/10';
//       case 'offer': return 'from-green-500/10 to-green-700/10';
//       case 'rejected': return 'from-red-500/10 to-red-700/10';
//       case 'withdrawn': return 'from-gray-500/10 to-gray-700/10';
//       default: return 'from-gray-400/10 to-gray-600/10';
//     }
//   };

//   const getEventIcon = (eventType: string, isCompleted: boolean, isNext: boolean) => {
//     const iconClass = "h-5 w-5";
//     if (isCompleted) return <FiCheckCircle className={iconClass} />;
//     if (isNext) return <FiClock className={`${iconClass} animate-pulse`} />;
//     return <FiCircle className={iconClass} />;
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-[400px]">
//           <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
//         </div>
//       </Layout>
//     );
//   }

//   if (error || !application) {
//     return (
//       <Layout>
//         <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-xl mb-6 flex items-center gap-2">
//           <FiAlertCircle className="w-5 h-5" />
//           {error || 'Application not found'}
//         </div>
//         <button
//           onClick={() => router.push('/pipeline')}
//           className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-xl transition-colors"
//         >
//           <FiArrowLeft className="w-5 h-5" />
//           Back to Pipeline
//         </button>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="max-w-7xl mx-auto px-4 py-6">
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => router.push('/pipeline')}
//               className="p-2 rounded-xl hover:bg-white/10 transition-colors"
//             >
//               <FiArrowLeft className="w-6 h-6 text-white" />
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold text-white">{application.job_title}</h1>
//               <p className="text-lg text-purple-200">{application.company_name}</p>
//             </div>
//           </div>
          
//           <div className="flex flex-wrap gap-3">
//             <button
//               onClick={handleDownloadPDF}
//               disabled={downloadingPDF}
//               className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
//                 downloadingPDF 
//                   ? 'bg-gray-700 text-gray-400' 
//                   : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
//               }`}
//             >
//               {downloadingPDF ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiDownload className="w-5 h-5" />}
//               Export
//             </button>
            
//             {!editing ? (
//               <button
//                 onClick={handleEdit}
//                 className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
//               >
//                 <FiEdit className="w-5 h-5" />
//                 Edit
//               </button>
//             ) : (
//               <>
//                 <button
//                   onClick={handleSave}
//                   disabled={saving}
//                   className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl text-white transition-colors"
//                 >
//                   {saving ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiSave className="w-5 h-5" />}
//                   Save
//                 </button>
//                 <button
//                   onClick={handleCancel}
//                   disabled={saving}
//                   className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition-colors"
//                 >
//                   <FiX className="w-5 h-5" />
//                   Cancel
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Status Badge */}
//         <div className="flex items-center gap-4 mb-8">
//           <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium ${getStatusColor(application.status)}`}>
//             {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
//           </span>
//           {application.location && (
//             <div className="flex items-center gap-2 text-gray-400">
//               <FiMapPin className="w-4 h-4" />
//               <span>{application.location}</span>
//             </div>
//           )}
//           {application.salary_range && (
//             <div className="flex items-center gap-2 text-gray-400">
//               <FiDollarSign className="w-4 h-4" />
//               <span>{application.salary_range}</span>
//             </div>
//           )}
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Left Column - Job Info and Documents */}
//           <div className="lg:col-span-3 space-y-6">
//             {/* Collapsible Job Information Section */}
//             <div className={`bg-gradient-to-br ${getStatusGradient(application.status)} rounded-2xl border border-white/10 overflow-hidden transition-all duration-300`}>
//               <div 
//                 className="flex justify-between items-center p-6 cursor-pointer"
//                 onClick={() => toggleSection('jobInfo')}
//               >
//                 <h2 className="text-xl font-semibold text-white flex items-center gap-3">
//                   <FiBriefcase className="text-purple-400" />
//                   Job Information
//                 </h2>
//                 {expandedSection === 'jobInfo' ? (
//                   <FiChevronUp className="w-5 h-5 text-gray-400" />
//                 ) : (
//                   <FiChevronDown className="w-5 h-5 text-gray-400" />
//                 )}
//               </div>
              
//               {expandedSection === 'jobInfo' && (
//                 <div className="px-6 pb-6 space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm text-gray-400 mb-2">Job Title</label>
//                       {editing ? (
//                         <input
//                           value={editData.job_title || ''}
//                           onChange={(e) => setEditData({ ...editData, job_title: e.target.value })}
//                           className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                         />
//                       ) : (
//                         <p className="text-lg font-medium text-white">{application.job_title}</p>
//                       )}
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm text-gray-400 mb-2">Company</label>
//                       {editing ? (
//                         <input
//                           value={editData.company_name || ''}
//                           onChange={(e) => setEditData({ ...editData, company_name: e.target.value })}
//                           className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                         />
//                       ) : (
//                         <p className="text-lg font-medium text-white">{application.company_name}</p>
//                       )}
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm text-gray-400 mb-2">Application Date</label>
//                       {editing ? (
//                         <LocalizationProvider dateAdapter={AdapterDayjs}>
//                           <DatePicker
//                             value={editDate}
//                             onChange={(newValue) => setEditDate(newValue)}
//                             slotProps={{
//                               textField: {
//                                 className: 'w-full',
//                                 InputProps: {
//                                   className: 'bg-gray-800/50 border-gray-700 text-white'
//                                 }
//                               }
//                             }}
//                           />
//                         </LocalizationProvider>
//                       ) : (
//                         <div className="flex items-center gap-2 text-white">
//                           <FiCalendar className="w-5 h-5 text-purple-400" />
//                           <span>{dayjs(application.application_date).format('MMMM D, YYYY')}</span>
//                         </div>
//                       )}
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm text-gray-400 mb-2">Status</label>
//                       {editing ? (
//                         <select
//                           value={editData.status || ''}
//                           onChange={(e) => setEditData({ ...editData, status: e.target.value as Application['status'] })}
//                           className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                         >
//                           <option value="saved">Saved</option>
//                           <option value="applied">Applied</option>
//                           <option value="interview">Interview</option>
//                           <option value="offer">Offer</option>
//                           <option value="rejected">Rejected</option>
//                           <option value="withdrawn">Withdrawn</option>
//                         </select>
//                       ) : (
//                         <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium ${getStatusColor(application.status)}`}>
//                           {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
//                         </span>
//                       )}
//                     </div>
                    
//                     {application.job_posting_url && (
//                       <div className="md:col-span-2">
//                         <label className="block text-sm text-gray-400 mb-2">Job Posting</label>
//                         {editing ? (
//                           <div className="flex items-center gap-2">
//                             <input
//                               value={editData.job_posting_url || ''}
//                               onChange={(e) => setEditData({ ...editData, job_posting_url: e.target.value })}
//                               className="flex-1 p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                               type="url"
//                               placeholder="https://example.com/job-posting"
//                             />
//                           </div>
//                         ) : (
//                           <a
//                             href={application.job_posting_url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
//                           >
//                             <FiExternalLink className="w-5 h-5" />
//                             <span>View Job Posting</span>
//                           </a>
//                         )}
//                       </div>
//                     )}
                    
//                     <div className="md:col-span-2">
//                       <label className="block text-sm text-gray-400 mb-2">Notes</label>
//                       {editing ? (
//                         <textarea
//                           value={editData.notes || ''}
//                           onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
//                           className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[120px]"
//                           placeholder="Add notes about this application..."
//                         />
//                       ) : (
//                         <div className="bg-gray-800/30 p-4 rounded-xl">
//                           <p className="text-gray-300 whitespace-pre-wrap">
//                             {application.notes || 'No notes added'}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Documents Section */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Resume Card */}
//               <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
//                 <div className="p-6 border-b border-gray-700">
//                   <div className="flex justify-between items-center">
//                     <h3 className="text-lg font-semibold text-white flex items-center gap-3">
//                       <FiUser className="text-blue-400" />
//                       Resume
//                     </h3>
//                     {application.resume_url && (
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handlePreview('resume')}
//                           className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-xl transition-colors"
//                         >
//                           <FiEye className="w-4 h-4" />
//                           Preview
//                         </button>
//                         <a
//                           href={application.resume_url}
//                           download
//                           className="flex items-center gap-2 px-3 py-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded-xl transition-colors"
//                         >
//                           <FiDownload className="w-4 h-4" />
//                           Download
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="p-6">
//                   {editing ? (
//                     <div>
//                       <label className="block text-sm text-gray-400 mb-2">Resume File URL</label>
//                       <div className="flex items-center gap-2">
//                         <FiLink className="text-gray-500" />
//                         <input
//                           type="url"
//                           value={editData.resume_url || ''}
//                           onChange={(e) => setEditData({ ...editData, resume_url: e.target.value })}
//                           className="flex-1 p-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                           placeholder="https://example.com/resume.pdf"
//                         />
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="bg-gray-900/30 rounded-xl p-4 min-h-[200px] flex flex-col">
//                       {application.resume_url ? (
//                         <div className="space-y-4 flex-1">
//                           <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
//                             <FiFileText className="w-12 h-12 text-blue-400" />
//                             <div>
//                               <p className="text-white font-medium text-lg">Resume PDF</p>
//                               <p className="text-gray-400 text-sm">Click preview to view the document</p>
//                               <p className="text-gray-500 text-xs mt-1">
//                                 {application.resume_url.split('/').pop() || 'resume.pdf'}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="flex items-center justify-center text-gray-500 h-full">
//                           <div className="text-center py-8">
//                             <FiUser className="w-12 h-12 mx-auto mb-3 text-gray-600" />
//                             <p className="text-gray-400">No resume uploaded</p>
//                             <p className="text-gray-600 text-sm">Upload a resume to see it here</p>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Cover Letter Card */}
//               <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
//                 <div className="p-6 border-b border-gray-700">
//                   <div className="flex justify-between items-center">
//                     <h3 className="text-lg font-semibold text-white flex items-center gap-3">
//                       <FiFileText className="text-green-400" />
//                       Cover Letter
//                     </h3>
//                     {application.cover_letter_url && (
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handlePreview('cover_letter')}
//                           className="flex items-center gap-2 px-3 py-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded-xl transition-colors"
//                         >
//                           <FiEye className="w-4 h-4" />
//                           Preview
//                         </button>
//                         <a
//                           href={application.cover_letter_url}
//                           download
//                           className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-xl transition-colors"
//                         >
//                           <FiDownload className="w-4 h-4" />
//                           Download
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="p-6">
//                   {editing ? (
//                     <div>
//                       <label className="block text-sm text-gray-400 mb-2">Cover Letter File URL</label>
//                       <div className="flex items-center gap-2">
//                         <FiLink className="text-gray-500" />
//                         <input
//                           type="url"
//                           value={editData.cover_letter_url || ''}
//                           onChange={(e) => setEditData({ ...editData, cover_letter_url: e.target.value })}
//                           className="flex-1 p-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
//                           placeholder="https://example.com/cover-letter.pdf"
//                         />
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="bg-gray-900/30 rounded-xl p-4 min-h-[200px] flex flex-col">
//                       {application.cover_letter_url ? (
//                         <div className="space-y-4 flex-1">
//                           <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
//                             <FiFileText className="w-12 h-12 text-green-400" />
//                             <div>
//                               <p className="text-white font-medium text-lg">Cover Letter PDF</p>
//                               <p className="text-gray-400 text-sm">Click preview to view the document</p>
//                               <p className="text-gray-500 text-xs mt-1">
//                                 {application.cover_letter_url.split('/').pop() || 'cover-letter.pdf'}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="flex items-center justify-center text-gray-500 h-full">
//                           <div className="text-center py-8">
//                             <FiFileText className="w-12 h-12 mx-auto mb-3 text-gray-600" />
//                             <p className="text-gray-400">No cover letter uploaded</p>
//                             <p className="text-gray-600 text-sm">Upload a cover letter to see it here</p>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Timeline */}
//           <div className="lg:col-span-1">
//             <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sticky top-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold text-white flex items-center gap-3">
//                   <FiClock className="text-purple-400 w-6 h-6" />
//                   Timeline
//                 </h2>
//                 <button
//                   onClick={() => {
//                     resetTimelineForm();
//                     setTimelineDialogOpen(true);
//                   }}
//                   className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-white transition-colors text-sm"
//                 >
//                   <FiPlus className="w-5 h-5" />
//                   Add Event
//                 </button>
//               </div>

//               {timeline.length === 0 ? (
//                 <div className="text-center py-8">
//                   <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
//                     <FiClock className="w-8 h-8 text-gray-500" />
//                   </div>
//                   <p className="text-gray-500">No timeline events yet</p>
//                   <p className="text-gray-600 text-sm mt-1">Track your application progress</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {timeline.map((event, index) => {
//                     const isLast = index === timeline.length - 1;
//                     const isNext = !event.completed && timeline.slice(0, index).every(e => e.completed);
                    
//                     return (
//                       <div key={event.id} className="relative group">
//                         {/* Timeline Line */}
//                         {!isLast && (
//                           <div 
//                             className={`absolute left-6 top-10 w-0.5 h-8 ${
//                               event.completed ? "bg-blue-500" : "bg-gray-700"
//                             }`}
//                           />
//                         )}
                        
//                         {/* Timeline Item Card */}
//                         <div className="bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700 rounded-xl p-4 transition-colors">
//                           <div className="flex items-start gap-4">
//                             <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
//                               event.completed 
//                                 ? "bg-blue-500/90 border-blue-500 text-white" 
//                                 : isNext
//                                 ? "bg-gray-800 border-purple-500 text-purple-500"
//                                 : "bg-gray-800 border-gray-600 text-gray-400"
//                             }`}>
//                               {getEventIcon(event.event_type, event.completed, isNext)}
//                             </div>
                            
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center justify-between mb-1">
//                                 <h4 className={`font-medium ${
//                                   event.completed 
//                                     ? "text-white" 
//                                     : isNext
//                                     ? "text-purple-400"
//                                     : "text-gray-300"
//                                 }`}>
//                                   {event.title}
//                                 </h4>
//                                 <span className="text-xs text-gray-500">
//                                   {dayjs(event.date).format('MMM D, YYYY')}
//                                 </span>
//                               </div>
                              
//                               {event.description && (
//                                 <p className={`text-sm ${
//                                   event.completed 
//                                     ? "text-gray-400" 
//                                     : isNext
//                                     ? "text-gray-300"
//                                     : "text-gray-500"
//                                 }`}>
//                                   {event.description}
//                                 </p>
//                               )}

//                               {/* Action Buttons */}
//                               <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                 <button
//                                   onClick={() => handleEditEvent(event)}
//                                   className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300"
//                                 >
//                                   <FiEdit className="w-4 h-4" />
//                                   Edit
//                                 </button>
//                                 <button
//                                   onClick={() => {
//                                     setEventToDelete(event.id);
//                                     setDeleteConfirmOpen(true);
//                                   }}
//                                   className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300"
//                                 >
//                                   <FiTrash2 className="w-4 h-4" />
//                                   Delete
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Timeline Event Dialog */}
//       {timelineDialogOpen && (
//         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
//           <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md">
//             <div className="p-6 border-b border-gray-700">
//               <h3 className="text-xl font-semibold text-white">
//                 {editingEvent ? 'Edit Timeline Event' : 'Add Timeline Event'}
//               </h3>
//             </div>
            
//             <div className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm text-gray-400 mb-2">Event Type</label>
//                 <select
//                   value={newEvent.event_type}
//                   onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value as TimelineEvent['event_type'] })}
//                   className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 >
//                   <option value="note">Note</option>
//                   <option value="applied">Applied</option>
//                   <option value="interview">Interview</option>
//                   <option value="follow_up">Follow Up</option>
//                   <option value="offer">Offer</option>
//                   <option value="rejected">Rejected</option>
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm text-gray-400 mb-2">Title*</label>
//                 <input
//                   value={newEvent.title}
//                   onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
//                   className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   placeholder="Event title"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm text-gray-400 mb-2">Description</label>
//                 <textarea
//                   value={newEvent.description}
//                   onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
//                   className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px]"
//                   placeholder="Event details..."
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm text-gray-400 mb-2">Date</label>
//                 <LocalizationProvider dateAdapter={AdapterDayjs}>
//                   <DatePicker
//                     value={dayjs(newEvent.date)}
//                     onChange={(date) => setNewEvent({ ...newEvent, date: date?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD') })}
//                     slotProps={{
//                       textField: {
//                         className: 'w-full',
//                         InputProps: {
//                           className: 'bg-gray-800/50 border-gray-700 text-white'
//                         }
//                       }
//                     }}
//                   />
//                 </LocalizationProvider>
//               </div>
              
//               <div className="flex items-center gap-3">
//                 <input
//                   type="checkbox"
//                   id="completed"
//                   checked={newEvent.completed}
//                   onChange={(e) => setNewEvent({ ...newEvent, completed: e.target.checked })}
//                   className="w-5 h-5 rounded bg-gray-800/50 border-gray-700 text-purple-500 focus:ring-purple-500"
//                 />
//                 <label htmlFor="completed" className="text-sm text-gray-400">
//                   Mark as completed
//                 </label>
//               </div>
//             </div>
            
//             <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
//               <button
//                 onClick={resetTimelineForm}
//                 className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={editingEvent ? handleUpdateTimelineEvent : handleAddTimelineEvent}
//                 disabled={!newEvent.title.trim() || timelineProcessing}
//                 className={`px-4 py-2 rounded-xl text-white transition-colors ${
//                   !newEvent.title.trim() || timelineProcessing
//                     ? 'bg-gray-700 text-gray-400'
//                     : 'bg-purple-600 hover:bg-purple-700'
//                 }`}
//               >
//                 {timelineProcessing ? (
//                   <span className="flex items-center gap-2">
//                     <FiLoader className="animate-spin" />
//                     {editingEvent ? 'Updating...' : 'Adding...'}
//                   </span>
//                 ) : editingEvent ? (
//                   'Update Event'
//                 ) : (
//                   'Add Event'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Dialog */}
//       {deleteConfirmOpen && (
//         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
//           <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md">
//             <div className="p-6 border-b border-gray-700">
//               <h3 className="text-xl font-semibold text-white">Delete Event</h3>
//             </div>
            
//             <div className="p-6">
//               <p className="text-gray-300 mb-6">Are you sure you want to delete this timeline event? This action cannot be undone.</p>
              
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setDeleteConfirmOpen(false)}
//                   className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDeleteEvent}
//                   disabled={timelineProcessing}
//                   className={`px-4 py-2 rounded-xl text-white transition-colors ${
//                     timelineProcessing
//                       ? 'bg-gray-700 text-gray-400'
//                       : 'bg-red-600 hover:bg-red-700'
//                   }`}
//                 >
//                   {timelineProcessing ? (
//                     <span className="flex items-center gap-2">
//                       <FiLoader className="animate-spin" />
//                       Deleting...
//                     </span>
//                   ) : (
//                     <span className="flex items-center gap-2">
//                       <FiTrash2 />
//                       Delete
//                     </span>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* PDF Preview Dialog */}
//       {previewDialogOpen && application && (
//         <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
//           <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col">
//             <div className="p-4 border-b border-gray-700 flex justify-between items-center">
//               <h3 className="text-lg font-semibold text-white flex items-center gap-3">
//                 {previewType === 'resume' ? (
//                   <>
//                     <FiUser className="text-blue-400" />
//                     Resume Preview
//                   </>
//                 ) : (
//                   <>
//                     <FiFileText className="text-green-400" />
//                     Cover Letter Preview
//                   </>
//                 )}
//               </h3>
//               <div className="flex items-center gap-3">
//                 <a
//                   href={previewType === 'resume' ? application.resume_url : application.cover_letter_url}
//                   download
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-colors"
//                 >
//                   <FiDownload className="w-5 h-5" />
//                   Download
//                 </a>
//                 <button
//                   onClick={() => setPreviewDialogOpen(false)}
//                   className="p-2 rounded-full hover:bg-gray-700 transition-colors"
//                 >
//                   <FiX className="w-6 h-6 text-gray-400" />
//                 </button>
//               </div>
//             </div>
            
//             <div className="flex-1 overflow-hidden">
//               {(previewType === 'resume' && application.resume_url) || 
//                (previewType === 'cover_letter' && application.cover_letter_url) ? (
//                 <iframe
//                   src={previewType === 'resume' ? application.resume_url : application.cover_letter_url}
//                   className="w-full h-full border-0"
//                   title={previewType === 'resume' ? 'Resume Preview' : 'Cover Letter Preview'}
//                   onError={(e) => {
//                     console.error('PDF preview failed:', e);
//                     setError(`Failed to load ${previewType === 'resume' ? 'resume' : 'cover letter'} preview`);
//                   }}
//                 />
//               ) : (
//                 <div className="flex items-center justify-center h-full">
//                   <div className="text-center">
//                     <FiFileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
//                     <p className="text-gray-400 text-lg">No {previewType === 'resume' ? 'resume' : 'cover letter'} available</p>
//                     <p className="text-gray-600 text-sm mt-2">Upload a PDF to preview it here</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </Layout>
//   );
// };

// export default ApplicationDetails;


import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import Layout from '../../components/Layout';
import { applicationAPI, Application, TimelineEvent } from '../../lib/api';
import { 
  FiArrowLeft, 
  FiEdit, 
  FiSave, 
  FiX, 
  FiPlus, 
  FiLoader, 
  FiExternalLink, 
  FiCheckCircle, 
  FiCircle, 
  FiClock, 
  FiEye,
  FiDownload,
  FiFileText,
  FiUser,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiDollarSign,
  FiLink,
  FiBriefcase,
  FiAlertCircle,
  FiTrash2,
  FiMapPin
} from 'react-icons/fi';

const ApplicationDetails: React.FC = () => {
  const [application, setApplication] = useState<Application | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<Partial<Application>>({});
  const [editDate, setEditDate] = useState<Dayjs | null>(null);
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewType, setPreviewType] = useState<'resume' | 'cover_letter'>('resume');
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [newEvent, setNewEvent] = useState({
    event_type: 'note',
    title: '',
    description: '',
    date: dayjs().format('YYYY-MM-DD'),
    completed: false
  });
  const [expandedSection, setExpandedSection] = useState<string | null>('jobInfo');
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [timelineProcessing, setTimelineProcessing] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await applicationAPI.getById(Number(id));
      const appData = response.data;
      
      // Transform the data to handle both backend and frontend field names
      const transformedData = {
        ...appData,
        resume_url: appData.resume_url || appData.resume || '',  // Use resume_url if available, fallback to resume
        cover_letter_url: appData.cover_letter_url || appData.cover_letter || ''  // Use cover_letter_url if available, fallback to cover_letter
      };
      
      // Fetch timeline events
      const timelineResponse = await applicationAPI.getTimelineEvents(Number(id));
      
      // Merge the data
      const fullData = {
        ...transformedData,
        timeline: timelineResponse.data
      };
      
      setApplication(fullData);
      setEditData(fullData);
      setEditDate(dayjs(fullData.application_date));
      setTimeline(fullData.timeline || []);
      
    } catch (err: any) {
      console.error('Error fetching application:', err);
      setError(err.message || 'Failed to fetch application');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditData(application || {});
    setEditDate(dayjs(application?.application_date));
  };

  const handleSave = async () => {
    if (!application) return;
    try {
      setSaving(true);
      const updateData = {
        ...editData,
        application_date: editDate?.format('YYYY-MM-DD'),
      };
      await applicationAPI.update(application.id, updateData);
      await fetchApplication();
      setEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update application');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!application) return;
    try {
      setDownloadingPDF(true);
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text('Job Application Details', 20, 30);
      
      doc.setFontSize(16);
      doc.text('Job Information', 20, 50);
      doc.setFontSize(12);
      doc.text(`Job Title: ${application.job_title}`, 20, 65);
      doc.text(`Company: ${application.company_name}`, 20, 75);
      doc.text(`Location: ${application.location || 'Not specified'}`, 20, 85);
      doc.text(`Salary Range: ${application.salary_range || 'Not specified'}`, 20, 95);
      doc.text(`Application Date: ${dayjs(application.application_date).format('MMMM D, YYYY')}`, 20, 105);
      doc.text(`Status: ${application.status}`, 20, 115);
      
      if (application.notes) {
        doc.text('Notes:', 20, 130);
        const splitNotes = doc.splitTextToSize(application.notes, 170);
        doc.text(splitNotes, 20, 140);
      }
      
      doc.save(`${application.job_title}_${application.company_name}_Application.pdf`);
    } catch (err: any) {
      setError(err.message || 'Failed to download PDF');
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData(application || {});
    setEditDate(dayjs(application?.application_date));
  };

  const handleAddTimelineEvent = async () => {
    if (!application || !newEvent.title.trim()) return;
    try {
      setTimelineProcessing(true);
      const response = await applicationAPI.addTimelineEvent(application.id, {
        ...newEvent,
        date: dayjs(newEvent.date).format('YYYY-MM-DD')
      });
      
      setTimeline(prev => [response.data, ...prev]);
      resetTimelineForm();
    } catch (err: any) {
      setError(err.message || 'Failed to add timeline event');
    } finally {
      setTimelineProcessing(false);
    }
  };

  const handleEditEvent = (event: TimelineEvent) => {
    setEditingEvent(event);
    setNewEvent({
      event_type: event.event_type,
      title: event.title,
      description: event.description || '',
      date: event.date,
      completed: event.completed
    });
    setTimelineDialogOpen(true);
  };

  const handleUpdateTimelineEvent = async () => {
    if (!application || !editingEvent || !newEvent.title.trim()) return;
    try {
      setTimelineProcessing(true);
      const response = await applicationAPI.updateTimelineEvent(
        application.id,
        editingEvent.id,
        {
          ...newEvent,
          date: dayjs(newEvent.date).format('YYYY-MM-DD')
        }
      );

      setTimeline(prev => 
        prev.map(event => 
          event.id === editingEvent.id ? response.data : event
        )
      );
      resetTimelineForm();
    } catch (err: any) {
      setError(err.message || 'Failed to update event');
    } finally {
      setTimelineProcessing(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!application || !eventToDelete) return;
    try {
      setTimelineProcessing(true);
      await applicationAPI.deleteTimelineEvent(application.id, eventToDelete);
      setTimeline(prev => prev.filter(event => event.id !== eventToDelete));
      setDeleteConfirmOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to delete event');
    } finally {
      setTimelineProcessing(false);
    }
  };

  const resetTimelineForm = () => {
    setNewEvent({
      event_type: 'note',
      title: '',
      description: '',
      date: dayjs().format('YYYY-MM-DD'),
      completed: false
    });
    setEditingEvent(null);
    setTimelineDialogOpen(false);
  };

  const handlePreview = (type: 'resume' | 'cover_letter') => {
    setPreviewType(type);
    setPreviewDialogOpen(true);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'interview': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'offer': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'withdrawn': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-400/20 text-gray-400 border-gray-400/30';
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'applied': return 'from-blue-500/10 to-blue-700/10';
      case 'interview': return 'from-purple-500/10 to-purple-700/10';
      case 'offer': return 'from-green-500/10 to-green-700/10';
      case 'rejected': return 'from-red-500/10 to-red-700/10';
      case 'withdrawn': return 'from-gray-500/10 to-gray-700/10';
      default: return 'from-gray-400/10 to-gray-600/10';
    }
  };

  const getEventIcon = (eventType: string, isCompleted: boolean, isNext: boolean) => {
    const iconClass = "h-5 w-5";
    if (isCompleted) return <FiCheckCircle className={iconClass} />;
    if (isNext) return <FiClock className={`${iconClass} animate-pulse`} />;
    return <FiCircle className={iconClass} />;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (error || !application) {
    return (
      <Layout>
        <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-xl mb-6 flex items-center gap-2">
          <FiAlertCircle className="w-5 h-5" />
          {error || 'Application not found'}
        </div>
        <button
          onClick={() => router.push('/pipeline')}
          className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-xl transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back to Pipeline
        </button>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/pipeline')}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <FiArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{application.job_title}</h1>
              <p className="text-lg text-purple-200">{application.company_name}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                downloadingPDF 
                  ? 'bg-gray-700 text-gray-400' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
              }`}
            >
              {downloadingPDF ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiDownload className="w-5 h-5" />}
              Export
            </button>
            
            {!editing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
              >
                <FiEdit className="w-5 h-5" />
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl text-white transition-colors"
                >
                  {saving ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiSave className="w-5 h-5" />}
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition-colors"
                >
                  <FiX className="w-5 h-5" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-4 mb-8">
          <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium ${getStatusColor(application.status)}`}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span>
          {application.location && (
            <div className="flex items-center gap-2 text-gray-400">
              <FiMapPin className="w-4 h-4" />
              <span>{application.location}</span>
            </div>
          )}
          {application.salary_range && (
            <div className="flex items-center gap-2 text-gray-400">
              <FiDollarSign className="w-4 h-4" />
              <span>{application.salary_range}</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Job Info and Documents */}
          <div className="lg:col-span-3 space-y-6">
            {/* Collapsible Job Information Section */}
            <div className={`bg-gradient-to-br ${getStatusGradient(application.status)} rounded-2xl border border-white/10 overflow-hidden transition-all duration-300`}>
              <div 
                className="flex justify-between items-center p-6 cursor-pointer"
                onClick={() => toggleSection('jobInfo')}
              >
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <FiBriefcase className="text-purple-400" />
                  Job Information
                </h2>
                {expandedSection === 'jobInfo' ? (
                  <FiChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              {expandedSection === 'jobInfo' && (
                <div className="px-6 pb-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Job Title</label>
                      {editing ? (
                        <input
                          value={editData.job_title || ''}
                          onChange={(e) => setEditData({ ...editData, job_title: e.target.value })}
                          className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-lg font-medium text-white">{application.job_title}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Company</label>
                      {editing ? (
                        <input
                          value={editData.company_name || ''}
                          onChange={(e) => setEditData({ ...editData, company_name: e.target.value })}
                          className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-lg font-medium text-white">{application.company_name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Application Date</label>
                      {editing ? (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            value={editDate}
                            onChange={(newValue) => setEditDate(newValue)}
                            slotProps={{
                              textField: {
                                className: 'w-full',
                                InputProps: {
                                  className: 'bg-gray-800/50 border-gray-700 text-white'
                                }
                              }
                            }}
                          />
                        </LocalizationProvider>
                      ) : (
                        <div className="flex items-center gap-2 text-white">
                          <FiCalendar className="w-5 h-5 text-purple-400" />
                          <span>{dayjs(application.application_date).format('MMMM D, YYYY')}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Status</label>
                      {editing ? (
                        <select
                          value={editData.status || ''}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value as Application['status'] })}
                          className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="saved">Saved</option>
                          <option value="applied">Applied</option>
                          <option value="interview">Interview</option>
                          <option value="offer">Offer</option>
                          <option value="rejected">Rejected</option>
                          <option value="withdrawn">Withdrawn</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium ${getStatusColor(application.status)}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      )}
                    </div>
                    
                    {application.job_posting_url && (
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-400 mb-2">Job Posting</label>
                        {editing ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={editData.job_posting_url || ''}
                              onChange={(e) => setEditData({ ...editData, job_posting_url: e.target.value })}
                              className="flex-1 p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              type="url"
                              placeholder="https://example.com/job-posting"
                            />
                          </div>
                        ) : (
                          <a
                            href={application.job_posting_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
                          >
                            <FiExternalLink className="w-5 h-5" />
                            <span>View Job Posting</span>
                          </a>
                        )}
                      </div>
                    )}
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-400 mb-2">Notes</label>
                      {editing ? (
                        <textarea
                          value={editData.notes || ''}
                          onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                          className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[120px]"
                          placeholder="Add notes about this application..."
                        />
                      ) : (
                        <div className="bg-gray-800/30 p-4 rounded-xl">
                          <p className="text-gray-300 whitespace-pre-wrap">
                            {application.notes || 'No notes added'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Documents Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resume Card */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-3">
                      <FiUser className="text-blue-400" />
                      Resume
                    </h3>
                    {application.resume_url && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePreview('resume')}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-xl transition-colors"
                        >
                          <FiEye className="w-4 h-4" />
                          Preview
                        </button>
                        <a
                          href={application.resume_url}
                          download
                          className="flex items-center gap-2 px-3 py-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded-xl transition-colors"
                        >
                          <FiDownload className="w-4 h-4" />
                          Download
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  {editing ? (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Resume File URL</label>
                      <div className="flex items-center gap-2">
                        <FiLink className="text-gray-500" />
                        <input
                          type="url"
                          value={editData.resume_url || ''}
                          onChange={(e) => setEditData({ ...editData, resume_url: e.target.value })}
                          className="flex-1 p-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="https://example.com/resume.pdf"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-900/30 rounded-xl p-4 min-h-[200px] flex flex-col">
                      {application.resume_url ? (
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                            <FiFileText className="w-12 h-12 text-blue-400" />
                            <div>
                              <p className="text-white font-medium text-lg">Resume PDF</p>
                              <p className="text-gray-400 text-sm">Click preview to view the document</p>
                              <p className="text-gray-500 text-xs mt-1">
                                {application.resume_url.split('/').pop() || 'resume.pdf'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center text-gray-500 h-full">
                          <div className="text-center py-8">
                            <FiUser className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                            <p className="text-gray-400">No resume uploaded</p>
                            <p className="text-gray-600 text-sm">Upload a resume to see it here</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Letter Card */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-3">
                      <FiFileText className="text-green-400" />
                      Cover Letter
                    </h3>
                    {application.cover_letter_url && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePreview('cover_letter')}
                          className="flex items-center gap-2 px-3 py-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded-xl transition-colors"
                        >
                          <FiEye className="w-4 h-4" />
                          Preview
                        </button>
                        <a
                          href={application.cover_letter_url}
                          download
                          className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-xl transition-colors"
                        >
                          <FiDownload className="w-4 h-4" />
                          Download
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  {editing ? (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Cover Letter File URL</label>
                      <div className="flex items-center gap-2">
                        <FiLink className="text-gray-500" />
                        <input
                          type="url"
                          value={editData.cover_letter_url || ''}
                          onChange={(e) => setEditData({ ...editData, cover_letter_url: e.target.value })}
                          className="flex-1 p-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          placeholder="https://example.com/cover-letter.pdf"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-900/30 rounded-xl p-4 min-h-[200px] flex flex-col">
                      {application.cover_letter_url ? (
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                            <FiFileText className="w-12 h-12 text-green-400" />
                            <div>
                              <p className="text-white font-medium text-lg">Cover Letter PDF</p>
                              <p className="text-gray-400 text-sm">Click preview to view the document</p>
                              <p className="text-gray-500 text-xs mt-1">
                                {application.cover_letter_url.split('/').pop() || 'cover-letter.pdf'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center text-gray-50 h-full">
                          <div className="text-center py-8">
                            <FiFileText className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                            <p className="text-gray-400">No cover letter uploaded</p>
                            <p className="text-gray-600 text-sm">Upload a cover letter to see it here</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Timeline */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <FiClock className="text-purple-400 w-6 h-6" />
                  Timeline
                </h2>
                <button
                  onClick={() => {
                    resetTimelineForm();
                    setTimelineDialogOpen(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-white transition-colors text-sm"
                >
                  <FiPlus className="w-5 h-5" />
                  Add Event
                </button>
              </div>

              {timeline.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
                    <FiClock className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500">No timeline events yet</p>
                  <p className="text-gray-600 text-sm mt-1">Track your application progress</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {timeline.map((event, index) => {
                    const isLast = index === timeline.length - 1;
                    const isNext = !event.completed && timeline.slice(0, index).every(e => e.completed);
                    
                    return (
                      <div key={event.id} className="relative group">
                        {/* Timeline Line */}
                        {!isLast && (
                          <div 
                            className={`absolute left-6 top-10 w-0.5 h-8 ${
                              event.completed ? "bg-blue-500" : "bg-gray-700"
                            }`}
                          />
                        )}
                        
                        {/* Timeline Item Card */}
                        <div className="bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700 rounded-xl p-4 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                              event.completed 
                                ? "bg-blue-500/90 border-blue-500 text-white" 
                                : isNext
                                ? "bg-gray-800 border-purple-500 text-purple-500"
                                : "bg-gray-800 border-gray-600 text-gray-400"
                            }`}>
                              {getEventIcon(event.event_type, event.completed, isNext)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className={`font-medium ${
                                  event.completed 
                                    ? "text-white" 
                                    : isNext
                                    ? "text-purple-400"
                                    : "text-gray-300"
                                }`}>
                                  {event.title}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {dayjs(event.date).format('MMM D, YYYY')}
                                </span>
                              </div>
                              
                              {event.description && (
                                <p className={`text-sm ${
                                  event.completed 
                                    ? "text-gray-400" 
                                    : isNext
                                    ? "text-gray-300"
                                    : "text-gray-500"
                                }`}>
                                  {event.description}
                                </p>
                              )}

                              {/* Action Buttons */}
                              <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleEditEvent(event)}
                                  className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300"
                                >
                                  <FiEdit className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setEventToDelete(event.id);
                                    setDeleteConfirmOpen(true);
                                  }}
                                  className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Event Dialog */}
      {timelineDialogOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">
                {editingEvent ? 'Edit Timeline Event' : 'Add Timeline Event'}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Event Type</label>
                <select
                  value={newEvent.event_type}
                  onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value as TimelineEvent['event_type'] })}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="note">Note</option>
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="follow_up">Follow Up</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Title*</label>
                <input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Event title"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px]"
                  placeholder="Event details..."
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Date</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dayjs(newEvent.date)}
                    onChange={(date) => setNewEvent({ ...newEvent, date: date?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD') })}
                    slotProps={{
                      textField: {
                        className: 'w-full',
                        InputProps: {
                          className: 'bg-gray-800/50 border-gray-700 text-white'
                        }
                      }
                    }}
                  />
                </LocalizationProvider>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="completed"
                  checked={newEvent.completed}
                  onChange={(e) => setNewEvent({ ...newEvent, completed: e.target.checked })}
                  className="w-5 h-5 rounded bg-gray-800/50 border-gray-700 text-purple-500 focus:ring-purple-500"
                />
                <label htmlFor="completed" className="text-sm text-gray-400">
                  Mark as completed
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={resetTimelineForm}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingEvent ? handleUpdateTimelineEvent : handleAddTimelineEvent}
                disabled={!newEvent.title.trim() || timelineProcessing}
                className={`px-4 py-2 rounded-xl text-white transition-colors ${
                  !newEvent.title.trim() || timelineProcessing
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {timelineProcessing ? (
                  <span className="flex items-center gap-2">
                    <FiLoader className="animate-spin" />
                    {editingEvent ? 'Updating...' : 'Adding...'}
                  </span>
                ) : editingEvent ? (
                  'Update Event'
                ) : (
                  'Add Event'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">Delete Event</h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-300 mb-6">Are you sure you want to delete this timeline event? This action cannot be undone.</p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEvent}
                  disabled={timelineProcessing}
                  className={`px-4 py-2 rounded-xl text-white transition-colors ${
                    timelineProcessing
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {timelineProcessing ? (
                    <span className="flex items-center gap-2">
                      <FiLoader className="animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FiTrash2 />
                      Delete
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Dialog */}
      {previewDialogOpen && application && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white flex items-center gap-3">
                {previewType === 'resume' ? (
                  <>
                    <FiUser className="text-blue-400" />
                    Resume Preview
                  </>
                ) : (
                  <>
                    <FiFileText className="text-green-400" />
                    Cover Letter Preview
                  </>
                )}
              </h3>
              <div className="flex items-center gap-3">
                <a
                  href={previewType === 'resume' ? application.resume_url : application.cover_letter_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-colors"
                >
                  <FiDownload className="w-5 h-5" />
                  Download
                </a>
                <button
                  onClick={() => setPreviewDialogOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <FiX className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              {(previewType === 'resume' && application.resume_url) || 
               (previewType === 'cover_letter' && application.cover_letter_url) ? (
                <iframe
                  src={previewType === 'resume' ? application.resume_url : application.cover_letter_url}
                  className="w-full h-full border-0"
                  title={previewType === 'resume' ? 'Resume Preview' : 'Cover Letter Preview'}
                  onError={(e) => {
                    console.error('PDF preview failed:', e);
                    setError(`Failed to load ${previewType === 'resume' ? 'resume' : 'cover letter'} preview`);
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FiFileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400 text-lg">No {previewType === 'resume' ? 'resume' : 'cover letter'} available</p>
                    <p className="text-gray-600 text-sm mt-2">Upload a PDF to preview it here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ApplicationDetails;