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
//   FiMoreVertical
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
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => router.push('/pipeline')}
//               className="p-2 rounded-xl hover:bg-white/10 transition-colors"
//             >
//               <FiArrowLeft className="w-6 h-6 text-white" />
//             </button>
//             <div>
//               <h1 className="text-3xl font-bold text-white mb-2">{application.job_title}</h1>
//               <div className="flex items-center gap-4 text-gray-300">
//                 <span className="text-lg">{application.company_name}</span>
//                 {application.location && (
//                   <>
//                     <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
//                     <div className="flex items-center gap-1">
//                       <FiMapPin className="w-4 h-4" />
//                       <span>{application.location}</span>
//                     </div>
//                   </>
//                 )}
//                 {application.salary_range && (
//                   <>
//                     <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
//                     <div className="flex items-center gap-1">
//                       <FiDollarSign className="w-4 h-4" />
//                       <span>{application.salary_range}</span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
//               {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
//             </span>
            
//             <div className="flex gap-2">
//               <button
//                 onClick={handleDownloadPDF}
//                 disabled={downloadingPDF}
//                 className="p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700 text-white transition-colors"
//                 title="Export PDF"
//               >
//                 {downloadingPDF ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiDownload className="w-5 h-5" />}
//               </button>
              
//               {!editing ? (
//                 <button
//                   onClick={handleEdit}
//                   className="p-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors"
//                   title="Edit Application"
//                 >
//                   <FiEdit className="w-5 h-5" />
//                 </button>
//               ) : (
//                 <>
//                   <button
//                     onClick={handleSave}
//                     disabled={saving}
//                     className="p-3 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors"
//                     title="Save Changes"
//                   >
//                     {saving ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiSave className="w-5 h-5" />}
//                   </button>
//                   <button
//                     onClick={handleCancel}
//                     disabled={saving}
//                     className="p-3 rounded-xl bg-gray-600 hover:bg-gray-700 text-white transition-colors"
//                     title="Cancel"
//                   >
//                     <FiX className="w-5 h-5" />
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Application Details Card */}
//             <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
//               <div className="flex items-center justify-between mb-8">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center">
//                     <FiBriefcase className="text-purple-400 w-6 h-6" />
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold text-white">Application Details</h2>
//                     <p className="text-gray-400 text-sm">Manage your application information</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-8">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <div className="space-y-3">
//                     <label className="text-sm font-medium text-gray-300 tracking-wide">Job Title</label>
//                     {editing ? (
//                       <input
//                         value={editData.job_title || ''}
//                         onChange={(e) => setEditData({ ...editData, job_title: e.target.value })}
//                         className="w-full p-4 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
//                         placeholder="Enter job title"
//                       />
//                     ) : (
//                       <div className="bg-gray-800/30 px-4 py-3 rounded-2xl border border-gray-700/30">
//                         <p className="text-white font-semibold text-lg">{application.job_title}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-3">
//                     <label className="text-sm font-medium text-gray-300 tracking-wide">Company</label>
//                     {editing ? (
//                       <input
//                         value={editData.company_name || ''}
//                         onChange={(e) => setEditData({ ...editData, company_name: e.target.value })}
//                         className="w-full p-4 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
//                         placeholder="Enter company name"
//                       />
//                     ) : (
//                       <div className="bg-gray-800/30 px-4 py-3 rounded-2xl border border-gray-700/30">
//                         <p className="text-white font-semibold text-lg">{application.company_name}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-3">
//                     <label className="text-sm font-medium text-gray-300 tracking-wide">Application Date</label>
//                     {editing ? (
//                       <LocalizationProvider dateAdapter={AdapterDayjs}>
//                         <DatePicker
//                           value={editDate}
//                           onChange={(newValue) => setEditDate(newValue)}
//                           slotProps={{
//                             textField: {
//                               className: 'w-full',
//                               InputProps: {
//                                 className: 'bg-gray-800/50 border-gray-600/50 text-white rounded-2xl'
//                               }
//                             }
//                           }}
//                         />
//                       </LocalizationProvider>
//                     ) : (
//                       <div className="bg-gray-800/30 px-4 py-3 rounded-2xl border border-gray-700/30">
//                         <div className="flex items-center gap-3 text-white">
//                           <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center">
//                             <FiCalendar className="w-4 h-4 text-purple-400" />
//                           </div>
//                           <span className="font-medium">{dayjs(application.application_date).format('MMMM D, YYYY')}</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-3">
//                     <label className="text-sm font-medium text-gray-300 tracking-wide">Status</label>
//                     {editing ? (
//                       <select
//                         value={editData.status || ''}
//                         onChange={(e) => setEditData({ ...editData, status: e.target.value as Application['status'] })}
//                         className="w-full p-4 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
//                       >
//                         <option value="saved">Saved</option>
//                         <option value="applied">Applied</option>
//                         <option value="interview">Interview</option>
//                         <option value="offer">Offer</option>
//                         <option value="rejected">Rejected</option>
//                         <option value="withdrawn">Withdrawn</option>
//                       </select>
//                     ) : (
//                       <div className="bg-gray-800/30 px-4 py-3 rounded-2xl border border-gray-700/30">
//                         <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(application.status)}`}>
//                           {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {(application.job_posting_url || editing) && (
//                   <div className="space-y-3 pt-4 border-t border-gray-700/30">
//                     <label className="text-sm font-medium text-gray-300 tracking-wide">Job Posting URL</label>
//                     {editing ? (
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
//                           <FiLink className="w-5 h-5 text-blue-400" />
//                         </div>
//                         <input
//                           value={editData.job_posting_url || ''}
//                           onChange={(e) => setEditData({ ...editData, job_posting_url: e.target.value })}
//                           className="flex-1 p-4 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
//                           type="url"
//                           placeholder="https://example.com/job-posting"
//                         />
//                       </div>
//                     ) : (
//                       <div className="bg-gray-800/30 px-4 py-3 rounded-2xl border border-gray-700/30">
//                         <a
//                           href={application.job_posting_url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="inline-flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors group"
//                         >
//                           <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
//                             <FiExternalLink className="w-4 h-4" />
//                           </div>
//                           <span className="font-medium">View Job Posting</span>
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Notes Section */}
//             <div className="bg-gradient-to-br from-slate-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
//                   <FiEdit className="text-amber-400 w-6 h-6" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold text-white">Notes & Comments</h3>
//                   <p className="text-gray-400 text-sm">Additional information about this application</p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 {editing ? (
//                   <div className="space-y-3">
//                     <label className="text-sm font-medium text-gray-300 tracking-wide">Application Notes</label>
//                     <textarea
//                       value={editData.notes || ''}
//                       onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
//                       className="w-full p-6 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200 min-h-[160px] resize-none"
//                       placeholder="Add your thoughts, follow-up reminders, interview feedback, or any other relevant notes about this application..."
//                     />
//                     <p className="text-xs text-gray-500">Use this space to track your application progress and important details</p>
//                   </div>
//                 ) : (
//                   <div className="relative">
//                     {application.notes ? (
//                       <div className="bg-gradient-to-r from-gray-800/40 to-gray-700/20 border border-gray-600/30 rounded-2xl p-6">
//                         <div className="absolute top-4 left-4 w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
//                         <div className="pl-6">
//                           <p className="text-gray-200 leading-relaxed whitespace-pre-wrap font-medium">
//                             {application.notes}
//                           </p>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="bg-gray-800/20 border-2 border-dashed border-gray-600/40 rounded-2xl p-8 text-center">
//                         <div className="w-16 h-16 bg-gray-700/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                           <FiEdit className="w-8 h-8 text-gray-500" />
//                         </div>
//                         <p className="text-gray-400 font-medium mb-2">No notes added yet</p>
//                         <p className="text-gray-600 text-sm">Click edit to add notes about this application</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Timeline Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-6 space-y-6">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-semibold text-white flex items-center gap-3">
//                   <FiClock className="text-purple-400 w-5 h-5" />
//                   Timeline
//                 </h2>
//                 <button
//                   onClick={() => {
//                     resetTimelineForm();
//                     setTimelineDialogOpen(true);
//                   }}
//                   className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors"
//                   title="Add Event"
//                 >
//                   <FiPlus className="w-5 h-5" />
//                 </button>
//               </div>

//               {timeline.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
//                     <FiClock className="w-8 h-8 text-gray-500" />
//                   </div>
//                   <p className="text-gray-400 mb-2">No timeline events</p>
//                   <p className="text-gray-600 text-sm">Add events to track progress</p>
//                 </div>
//               ) : (
//                 <div className="space-y-1">
//                   {timeline.map((event, index) => {
//                     const isCompleted = event.completed;
//                     const isNext = !event.completed && timeline.slice(0, index).every(e => e.completed);
//                     const isLast = index === timeline.length - 1;
                    
//                     return (
//                       <div key={event.id} className="relative group">
//                         {/* Vertical dotted line */}
//                         {!isLast && (
//                           <div className="absolute left-4 top-12 w-0.5 h-16 flex flex-col items-center">
//                             {Array.from({ length: 8 }).map((_, i) => (
//                               <div
//                                 key={i}
//                                 className={`w-0.5 h-1 mb-1 ${
//                                   isCompleted ? "bg-purple-500" : "bg-gray-700"
//                                 }`}
//                               />
//                             ))}
//                           </div>
//                         )}

//                         {/* Timeline Event */}
//                         <div className="flex items-start gap-4 py-3 px-2 rounded-xl hover:bg-gray-800/20 transition-colors">
//                           {/* Status Dot */}
//                           <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0 ${
//                             isCompleted 
//                               ? "bg-purple-600 border-purple-500 text-white" 
//                               : isNext
//                               ? "bg-gray-800 border-purple-500 text-purple-400"
//                               : "bg-gray-800 border-gray-600 text-gray-500"
//                           }`}>
//                             {isCompleted ? (
//                               <FiCheckCircle className="w-5 h-5" />
//                             ) : isNext ? (
//                               <FiClock className="w-4 h-4 animate-pulse" />
//                             ) : (
//                               <FiCircle className="w-4 h-4" />
//                             )}
//                           </div>

//                           {/* Event Content */}
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center justify-between mb-1">
//                               <div className="flex items-center gap-2">
//                                 <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wide font-medium ${getEventTypeColor(event.event_type)} bg-current/10`}>
//                                   {getEventTypeLabel(event.event_type)}
//                                 </span>
//                                 <span className="text-xs text-gray-500">
//                                   {dayjs(event.date).format('MMM D')}
//                                 </span>
//                               </div>
                              
//                               <button
//                                 className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-700 transition-all"
//                                 onClick={() => handleEditEvent(event)}
//                               >
//                                 <FiMoreVertical className="w-4 h-4 text-gray-400" />
//                               </button>
//                             </div>

//                             <h4 className={`font-medium text-sm mb-1 ${
//                               isCompleted 
//                                 ? "text-white" 
//                                 : isNext
//                                 ? "text-purple-300"
//                                 : "text-gray-400"
//                             }`}>
//                               {event.title}
//                             </h4>

//                             {event.description && (
//                               <p className={`text-xs leading-relaxed ${
//                                 isCompleted 
//                                   ? "text-gray-300" 
//                                   : isNext
//                                   ? "text-gray-400"
//                                   : "text-gray-600"
//                               }`}>
//                                 {event.description}
//                               </p>
//                             )}
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
  FiMoreVertical
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
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-3">
                  <FiClock className="text-purple-400 w-4 h-4 md:w-5 md:h-5" />
                  Timeline
                </h2>
                <button
                  onClick={() => {
                    resetTimelineForm();
                    setTimelineDialogOpen(true);
                  }}
                  className="p-2 md:p-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                  title="Add Event"
                >
                  <FiPlus className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              {timeline.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                    <FiClock className="w-6 h-6 md:w-8 md:h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 mb-1 md:mb-2 text-sm md:text-base">No timeline events</p>
                  <p className="text-gray-600 text-xs md:text-sm">Add events to track progress</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {timeline.map((event, index) => {
                    const isCompleted = event.completed;
                    const isNext = !event.completed && timeline.slice(0, index).every(e => e.completed);
                    const isLast = index === timeline.length - 1;
                    
                    return (
                      <div key={event.id} className="relative group">
                        {/* Vertical dotted line */}
                        {!isLast && (
                          <div className="absolute left-3 md:left-4 top-10 md:top-12 w-0.5 h-12 md:h-16 flex flex-col items-center">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-0.5 h-1 mb-1 ${
                                  isCompleted ? "bg-purple-500" : "bg-gray-700"
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Timeline Event */}
                        <div className="flex items-start gap-3 md:gap-4 py-2 md:py-3 px-2 rounded-xl hover:bg-gray-800/20 transition-colors">
                          {/* Status Dot */}
                          <div className={`relative z-10 flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex-shrink-0 ${
                            isCompleted 
                              ? "bg-purple-600 border-purple-500 text-white" 
                              : isNext
                              ? "bg-gray-800 border-purple-500 text-purple-400"
                              : "bg-gray-800 border-gray-600 text-gray-500"
                          }`}>
                            {isCompleted ? (
                              <FiCheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                            ) : isNext ? (
                              <FiClock className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
                            ) : (
                              <FiCircle className="w-3 h-3 md:w-4 md:h-4" />
                            )}
                          </div>

                          {/* Event Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1 md:gap-2">
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
                                <FiMoreVertical className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                              </button>
                            </div>

                            <h4 className={`font-medium text-xs md:text-sm mb-1 ${
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
    </Layout>
  );
};

export default ApplicationDetails;