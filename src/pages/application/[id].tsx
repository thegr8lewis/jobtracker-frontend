// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs, { Dayjs } from 'dayjs';
// import Layout from '../../components/Layout';
// import { applicationAPI, Application, TimelineEvent, EmailLog } from '../../lib/api';
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
//   FiDownload,
//   FiUser,
//   FiChevronDown,
//   FiChevronUp,
//   FiCalendar,
//   FiDollarSign,
//   FiLink,
//   FiBriefcase,
//   FiAlertCircle,
//   FiTrash2,
//   FiMapPin,
//   FiMoreVertical,
//   FiMail,
//   FiRefreshCw,
//   FiInfo,
//   FiSettings
// } from 'react-icons/fi';

// const ApplicationDetails: React.FC = () => {
//   const [application, setApplication] = useState<Application | null>(null);
//   const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
//   const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [editData, setEditData] = useState<Partial<Application>>({});
//   const [editDate, setEditDate] = useState<Dayjs | null>(null);
//   const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
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
//   const [showEmailLogs, setShowEmailLogs] = useState(false);
//   const [processingEmails, setProcessingEmails] = useState(false);
//   const router = useRouter();
//   const { id } = router.query;

//   useEffect(() => {
//     if (id) {
//       fetchApplication();
//       fetchEmailLogs();
//     }
//   }, [id]);

//   const fetchApplication = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await applicationAPI.getById(Number(id));
//       const appData = response.data;
      
//       const transformedData = {
//         ...appData,
//         resume_url: appData.resume_url || appData.resume || '',
//         cover_letter_url: appData.cover_letter_url || appData.cover_letter || ''
//       };
      
//       const timelineResponse = await applicationAPI.getTimelineEvents(Number(id));
      
//       const fullData = {
//         ...transformedData,
//         timeline: timelineResponse.data
//       };
      
//       setApplication(fullData);
//       setEditData(fullData);
//       setEditDate(dayjs(fullData.application_date));
//       setTimeline(fullData.timeline || []);
      
//     } catch (err: any) {
//       console.error('Error fetching application:', err);
//       setError(err.message || 'Failed to fetch application');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchEmailLogs = async () => {
//     if (!id) return;
    
//     try {
//       console.log('Fetching email logs for application ID:', id);
//       const response = await applicationAPI.getEmailLogs(Number(id));
//       console.log('Email logs response:', response);
      
//       setEmailLogs(response.data || []);
//     } catch (err: any) {
//       console.error('Error fetching email logs:', err);
//       setEmailLogs([]);
//     }
//   };

//   const processEmailsForApplication = async () => {
//     if (!application) return;
    
//     setProcessingEmails(true);
//     try {
//       await applicationAPI.processEmails();
//       await fetchEmailLogs();
//       await fetchApplication();
//     } catch (err: any) {
//       setError(err.message || 'Failed to process emails');
//     } finally {
//       setProcessingEmails(false);
//     }
//   };

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

//   const getEmailClassificationColor = (classification: string) => {
//     switch (classification) {
//       case 'INTERVIEW': return 'bg-purple-500/20 text-purple-400';
//       case 'OFFER': return 'bg-green-500/20 text-green-400';
//       case 'REJECTION': return 'bg-red-500/20 text-red-400';
//       case 'FOLLOW_UP': return 'bg-blue-500/20 text-blue-400';
//       case 'APPLICATION_RECEIVED': return 'bg-yellow-500/20 text-yellow-400';
//       default: return 'bg-gray-500/20 text-gray-400';
//     }
//   };

//   const getEventTypeColor = (eventType: string) => {
//     switch (eventType) {
//       case 'applied': return 'text-blue-400';
//       case 'interview': return 'text-purple-400';
//       case 'follow_up': return 'text-yellow-400';
//       case 'offer': return 'text-green-400';
//       case 'rejected': return 'text-red-400';
//       default: return 'text-gray-400';
//     }
//   };

//   const getEventTypeLabel = (eventType: string) => {
//     return eventType.charAt(0).toUpperCase() + eventType.slice(1).replace('_', ' ');
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
//       <div className="max-w-6xl mx-auto px-4 py-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => router.push('/pipeline')}
//               className="p-2 rounded-xl hover:bg-white/10 transition-colors"
//             >
//               <FiArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
//             </button>
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{application.job_title}</h1>
//               <div className="flex flex-wrap items-center gap-2 md:gap-4 text-gray-300 text-sm md:text-base">
//                 <span className="text-base md:text-lg">{application.company_name}</span>
//                 {application.location && (
//                   <>
//                     <span className="hidden md:block w-1 h-1 bg-gray-500 rounded-full"></span>
//                     <div className="flex items-center gap-1">
//                       <FiMapPin className="w-3 h-3 md:w-4 md:h-4" />
//                       <span>{application.location}</span>
//                     </div>
//                   </>
//                 )}
//                 {application.salary_range && (
//                   <>
//                     <span className="hidden md:block w-1 h-1 bg-gray-500 rounded-full"></span>
//                     <div className="flex items-center gap-1">
//                       <FiDollarSign className="w-3 h-3 md:w-4 md:h-4" />
//                       <span>{application.salary_range}</span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <span className={`inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium border ${getStatusColor(application.status)}`}>
//               {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
//             </span>
            
//             <div className="flex gap-2">
//               <button
//                 onClick={handleDownloadPDF}
//                 disabled={downloadingPDF}
//                 className="p-2 md:p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700 text-white transition-colors"
//                 title="Export PDF"
//               >
//                 {downloadingPDF ? <FiLoader className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <FiDownload className="w-4 h-4 md:w-5 md:h-5" />}
//               </button>
              
//               {!editing ? (
//                 <button
//                   onClick={handleEdit}
//                   className="p-2 md:p-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors"
//                   title="Edit Application"
//                 >
//                   <FiEdit className="w-4 h-4 md:w-5 md:h-5" />
//                 </button>
//               ) : (
//                 <>
//                   <button
//                     onClick={handleSave}
//                     disabled={saving}
//                     className="p-2 md:p-3 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors"
//                     title="Save Changes"
//                   >
//                     {saving ? <FiLoader className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <FiSave className="w-4 h-4 md:w-5 md:h-5" />}
//                   </button>
//                   <button
//                     onClick={handleCancel}
//                     disabled={saving}
//                     className="p-2 md:p-3 rounded-xl bg-gray-600 hover:bg-gray-700 text-white transition-colors"
//                     title="Cancel"
//                   >
//                     <FiX className="w-4 h-4 md:w-5 md:h-5" />
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6 md:space-y-8">
//             {/* Application Details Card */}
//             <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl">
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl md:rounded-2xl flex items-center justify-center">
//                   <FiBriefcase className="text-purple-400 w-5 h-5 md:w-6 md:h-6" />
//                 </div>
//                 <div>
//                   <h2 className="text-xl md:text-2xl font-bold text-white">Application Details</h2>
//                   <p className="text-gray-400 text-xs md:text-sm">Manage your application information</p>
//                 </div>
//               </div>

//               <div className="space-y-6 md:space-y-8">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
//                   <div className="space-y-3">
//                     <label className="text-xs md:text-sm font-medium text-gray-300 tracking-wide">Job Title</label>
//                     {editing ? (
//                       <input
//                         value={editData.job_title || ''}
//                         onChange={(e) => setEditData({ ...editData, job_title: e.target.value })}
//                         className="w-full p-3 md:p-4 bg-gray-800/50 border border-gray-600/50 rounded-xl md:rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm md:text-base"
//                         placeholder="Enter job title"
//                       />
//                     ) : (
//                       <div className="bg-gray-800/30 px-4 py-3 rounded-xl md:rounded-2xl border border-gray-700/30">
//                         <p className="text-white font-semibold text-base md:text-lg">{application.job_title}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-3">
//                     <label className="text-xs md:text-sm font-medium text-gray-300 tracking-wide">Company</label>
//                     {editing ? (
//                       <input
//                         value={editData.company_name || ''}
//                         onChange={(e) => setEditData({ ...editData, company_name: e.target.value })}
//                         className="w-full p-3 md:p-4 bg-gray-800/50 border border-gray-600/50 rounded-xl md:rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm md:text-base"
//                         placeholder="Enter company name"
//                       />
//                     ) : (
//                       <div className="bg-gray-800/30 px-4 py-3 rounded-xl md:rounded-2xl border border-gray-700/30">
//                         <p className="text-white font-semibold text-base md:text-lg">{application.company_name}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-3">
//                     <label className="text-xs md:text-sm font-medium text-gray-300 tracking-wide">Application Date</label>
//                     {editing ? (
//                       <LocalizationProvider dateAdapter={AdapterDayjs}>
//                         <DatePicker
//                           value={editDate}
//                           onChange={(newValue) => setEditDate(newValue)}
//                           slotProps={{
//                             textField: {
//                               className: 'w-full',
//                               InputProps: {
//                                 className: 'bg-gray-800/50 border-gray-600/50 text-white rounded-xl md:rounded-2xl text-sm md:text-base'
//                               }
//                             }
//                           }}
//                         />
//                       </LocalizationProvider>
//                     ) : (
//                       <div className="bg-gray-800/30 px-4 py-3 rounded-xl md:rounded-2xl border border-gray-700/30">
//                         <div className="flex items-center gap-3 text-white">
//                           <div className="w-7 h-7 md:w-8 md:h-8 bg-purple-500/20 rounded-lg md:rounded-xl flex items-center justify-center">
//                             <FiCalendar className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
//                           </div>
//                           <span className="font-medium text-sm md:text-base">{dayjs(application.application_date).format('MMMM D, YYYY')}</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-3">
//                     <label className="text-xs md:text-sm font-medium text-gray-300 tracking-wide">Status</label>
//                     {editing ? (
//                       <select
//                         value={editData.status || ''}
//                         onChange={(e) => setEditData({ ...editData, status: e.target.value as Application['status'] })}
//                         className="w-full p-3 md:p-4 bg-gray-800/50 border border-gray-600/50 rounded-xl md:rounded-2xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm md:text-base"
//                       >
//                         <option value="saved">Saved</option>
//                         <option value="applied">Applied</option>
//                         <option value="interview">Interview</option>
//                         <option value="offer">Offer</option>
//                         <option value="rejected">Rejected</option>
//                         <option value="withdrawn">Withdrawn</option>
//                       </select>
//                     ) : (
//                       <div className="bg-gray-800/30 px-4 py-3 rounded-xl md:rounded-2xl border border-gray-700/30">
//                         <span className={`inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold border-2 ${getStatusColor(application.status)}`}>
//                           {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {(application.job_posting_url || editing) && (
//                   <div className="space-y-3 pt-4 border-t border-gray-700/30">
//                     <label className="text-xs md:text-sm font-medium text-gray-300 tracking-wide">Job Posting URL</label>
//                     {editing ? (
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
//                           <FiLink className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
//                         </div>
//                         <input
//                           value={editData.job_posting_url || ''}
//                           onChange={(e) => setEditData({ ...editData, job_posting_url: e.target.value })}
//                           className="flex-1 p-3 md:p-4 bg-gray-800/50 border border-gray-600/50 rounded-xl md:rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm md:text-base"
//                           type="url"
//                           placeholder="https://example.com/job-posting"
//                         />
//                       </div>
//                     ) : (
//                       <div className="bg-gray-800/30 px-4 py-3 rounded-xl md:rounded-2xl border border-gray-700/30">
//                         <a
//                           href={application.job_posting_url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="inline-flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors group"
//                         >
//                           <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-500/20 rounded-lg md:rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
//                             <FiExternalLink className="w-3 h-3 md:w-4 md:h-4" />
//                           </div>
//                           <span className="font-medium text-sm md:text-base">View Job Posting</span>
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Notes Section */}
//             <div className="bg-gradient-to-br from-slate-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl">
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl md:rounded-2xl flex items-center justify-center">
//                   <FiEdit className="text-amber-400 w-5 h-5 md:w-6 md:h-6" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl md:text-2xl font-bold text-white">Notes & Comments</h3>
//                   <p className="text-gray-400 text-xs md:text-sm">Additional information about this application</p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 {editing ? (
//                   <div className="space-y-3">
//                     <label className="text-xs md:text-sm font-medium text-gray-300 tracking-wide">Application Notes</label>
//                     <textarea
//                       value={editData.notes || ''}
//                       onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
//                       className="w-full p-4 md:p-6 bg-gray-800/50 border border-gray-600/50 rounded-xl md:rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200 min-h-[120px] md:min-h-[160px] resize-none text-sm md:text-base"
//                       placeholder="Add your thoughts, follow-up reminders, interview feedback, or any other relevant notes about this application..."
//                     />
//                     <p className="text-xs text-gray-500">Use this space to track your application progress and important details</p>
//                   </div>
//                 ) : (
//                   <div className="relative">
//                     {application.notes ? (
//                       <div className="bg-gradient-to-r from-gray-800/40 to-gray-700/20 border border-gray-600/30 rounded-xl md:rounded-2xl p-4 md:p-6">
//                         <div className="absolute top-3 md:top-4 left-3 md:left-4 w-1 h-6 md:h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
//                         <div className="pl-4 md:pl-6">
//                           <p className="text-gray-200 leading-relaxed whitespace-pre-wrap font-medium text-sm md:text-base">
//                             {application.notes}
//                           </p>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="bg-gray-800/20 border-2 border-dashed border-gray-600/40 rounded-xl md:rounded-2xl p-6 md:p-8 text-center">
//                         <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-700/30 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
//                           <FiEdit className="w-6 h-6 md:w-8 md:h-8 text-gray-500" />
//                         </div>
//                         <p className="text-gray-400 font-medium mb-1 md:mb-2 text-sm md:text-base">No notes added yet</p>
//                         <p className="text-gray-600 text-xs md:text-sm">Click edit to add notes about this application</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Timeline Sidebar */}
//           <div className="lg:col-span-1 space-y-6">
//             <div className="sticky top-6 space-y-6">
//               {/* Timeline Section */}
//               <div className="bg-gradient-to-br  backdrop-blur-sm  rounded-2xl p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-white font-semibold flex items-center gap-2">
//                     <FiClock className="text-purple-400 w-4 h-4" />
//                     Timeline
//                   </h3>
//                   <button
//                     onClick={() => {
//                       resetTimelineForm();
//                       setTimelineDialogOpen(true);
//                     }}
//                     className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors"
//                     title="Add Event"
//                   >
//                     <FiPlus className="w-4 h-4" />
//                   </button>
//                 </div>

//                 {timeline.length === 0 ? (
//                   <div className="text-center py-6">
//                     <div className="w-12 h-12 mx-auto mb-3 bg-purple-800/30 rounded-full flex items-center justify-center">
//                       <FiClock className="w-6 h-6 text-purple-400" />
//                     </div>
//                     <p className="text-purple-300 font-medium mb-1">No timeline events</p>
//                     <p className="text-purple-400/60 text-xs">Add events to track your progress</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-3 max-h-80 overflow-y-auto">
//                     {timeline.map((event, index) => {
//                       const isCompleted = event.completed;
//                       const isNext = !event.completed && timeline.slice(0, index).every(e => e.completed);
//                       const isLast = index === timeline.length - 1;
                      
//                       return (
//                         <div key={event.id} className="relative group">
//                           {!isLast && (
//                             <div className="absolute left-4 top-8 w-0.5 h-8 bg-purple-600/30"></div>
//                           )}

//                           <div className="flex items-start gap-3 py-2 px-2 rounded-xl hover:bg-purple-800/20 transition-colors">
//                             <div className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 flex-shrink-0 ${
//                               isCompleted 
//                                 ? "bg-purple-600 border-purple-500 text-white" 
//                                 : isNext
//                                 ? "bg-gray-800 border-purple-500 text-purple-400"
//                                 : "bg-gray-800 border-gray-600 text-gray-500"
//                             }`}>
//                               {isCompleted ? (
//                                 <FiCheckCircle className="w-3 h-3" />
//                               ) : isNext ? (
//                                 <FiClock className="w-3 h-3 animate-pulse" />
//                               ) : (
//                                 <FiCircle className="w-3 h-3" />
//                               )}
//                             </div>

//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center justify-between mb-1">
//                                 <div className="flex items-center gap-2">
//                                   <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wide font-medium ${getEventTypeColor(event.event_type)} bg-current/10`}>
//                                     {getEventTypeLabel(event.event_type)}
//                                   </span>
//                                   <span className="text-xs text-gray-500">
//                                     {dayjs(event.date).format('MMM D')}
//                                   </span>
//                                 </div>
                                
//                                 <button
//                                   className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-700 transition-all"
//                                   onClick={() => handleEditEvent(event)}
//                                 >
//                                   <FiMoreVertical className="w-3 h-3 text-gray-400" />
//                                 </button>
//                               </div>

//                               <h4 className={`font-medium text-sm mb-1 ${
//                                 isCompleted 
//                                   ? "text-white" 
//                                   : isNext
//                                   ? "text-purple-300"
//                                   : "text-gray-400"
//                               }`}>
//                                 {event.title}
//                               </h4>

//                               {event.description && (
//                                 <p className={`text-xs leading-relaxed ${
//                                   isCompleted 
//                                     ? "text-gray-300" 
//                                     : isNext
//                                     ? "text-gray-400"
//                                     : "text-gray-600"
//                                 }`}>
//                                   {event.description}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>

//               {/* Email Tracking Section */}
//               <div className="bg-gradient-to-br from-blue-900/80 to-blue-800/40 backdrop-blur-sm border border-blue-700/50 rounded-2xl p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-2">
//                     <FiMail className="text-blue-400 w-5 h-5" />
//                     <h3 className="text-white font-semibold">Email Tracking</h3>
//                   </div>
//                   <button
//                     onClick={() => setShowEmailLogs(!showEmailLogs)}
//                     className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
//                   >
//                     {showEmailLogs ? (
//                       <>
//                         <FiChevronUp className="w-4 h-4" />
//                         Hide
//                       </>
//                     ) : (
//                       <>
//                         <FiChevronDown className="w-4 h-4" />
//                         Show
//                       </>
//                     )}
//                   </button>
//                 </div>

//                 {/* Email Status Summary */}
//                 <div className="grid grid-cols-2 gap-4 mb-4">
//                   <div className="bg-blue-800/30 border border-blue-700/30 rounded-xl p-3 text-center">
//                     <div className="text-2xl font-bold text-blue-300">{emailLogs.length}</div>
//                     <div className="text-xs text-blue-400/80">Total Emails</div>
//                   </div>
//                   <div className="bg-blue-800/30 border border-blue-700/30 rounded-xl p-3 text-center">
//                     <div className="text-2xl font-bold text-blue-300">
//                       {emailLogs.filter(log => log.processed).length}
//                     </div>
//                     <div className="text-xs text-blue-400/80">Processed</div>
//                   </div>
//                 </div>

//                 <button
//                   onClick={processEmailsForApplication}
//                   disabled={processingEmails}
//                   className="w-full mb-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 
//                             text-white rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
//                 >
//                   {processingEmails ? (
//                     <FiLoader className="animate-spin w-4 h-4" />
//                   ) : (
//                     <FiRefreshCw className="w-4 h-4" />
//                   )}
//                   Check for New Emails
//                 </button>

//                 {showEmailLogs && (
//                   <div className="space-y-3 max-h-60 overflow-y-auto">
//                     {emailLogs.length === 0 ? (
//                       <div className="text-center py-6">
//                         <div className="w-16 h-16 mx-auto mb-4 bg-blue-800/30 rounded-full flex items-center justify-center">
//                           <FiMail className="w-8 h-8 text-blue-400" />
//                         </div>
                        
//                         <h4 className="text-blue-200 font-medium mb-2">No email logs yet</h4>
                        
//                         <p className="text-blue-300/70 text-sm mb-4 max-w-md mx-auto leading-relaxed">
//                           Connect your Gmail account to automatically track emails related to this application. 
//                           We'll scan for interview invites, offers, rejections, and other important communications.
//                         </p>

//                         <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                           <button
//                             onClick={() => router.push('/settings?tab=email')}
//                             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
//                                       text-sm transition-colors flex items-center gap-2"
//                           >
//                             <FiSettings className="w-4 h-4" />
//                             Connect Gmail
//                           </button>
                          
//                           <button
//                             onClick={processEmailsForApplication}
//                             disabled={processingEmails}
//                             className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700/50 
//                                       text-gray-300 rounded-lg text-sm transition-colors flex items-center gap-2"
//                           >
//                             {processingEmails ? (
//                               <FiLoader className="animate-spin w-4 h-4" />
//                             ) : (
//                               <FiRefreshCw className="w-4 h-4" />
//                             )}
//                             Try Manual Refresh
//                           </button>
//                         </div>

//                         <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
//                           <h5 className="text-blue-300 text-xs font-semibold mb-2 flex items-center gap-1">
//                             <FiInfo className="w-3 h-3" />
//                             How it works:
//                           </h5>
//                           <ul className="text-blue-300/60 text-xs space-y-1">
//                             <li className="flex items-start gap-2">
//                               <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
//                               <span>Connect your Gmail in Settings</span>
//                             </li>
//                             <li className="flex items-start gap-2">
//                               <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
//                               <span>We scan for emails from {application.company_name}</span>
//                             </li>
//                             <li className="flex items-start gap-2">
//                               <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
//                               <span>Automatically update application status</span>
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                     ) : (
//                       emailLogs.map((log) => (
//                         <div key={log.id} className="bg-blue-800/30 border border-blue-700/30 rounded-xl p-4">
//                           <div className="flex items-center justify-between mb-3">
//                             <span className={`text-xs px-2 py-1 rounded-full font-medium ${getEmailClassificationColor(log.classification || 'UNKNOWN')}`}>
//                               {log.classification || 'UNCLASSIFIED'}
//                             </span>
//                             <span className="text-xs text-blue-300/70">
//                               {log.received_date ? new Date(log.received_date).toLocaleDateString() : 'No date'}
//                             </span>
//                           </div>
                          
//                           <div className="mb-2">
//                             <p className="text-white text-sm font-medium mb-1 truncate">
//                               {log.subject || 'No subject'}
//                             </p>
//                             <p className="text-blue-300/80 text-xs truncate">
//                               From: {log.sender_email || 'Unknown sender'}
//                               {log.sender_name && ` (${log.sender_name})`}
//                             </p>
//                           </div>
                          
//                           {log.snippet && (
//                             <p className="text-blue-300/60 text-xs mb-3 line-clamp-2">
//                               {log.snippet}
//                             </p>
//                           )}
                          
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-2">
//                               <span className="text-xs text-blue-300/60">
//                                 Confidence: {Math.round((log.confidence_score || 0) * 100)}%
//                               </span>
//                             </div>
                            
//                             <div className="flex items-center gap-2">
//                               {log.processed && (
//                                 <span className="text-xs text-green-400 flex items-center gap-1">
//                                   <FiCheckCircle className="w-3 h-3" />
//                                   Processed
//                                 </span>
//                               )}
//                               {log.status_updated && (
//                                 <span className="text-xs text-green-400 flex items-center gap-1">
//                                   <FiCheckCircle className="w-3 h-3" />
//                                   Status Updated
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 )}

//                 <div className="mt-4 pt-4 border-t border-blue-700/30">
//                   <div className="flex items-center justify-between text-xs">
//                     <span className="text-blue-300/70">Last checked:</span>
//                     <span className="text-blue-300">
//                       {new Date().toLocaleTimeString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Timeline Event Dialog */}
//       {timelineDialogOpen && (
//         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
//           <div className="bg-gray-800 border border-gray-700 rounded-xl md:rounded-2xl w-full max-w-md mx-4">
//             <div className="p-4 md:p-6 border-b border-gray-700">
//               <h3 className="text-lg md:text-xl font-semibold text-white">
//                 {editingEvent ? 'Edit Timeline Event' : 'Add Timeline Event'}
//               </h3>
//             </div>
            
//             <div className="p-4 md:p-6 space-y-4">
//               <div>
//                 <label className="block text-xs md:text-sm text-gray-400 mb-2">Event Type</label>
//                 <select
//                   value={newEvent.event_type}
//                   onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value as TimelineEvent['event_type'] })}
//                   className="w-full p-2 md:p-3 bg-gray-800/50 border border-gray-700 rounded-lg md:rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
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
//                 <label className="block text-xs md:text-sm text-gray-400 mb-2">Title*</label>
//                 <input
//                   value={newEvent.title}
//                   onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
//                   className="w-full p-2 md:p-3 bg-gray-800/50 border border-gray-700 rounded-lg md:rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
//                   placeholder="Event title"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-xs md:text-sm text-gray-400 mb-2">Description</label>
//                 <textarea
//                   value={newEvent.description}
//                   onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
//                   className="w-full p-2 md:p-3 bg-gray-800/50 border border-gray-700 rounded-lg md:rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[80px] md:min-h-[100px] text-sm md:text-base"
//                   placeholder="Event details..."
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-xs md:text-sm text-gray-400 mb-2">Date</label>
//                 <LocalizationProvider dateAdapter={AdapterDayjs}>
//                   <DatePicker
//                     value={dayjs(newEvent.date)}
//                     onChange={(date) => setNewEvent({ ...newEvent, date: date?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD') })}
//                     slotProps={{
//                       textField: {
//                         className: 'w-full',
//                         InputProps: {
//                           className: 'bg-gray-800/50 border-gray-700 text-white text-sm md:text-base'
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
//                   className="w-4 h-4 md:w-5 md:h-5 rounded bg-gray-800/50 border-gray-700 text-purple-500 focus:ring-purple-500"
//                 />
//                 <label htmlFor="completed" className="text-xs md:text-sm text-gray-400">
//                   Mark as completed
//                 </label>
//               </div>
//             </div>
            
//             <div className="p-4 md:p-6 border-t border-gray-700 flex justify-end gap-3">
//               <button
//                 onClick={resetTimelineForm}
//                 className="px-3 py-2 md:px-4 md:py-2 bg-gray-700 hover:bg-gray-600 rounded-lg md:rounded-xl text-white transition-colors text-sm md:text-base"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={editingEvent ? handleUpdateTimelineEvent : handleAddTimelineEvent}
//                 disabled={!newEvent.title.trim() || timelineProcessing}
//                 className={`px-3 py-2 md:px-4 md:py-2 rounded-lg md:rounded-xl text-white transition-colors text-sm md:text-base ${
//                   !newEvent.title.trim() || timelineProcessing
//                     ? 'bg-gray-700 text-gray-400'
//                     : 'bg-purple-600 hover:bg-purple-700'
//                 }`}
//               >
//                 {timelineProcessing ? (
//                   <span className="flex items-center gap-2">
//                     <FiLoader className="animate-spin w-3 h-3 md:w-4 md:h-4" />
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
//           <div className="bg-gray-800 border border-gray-700 rounded-xl md:rounded-2xl w-full max-w-md mx-4">
//             <div className="p-4 md:p-6 border-b border-gray-700">
//               <h3 className="text-lg md:text-xl font-semibold text-white">Delete Event</h3>
//             </div>
            
//             <div className="p-4 md:p-6">
//               <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">Are you sure you want to delete this timeline event? This action cannot be undone.</p>
              
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setDeleteConfirmOpen(false)}
//                   className="px-3 py-2 md:px-4 md:py-2 bg-gray-700 hover:bg-gray-600 rounded-lg md:rounded-xl text-white transition-colors text-sm md:text-base"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDeleteEvent}
//                   disabled={timelineProcessing}
//                   className={`px-3 py-2 md:px-4 md:py-2 rounded-lg md:rounded-xl text-white transition-colors text-sm md:text-base ${
//                     timelineProcessing
//                       ? 'bg-gray-700 text-gray-400'
//                       : 'bg-red-600 hover:bg-red-700'
//                   }`}
//                 >
//                   {timelineProcessing ? (
//                     <span className="flex items-center gap-2">
//                       <FiLoader className="animate-spin w-3 h-3 md:w-4 md:h-4" />
//                       Deleting...
//                     </span>
//                   ) : (
//                     <span className="flex items-center gap-2">
//                       <FiTrash2 className="w-3 h-3 md:w-4 md:h-4" />
//                       Delete
//                     </span>
//                   )}
//                 </button>
//               </div>
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
import { applicationAPI, Application, TimelineEvent, EmailLog } from '../../lib/api';
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
  FiDownload,
  FiUser,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiDollarSign,
  FiLink,
  FiBriefcase,
  FiAlertCircle,
  FiTrash2,
  FiMapPin,
  FiMoreVertical,
  FiMail,
  FiRefreshCw,
  FiInfo,
  FiSettings,
  FiMaximize2,
  FiSearch,
  FiEye,
  FiEyeOff,
  FiAlertTriangle,
  FiFileText
} from 'react-icons/fi';

const ApplicationDetails: React.FC = () => {
  const [application, setApplication] = useState<Application | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<Partial<Application>>({});
  const [editDate, setEditDate] = useState<Dayjs | null>(null);
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
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
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEmailDetailModal, setShowEmailDetailModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);
  const [processingEmails, setProcessingEmails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassification, setFilterClassification] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [expandedEmailId, setExpandedEmailId] = useState<number | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchApplication();
      fetchEmailLogs();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await applicationAPI.getById(Number(id));
      const appData = response.data;
      
      const transformedData = {
        ...appData,
        resume_url: appData.resume_url || appData.resume || '',
        cover_letter_url: appData.cover_letter_url || appData.cover_letter || ''
      };
      
      const timelineResponse = await applicationAPI.getTimelineEvents(Number(id));
      
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

  const fetchEmailLogs = async () => {
    if (!id) return;
    
    try {
      console.log('Fetching email logs for application ID:', id);
      const response = await applicationAPI.getEmailLogs(Number(id));
      console.log('Email logs response:', response);
      
      setEmailLogs(response.data || []);
    } catch (err: any) {
      console.error('Error fetching email logs:', err);
      setEmailLogs([]);
    }
  };

  const processEmailsForApplication = async () => {
    if (!application) return;
    
    setProcessingEmails(true);
    try {
      await applicationAPI.processEmails();
      await fetchEmailLogs();
      await fetchApplication();
    } catch (err: any) {
      setError(err.message || 'Failed to process emails');
    } finally {
      setProcessingEmails(false);
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

  const getEmailClassificationColor = (classification: string) => {
    switch (classification) {
      case 'INTERVIEW': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'OFFER': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'REJECTION': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'FOLLOW_UP': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'APPLICATION_RECEIVED': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'applied': return 'text-blue-400';
      case 'interview': return 'text-purple-400';
      case 'follow_up': return 'text-yellow-400';
      case 'offer': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getEventTypeLabel = (eventType: string) => {
    return eventType.charAt(0).toUpperCase() + eventType.slice(1).replace('_', ' ');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatConfidenceScore = (score?: number) => {
    if (!score) return 'N/A';
    let displayScore = score;
    if (score > 100) {
      displayScore = score / 100;
    }
    return `${Math.min(Math.round(displayScore), 100)}%`;
  };

  const toggleEmailExpansion = (emailId: number) => {
    setExpandedEmailId(expandedEmailId === emailId ? null : emailId);
    // Assuming no full content fetch needed for application logs
  };

  const openEmailDetails = (email: EmailLog) => {
    setSelectedEmail(email);
    setShowEmailDetailModal(true);
  };

  const filteredLogs = emailLogs.filter(log => {
    const matchesSearch =
      (log.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.sender_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.sender_email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterClassification === 'all' || log.classification === filterClassification;
    return matchesSearch && matchesFilter;
  });

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.received_date || '0').getTime() - new Date(a.received_date || '0').getTime();
      case 'sender':
        return (a.sender_name || '').localeCompare(b.sender_name || '');
      case 'subject':
        return (a.subject || '').localeCompare(b.subject || '');
      default:
        return 0;
    }
  });

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

  const EmailLogList = () => (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-64 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <select
            value={filterClassification}
            onChange={(e) => setFilterClassification(e.target.value)}
            className="px-4 py-2.5 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="all">All Classifications</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTION">Rejection</option>
            <option value="FOLLOW_UP">Follow Up</option>
            <option value="APPLICATION_RECEIVED">Application Received</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="date">Sort by Date</option>
            <option value="sender">Sort by Sender</option>
            <option value="subject">Sort by Subject</option>
          </select>
        </div>
        <div className="flex gap-4 text-sm text-gray-400">
          <span>Total: {emailLogs.length}</span>
          <span>Filtered: {sortedLogs.length}</span>
        </div>
      </div>
      {sortedLogs.length === 0 ? (
        <div className="text-center py-8">
          <FiMail className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            {emailLogs.length === 0 ? 'No email logs available yet.' : 'No emails match your search criteria.'}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Try syncing your emails or check back later for updates.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 bg-gray-900/40 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {(log.sender_name || '').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-300 truncate">{log.sender_name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500 truncate">{log.sender_email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {log.classification && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getEmailClassificationColor(log.classification)}`}>
                      {log.classification}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FiClock className="w-3 h-3" />
                    {formatDate(log.received_date)}
                  </div>
                  <button
                    onClick={() => openEmailDetails(log)}
                    className="p-1.5 hover:bg-gray-800/50 rounded-lg transition-colors"
                    title="View detailed email"
                  >
                    <FiMaximize2 className="w-4 h-4 text-gray-400 hover:text-blue-400" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-medium text-sm line-clamp-2">{log.subject}</h4>
                {expandedEmailId === log.id ? (
                  <div className="text-gray-400 text-xs bg-gray-800/50 p-3 rounded-lg">
                    <p>{log.snippet || 'No snippet available'}</p>
                    <button
                      onClick={() => toggleEmailExpansion(log.id)}
                      className="mt-3 flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs"
                    >
                      <FiEyeOff className="w-3 h-3" />
                      Hide content
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-400 text-xs line-clamp-2">{log.snippet || 'No snippet'}</p>
                    <button
                      onClick={() => toggleEmailExpansion(log.id)}
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs"
                    >
                      <FiEye className="w-3 h-3" />
                      View snippet
                    </button>
                  </>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700/30 flex justify-between items-center">
                {log.confidence_score !== undefined && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FiAlertTriangle className="w-3 h-3" />
                    Confidence: {formatConfidenceScore(log.confidence_score)}
                  </div>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {log.processed && <span className="text-green-400">Processed</span>}
                  {log.status_updated && <span className="text-green-400">Status Updated</span>}
                  {log.timeline_created && <span className="text-green-400">Timeline Created</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const EmailDetailModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FiMail className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Email Details</h2>
              <p className="text-gray-400 text-sm">Detailed view of your email</p>
            </div>
          </div>
          <button
            onClick={() => setShowEmailDetailModal(false)}
            className="p-2 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {selectedEmail ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                  {(selectedEmail.sender_name || '').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{selectedEmail.sender_name || 'Unknown'}</p>
                  <p className="text-gray-400 text-sm">{selectedEmail.sender_email}</p>
                </div>
              </div>
              <div className="border-t border-gray-700/30 pt-4">
                <h3 className="text-white font-semibold text-lg">{selectedEmail.subject}</h3>
                <div className="flex items-center gap-4 mt-2">
                  {selectedEmail.classification && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getEmailClassificationColor(selectedEmail.classification)}`}>
                      {selectedEmail.classification}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <FiClock className="w-4 h-4" />
                    {formatDate(selectedEmail.received_date)}
                  </div>
                </div>
              </div>
              {selectedEmail.confidence_score !== undefined && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <FiAlertTriangle className="w-4 h-4" />
                  Confidence: {formatConfidenceScore(selectedEmail.confidence_score)}
                </div>
              )}
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg text-gray-300 text-sm">
                <p>{selectedEmail.snippet || 'No content available'}</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                {selectedEmail.processed && <span className="text-green-400 flex items-center gap-1"><FiCheckCircle className="w-4 h-4" /> Processed</span>}
                {selectedEmail.status_updated && <span className="text-green-400 flex items-center gap-1"><FiCheckCircle className="w-4 h-4" /> Status Updated</span>}
                {selectedEmail.timeline_created && <span className="text-green-400 flex items-center gap-1"><FiCheckCircle className="w-4 h-4" /> Timeline Created</span>}
                {selectedEmail.user_reviewed && <span className="text-green-400 flex items-center gap-1"><FiCheckCircle className="w-4 h-4" /> Reviewed</span>}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">No email selected</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/pipeline')}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{application.job_title}</h1>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-gray-300 text-sm md:text-base">
                <span className="text-base md:text-lg">{application.company_name}</span>
                {application.location && (
                  <>
                    <span className="hidden md:block w-1 h-1 bg-gray-500 rounded-full"></span>
                    <div className="flex items-center gap-1">
                      <FiMapPin className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{application.location}</span>
                    </div>
                  </>
                )}
                {application.salary_range && (
                  <>
                    <span className="hidden md:block w-1 h-1 bg-gray-500 rounded-full"></span>
                    <div className="flex items-center gap-1">
                      <FiDollarSign className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{application.salary_range}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium border ${getStatusColor(application.status)}`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                disabled={downloadingPDF}
                className="p-2 md:p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700 text-white transition-colors"
                title="Export PDF"
              >
                {downloadingPDF ? <FiLoader className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <FiDownload className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
              
              {!editing ? (
                <button
                  onClick={handleEdit}
                  className="p-2 md:p-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                  title="Edit Application"
                >
                  <FiEdit className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="p-2 md:p-3 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors"
                    title="Save Changes"
                  >
                    {saving ? <FiLoader className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <FiSave className="w-4 h-4 md:w-5 md:h-5" />}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="p-2 md:p-3 rounded-xl bg-gray-600 hover:bg-gray-700 text-white transition-colors"
                    title="Cancel"
                  >
                    <FiX className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Application Details Card */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                  <FiBriefcase className="text-purple-400 w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Application Details</h2>
                  <p className="text-gray-400 text-xs md:text-sm">Manage your application information</p>
                </div>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-3">
                    <label className="text-xs md:text-sm font-medium text-gray-300 tracking-wide">Job Title</label>
                    {editing ? (
                      <input
                        value={editData.job_title || ''}
                        onChange={(e) => setEditData({ ...editData, job_title: e.target.value })}
                        className="w-full p-3 md:p-4 bg-gray-800/50 border border-gray-600/50 rounded-xl md:rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm md:text-base"
                        placeholder="Enter job title"
                      />
                    ) : (
                      <div className="bg-gray-800/30 px-4 py-3 rounded-xl md:rounded-2xl border border-gray-700/30">
                        <p className="text-white font-semibold text-base md:text-lg">{application.job_title}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs md:text-sm font-medium text-gray-300 tracking-wide">Company</label>
                    {editing ? (
                      <input
                        value={editData.company_name || ''}
                        onChange={(e) => setEditData({ ...editData, company_name: e.target.value })}
                        className="w-full p-3 md:p-4 bg-gray-800/50 border border-gray-600/50 rounded-xl md:rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm md:text-base"
                        placeholder="Enter company name"
                      />
                    ) : (
                      <div className="bg-gray-800/30 px-4 py-3 rounded-xl md:rounded-2xl border border-gray-700/30">
                        <p className="text-white font-semibold text-base md:text-lg">{application.company_name}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs md:text-sm font-medium text-gray-300 tracking-wide">Application Date</label>
                    {editing ? (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={editDate}
                          onChange={(newValue) => setEditDate(newValue)}
                          slotProps={{
                            textField: {
                              className: 'w-full',
                              InputProps: {
                                className: 'bg-gray-800/50 border-gray-600/50 text-white rounded-xl md:rounded-2xl text-sm md:text-base'
                              }
                            }
                          }}
                        />
                      </LocalizationProvider>
                    ) : (
                      <div className="bg-gray-800/30 px-4 py-3 rounded-xl md:rounded-2xl border border-gray-700/30">
                        <div className="flex items-center gap-3 text-white">
                          <div className="w-7 h-7 md:w-8 md:h-8 bg-purple-500/20 rounded-lg md:rounded-xl flex items-center justify-center">
                            <FiCalendar className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
                          </div>
                          <span className="font-medium text-sm md:text-base">{dayjs(application.application_date).format('MMMM D, YYYY')}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs md:text-sm font-medium text-gray-300 tracking-wide">Status</label>
                    {editing ? (
                      <select
                        value={editData.status || ''}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value as Application['status'] })}
                        className="w-full p-3 md:p-4 bg-gray-800/50 border border-gray-600/50 rounded-xl md:rounded-2xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm md:text-base"
                      >
                        <option value="saved">Saved</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                        <option value="withdrawn">Withdrawn</option>
                      </select>
                    ) : (
                      <div className="bg-gray-800/30 px-4 py-3 rounded-xl md:rounded-2xl border border-gray-700/30">
                        <span className={`inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold border-2 ${getStatusColor(application.status)}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {(application.job_posting_url || editing) && (
                  <div className="space-y-3 pt-4 border-t border-gray-700/30">
                    <label className="text-xs md:text-sm font-medium text-gray-300 tracking-wide">Job Posting URL</label>
                    {editing ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                          <FiLink className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                        </div>
                        <input
                          value={editData.job_posting_url || ''}
                          onChange={(e) => setEditData({ ...editData, job_posting_url: e.target.value })}
                          className="flex-1 p-3 md:p-4 bg-gray-800/50 border border-gray-600/50 rounded-xl md:rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm md:text-base"
                          type="url"
                          placeholder="https://example.com/job-posting"
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-800/30 px-4 py-3 rounded-xl md:rounded-2xl border border-gray-700/30">
                        <a
                          href={application.job_posting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors group"
                        >
                          <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-500/20 rounded-lg md:rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                            <FiExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                          </div>
                          <span className="font-medium text-sm md:text-base">View Job Posting</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-gradient-to-br from-slate-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                  <FiEdit className="text-amber-400 w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">Notes & Comments</h3>
                  <p className="text-gray-400 text-xs md:text-sm">Additional information about this application</p>
                </div>
              </div>

              <div className="space-y-4">
                {editing ? (
                  <div className="space-y-3">
                    <label className="text-xs md:text-sm font-medium text-gray-300 tracking-wide">Application Notes</label>
                    <textarea
                      value={editData.notes || ''}
                      onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                      className="w-full p-4 md:p-6 bg-gray-800/50 border border-gray-600/50 rounded-xl md:rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200 min-h-[120px] md:min-h-[160px] resize-none text-sm md:text-base"
                      placeholder="Add your thoughts, follow-up reminders, interview feedback, or any other relevant notes about this application..."
                    />
                    <p className="text-xs text-gray-500">Use this space to track your application progress and important details</p>
                  </div>
                ) : (
                  <div className="relative">
                    {application.notes ? (
                      <div className="bg-gradient-to-r from-gray-800/40 to-gray-700/20 border border-gray-600/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                        <div className="absolute top-3 md:top-4 left-3 md:left-4 w-1 h-6 md:h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
                        <div className="pl-4 md:pl-6">
                          <p className="text-gray-200 leading-relaxed whitespace-pre-wrap font-medium text-sm md:text-base">
                            {application.notes}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-800/20 border-2 border-dashed border-gray-600/40 rounded-xl md:rounded-2xl p-6 md:p-8 text-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-700/30 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                          <FiEdit className="w-6 h-6 md:w-8 md:h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-400 font-medium mb-1 md:mb-2 text-sm md:text-base">No notes added yet</p>
                        <p className="text-gray-600 text-xs md:text-sm">Click edit to add notes about this application</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-6 space-y-6">
              {/* Timeline Section */}
              <div className="bg-gradient-to-br  backdrop-blur-sm  rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <FiClock className="text-purple-400 w-4 h-4" />
                    Timeline
                  </h3>
                  <button
                    onClick={() => {
                      resetTimelineForm();
                      setTimelineDialogOpen(true);
                    }}
                    className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                    title="Add Event"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>

                {timeline.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 mx-auto mb-3 bg-purple-800/30 rounded-full flex items-center justify-center">
                      <FiClock className="w-6 h-6 text-purple-400" />
                    </div>
                    <p className="text-purple-300 font-medium mb-1">No timeline events</p>
                    <p className="text-purple-400/60 text-xs">Add events to track your progress</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {timeline.map((event, index) => {
                      const isCompleted = event.completed;
                      const isNext = !event.completed && timeline.slice(0, index).every(e => e.completed);
                      const isLast = index === timeline.length - 1;
                      
                      return (
                        <div key={event.id} className="relative group">
                          {!isLast && (
                            <div className="absolute left-4 top-8 w-0.5 h-8 bg-purple-600/30"></div>
                          )}

                          <div className="flex items-start gap-3 py-2 px-2 rounded-xl hover:bg-purple-800/20 transition-colors">
                            <div className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 flex-shrink-0 ${
                              isCompleted 
                                ? "bg-purple-600 border-purple-500 text-white" 
                                : isNext
                                ? "bg-gray-800 border-purple-500 text-purple-400"
                                : "bg-gray-800 border-gray-600 text-gray-500"
                            }`}>
                              {isCompleted ? (
                                <FiCheckCircle className="w-3 h-3" />
                              ) : isNext ? (
                                <FiClock className="w-3 h-3 animate-pulse" />
                              ) : (
                                <FiCircle className="w-3 h-3" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wide font-medium ${getEventTypeColor(event.event_type)} bg-current/10`}>
                                    {getEventTypeLabel(event.event_type)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {dayjs(event.date).format('MMM D')}
                                  </span>
                                </div>
                                
                                <button
                                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-700 transition-all"
                                  onClick={() => handleEditEvent(event)}
                                >
                                  <FiMoreVertical className="w-3 h-3 text-gray-400" />
                                </button>
                              </div>

                              <h4 className={`font-medium text-sm mb-1 ${
                                isCompleted 
                                  ? "text-white" 
                                  : isNext
                                  ? "text-purple-300"
                                  : "text-gray-400"
                              }`}>
                                {event.title}
                              </h4>

                              {event.description && (
                                <p className={`text-xs leading-relaxed ${
                                  isCompleted 
                                    ? "text-gray-300" 
                                    : isNext
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}>
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Email Tracking Section */}
              <div className="bg-gradient-to-br backdrop-blur-sm  rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FiMail className="text-blue-400 w-5 h-5" />
                    <h3 className="text-white font-semibold">Email Tracking</h3>
                  </div>
                </div>

                {/* Email Status Summary */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-800/30 border border-blue-700/30 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-blue-300">{emailLogs.length}</div>
                    <div className="text-xs text-blue-400/80">Total Emails</div>
                  </div>
                  <div className="bg-blue-800/30 border border-blue-700/30 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-blue-300">
                      {emailLogs.filter(log => log.processed).length}
                    </div>
                    <div className="text-xs text-blue-400/80">Processed</div>
                  </div>
                </div>

                <button
                  onClick={processEmailsForApplication}
                  disabled={processingEmails}
                  className="w-full mb-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 
                            text-white rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {processingEmails ? (
                    <FiLoader className="animate-spin w-4 h-4" />
                  ) : (
                    <FiRefreshCw className="w-4 h-4" />
                  )}
                  Check for New Emails
                </button>

                <button
                  onClick={() => setShowEmailModal(true)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <FiMaximize2 className="w-4 h-4" />
                  Expand Email Details
                </button>

                <div className="mt-4 pt-4 border-t border-blue-700/30">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-300/70">Last checked:</span>
                    <span className="text-blue-300">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Event Dialog */}
      {timelineDialogOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl md:rounded-2xl w-full max-w-md mx-4">
            <div className="p-4 md:p-6 border-b border-gray-700">
              <h3 className="text-lg md:text-xl font-semibold text-white">
                {editingEvent ? 'Edit Timeline Event' : 'Add Timeline Event'}
              </h3>
            </div>
            
            <div className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-xs md:text-sm text-gray-400 mb-2">Event Type</label>
                <select
                  value={newEvent.event_type}
                  onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value as TimelineEvent['event_type'] })}
                  className="w-full p-2 md:p-3 bg-gray-800/50 border border-gray-700 rounded-lg md:rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
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
                <label className="block text-xs md:text-sm text-gray-400 mb-2">Title*</label>
                <input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full p-2 md:p-3 bg-gray-800/50 border border-gray-700 rounded-lg md:rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
                  placeholder="Event title"
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full p-2 md:p-3 bg-gray-800/50 border border-gray-700 rounded-lg md:rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[80px] md:min-h-[100px] text-sm md:text-base"
                  placeholder="Event details..."
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm text-gray-400 mb-2">Date</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dayjs(newEvent.date)}
                    onChange={(date) => setNewEvent({ ...newEvent, date: date?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD') })}
                    slotProps={{
                      textField: {
                        className: 'w-full',
                        InputProps: {
                          className: 'bg-gray-800/50 border-gray-700 text-white text-sm md:text-base'
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
                  className="w-4 h-4 md:w-5 md:h-5 rounded bg-gray-800/50 border-gray-700 text-purple-500 focus:ring-purple-500"
                />
                <label htmlFor="completed" className="text-xs md:text-sm text-gray-400">
                  Mark as completed
                </label>
              </div>
            </div>
            
            <div className="p-4 md:p-6 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={resetTimelineForm}
                className="px-3 py-2 md:px-4 md:py-2 bg-gray-700 hover:bg-gray-600 rounded-lg md:rounded-xl text-white transition-colors text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={editingEvent ? handleUpdateTimelineEvent : handleAddTimelineEvent}
                disabled={!newEvent.title.trim() || timelineProcessing}
                className={`px-3 py-2 md:px-4 md:py-2 rounded-lg md:rounded-xl text-white transition-colors text-sm md:text-base ${
                  !newEvent.title.trim() || timelineProcessing
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {timelineProcessing ? (
                  <span className="flex items-center gap-2">
                    <FiLoader className="animate-spin w-3 h-3 md:w-4 md:h-4" />
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
          <div className="bg-gray-800 border border-gray-700 rounded-xl md:rounded-2xl w-full max-w-md mx-4">
            <div className="p-4 md:p-6 border-b border-gray-700">
              <h3 className="text-lg md:text-xl font-semibold text-white">Delete Event</h3>
            </div>
            
            <div className="p-4 md:p-6">
              <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">Are you sure you want to delete this timeline event? This action cannot be undone.</p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-3 py-2 md:px-4 md:py-2 bg-gray-700 hover:bg-gray-600 rounded-lg md:rounded-xl text-white transition-colors text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEvent}
                  disabled={timelineProcessing}
                  className={`px-3 py-2 md:px-4 md:py-2 rounded-lg md:rounded-xl text-white transition-colors text-sm md:text-base ${
                    timelineProcessing
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {timelineProcessing ? (
                    <span className="flex items-center gap-2">
                      <FiLoader className="animate-spin w-3 h-3 md:w-4 md:h-4" />
                      Deleting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FiTrash2 className="w-3 h-3 md:w-4 md:h-4" />
                      Delete
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FiMail className="text-white w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Email Tracker</h2>
                  <p className="text-gray-400 text-sm">Emails for this application</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-2 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-6">
              <EmailLogList />
            </div>
          </div>
        </div>
      )}

      {showEmailDetailModal && <EmailDetailModal />}
    </Layout>
  );
};

export default ApplicationDetails;