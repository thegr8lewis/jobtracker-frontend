// "use client";

// import React, { useState, useRef } from 'react';
// import { useRouter } from 'next/router';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs, { Dayjs } from 'dayjs';
// import Layout from '../components/Layout';
// import { applicationAPI, CreateApplicationData, filesAPI } from '../lib/api';
// import { 
//   FiCheckCircle, 
//   FiLoader, 
//   FiUpload, 
//   FiX, 
//   FiFileText,
//   FiFile,
//   FiPlus,
//   FiArrowLeft
// } from 'react-icons/fi';

// const AddApplicationPage: React.FC = () => {
//   const [formData, setFormData] = useState<CreateApplicationData>({
//     company_name: '',
//     job_title: '',
//     job_posting_url: '',
//     location: '',
//     salary_range: '',
//     status: 'applied',
//     notes: '',
//   });
//   const [applicationDate, setApplicationDate] = useState<Dayjs | null>(dayjs());
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);
  
//   // File states
//   const [resumeFile, setResumeFile] = useState<File | null>(null);
//   const [resumePreview, setResumePreview] = useState<string | null>(null);
//   const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  
//   // Refs
//   const resumeInputRef = useRef<HTMLInputElement>(null);
//   const coverLetterInputRef = useRef<HTMLInputElement>(null);
  
//   const router = useRouter();

//   const handleInputChange = (field: keyof CreateApplicationData, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleFileChange = (
//     e: React.ChangeEvent<HTMLInputElement>, 
//     type: 'resume' | 'coverLetter'
//   ) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validate file types
//     const validTypes = [
//       'application/pdf',
//       'application/msword',
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//       'text/plain'
//     ];
    
//     if (!validTypes.includes(file.type)) {
//       setError('Please upload a PDF, Word document, or text file');
//       return;
//     }

//     // Validate file size (5MB max)
//     if (file.size > 5 * 1024 * 1024) {
//       setError('File size should be less than 5MB');
//       return;
//     }

//     if (type === 'resume') {
//       setResumeFile(file);
//       // Create preview for PDF
//       if (file.type === 'application/pdf') {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           setResumePreview(e.target?.result as string);
//         };
//         reader.readAsDataURL(file);
//       } else {
//         setResumePreview(null);
//       }
//     } else {
//       setCoverLetterFile(file);
//     }
    
//     setError(null);
//   };

//   const removeFile = (type: 'resume' | 'coverLetter') => {
//     if (type === 'resume') {
//       setResumeFile(null);
//       setResumePreview(null);
//       if (resumeInputRef.current) {
//         resumeInputRef.current.value = '';
//       }
//     } else {
//       setCoverLetterFile(null);
//       if (coverLetterInputRef.current) {
//         coverLetterInputRef.current.value = '';
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // if (!formData.company_name.trim() || !formData.job_title.trim() || !formData.job_posting_url.trim()) {
//       if (!formData.company_name.trim() || !formData.job_title.trim() || !formData.job_posting_url?.trim()) {
//       setError('Company name, job title, and job posting URL are required');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
      
//       const submitData = {
//         ...formData,
//         application_date: applicationDate?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
//       };

//       // Upload resume if exists
//       let resumeUrl = '';
//       if (resumeFile) {
//         const uploadResponse = await filesAPI.uploadResume(resumeFile);
//         resumeUrl = uploadResponse.data.url;
//       }

//       // Upload cover letter if exists
//       let coverLetterUrl = '';
//       if (coverLetterFile) {
//         const uploadResponse = await filesAPI.uploadCoverLetter(coverLetterFile);
//         coverLetterUrl = uploadResponse.data.url;
//       }

//       // Create application with file URLs if available
//       await applicationAPI.create({
//         ...submitData,
//         resume_url: resumeUrl || undefined,
//         cover_letter_url: coverLetterUrl || undefined
//       });

//       setSuccess(true);
//       setFormData({
//         company_name: '',
//         job_title: '',
//         job_posting_url: '',
//         location: '',
//         salary_range: '',
//         status: 'applied',
//         notes: '',
//       });
//       setApplicationDate(dayjs());
//       setResumeFile(null);
//       setResumePreview(null);
//       setCoverLetterFile(null);
      
//       setTimeout(() => {
//         router.push('/pipeline');
//       }, 2000);
//     } catch (err: any) {
//       setError(err.message || 'Failed to create application');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const FileUploadCard: React.FC<{ 
//     type: 'resume' | 'coverLetter';
//     file: File | null;
//     inputRef: React.RefObject<HTMLInputElement>;
//     preview?: string | null;
//   }> = ({ type, file, inputRef, preview }) => (
//     <div className="border border-white/10 rounded-lg p-4 bg-white/5 backdrop-blur-sm">
//       {!file ? (
//         <div 
//           className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center cursor-pointer hover:bg-white/10 transition-all"
//           onClick={() => inputRef.current?.click()}
//         >
//           <input
//             type="file"
//             ref={inputRef}
//             onChange={(e) => handleFileChange(e, type)}
//             accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
//             className="hidden"
//           />
//           <div className="flex flex-col items-center">
//             <FiUpload className="w-6 h-6 text-white/60 mb-2" />
//             <p className="text-white/80 text-sm">Upload {type === 'resume' ? 'resume' : 'cover letter'}</p>
//             <p className="text-xs text-white/50 mt-1">PDF, Word or Text (max 5MB)</p>
//           </div>
//         </div>
//       ) : (
//         <>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               {type === 'resume' ? (
//                 <FiFileText className="w-5 h-5 text-blue-400 mr-3" />
//               ) : (
//                 <FiFile className="w-5 h-5 text-purple-400 mr-3" />
//               )}
//               <div>
//                 <p className="text-white/90 text-sm">{file.name}</p>
//                 <p className="text-xs text-white/50">
//                   {(file.size / 1024).toFixed(1)} KB • {file.type.split('/')[1].toUpperCase()}
//                 </p>
//               </div>
//             </div>
//             <button
//               type="button"
//               onClick={() => removeFile(type)}
//               className="text-white/50 hover:text-white transition-colors"
//             >
//               <FiX className="w-5 h-5" />
//             </button>
//           </div>
          
//           {preview && type === 'resume' && file.type === 'application/pdf' && (
//             <div className="mt-4">
//               <p className="text-sm text-white/80 mb-2">Preview:</p>
//               <iframe 
//                 src={preview} 
//                 className="w-full h-64 border border-white/10 rounded-lg"
//                 title="Resume preview"
//               />
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );

//   if (success) {
//     return (
//       <Layout>
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-6 max-w-md w-full shadow-2xl">
//             <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
//             <div className="relative space-y-4">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
//                   <FiCheckCircle className="w-6 h-6 text-green-400" />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-white">Application Added</h2>
//                   <p className="text-white/60 text-base">Redirecting to pipeline...</p>
//                 </div>
//               </div>
//               <div className="flex justify-center">
//                 <FiLoader className="w-6 h-6 text-green-400 animate-spin" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
//         <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
//           {error && (
//             <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 backdrop-blur-sm">
//               <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent"></div>
//               <div className="relative p-4 flex items-center justify-between">
//                 <div className="flex items-center gap-3 flex-1">
//                   <div className="p-2 rounded-lg bg-red-500/20">
//                     <FiX className="w-5 h-5 text-red-400" />
//                   </div>
//                   <span className="text-white font-medium text-base truncate">{error}</span>
//                 </div>
//                 <button
//                   onClick={() => setError(null)}
//                   className="p-2 rounded-lg hover:bg-white/10 text-red-400 hover:text-white transition-colors"
//                 >
//                   <FiX className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           )}

//           <div className="flex flex-col gap-6">
//             <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
//               <div>
//                 <button
//                   onClick={() => router.back()}
//                   className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/10 hover:border-white/20 mb-4"
//                 >
//                   <FiArrowLeft className="w-4 h-4" />
//                   <span className="font-medium text-base">Back to Pipeline</span>
//                 </button>
//                 <h1 className="text-3xl font-bold text-white mb-2">Add New Application</h1>
//                 <p className="text-white/60 text-base">Track a new job application</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-white/70">Company Name *</label>
//                   <input
//                     type="text"
//                     value={formData.company_name}
//                     onChange={(e) => handleInputChange('company_name', e.target.value)}
//                     required
//                     disabled={loading}
//                     className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all text-sm"
//                     placeholder="e.g., Acme Corp"
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-white/70">Job Title *</label>
//                   <input
//                     type="text"
//                     value={formData.job_title}
//                     onChange={(e) => handleInputChange('job_title', e.target.value)}
//                     required
//                     disabled={loading}
//                     className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all text-sm"
//                     placeholder="e.g., Software Engineer"
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-white/70">Job Posting URL *</label>
//                   <input
//                     type="url"
//                     value={formData.job_posting_url}
//                     onChange={(e) => handleInputChange('job_posting_url', e.target.value)}
//                     required
//                     disabled={loading}
//                     className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all text-sm"
//                     placeholder="https://example.com/job-posting"
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-white/70">Location</label>
//                   <input
//                     type="text"
//                     value={formData.location}
//                     onChange={(e) => handleInputChange('location', e.target.value)}
//                     disabled={loading}
//                     className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all text-sm"
//                     placeholder="e.g., Remote, New York, NY"
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-white/70">Salary Range</label>
//                   <input
//                     type="text"
//                     value={formData.salary_range}
//                     onChange={(e) => handleInputChange('salary_range', e.target.value)}
//                     disabled={loading}
//                     className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all text-sm"
//                     placeholder="e.g., $80,000 - $120,000"
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-white/70">Status</label>
//                   <select
//                     value={formData.status}
//                     onChange={(e) => handleInputChange('status', e.target.value)}
//                     disabled={loading}
//                     className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all text-sm"
//                   >
//                     <option value="saved">Saved</option>
//                     <option value="applied">Applied</option>
//                     <option value="interview">Interview</option>
//                     <option value="offer">Offer</option>
//                     <option value="rejected">Rejected</option>
//                     <option value="withdrawn">Withdrawn</option>
//                   </select>
//                 </div>
                
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-white/70">Application Date</label>
//                   <LocalizationProvider dateAdapter={AdapterDayjs}>
//                     <DatePicker
//                       value={applicationDate}
//                       onChange={(newValue) => setApplicationDate(newValue)}
//                       disabled={loading}
//                       slotProps={{
//                         textField: {
//                           className: 'w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all text-sm',
//                         },
//                       }}
//                     />
//                   </LocalizationProvider>
//                 </div>
                
//                 <div className="md:col-span-2 space-y-2">
//                   <label className="block text-sm font-medium text-white/70">Notes</label>
//                   <textarea
//                     value={formData.notes}
//                     onChange={(e) => handleInputChange('notes', e.target.value)}
//                     disabled={loading}
//                     className="w-full px-3 py-2.5 min-h-[120px] rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all text-sm"
//                     placeholder="Additional notes about this application..."
//                   />
//                 </div>
                
//                   </div>
              
//               <div className="flex flex-col-reverse md:flex-row justify-end gap-4 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => router.back()}
//                   disabled={loading}
//                   className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10 hover:border-white/20 text-base"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-base flex items-center justify-center gap-2"
//                 >
//                   {loading ? (
//                     <>
//                       <FiLoader className="w-5 h-5 animate-spin" />
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       <FiPlus className="w-5 h-5" />
//                       Add Application
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
          
//           <p className="text-sm text-white/60">
//             * Required fields. You can edit all information later from the application details page.
//           </p>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default AddApplicationPage;

"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import Layout from '../components/Layout';
import { applicationAPI, CreateApplicationData, filesAPI } from '../lib/api';
import { 
  FiCheckCircle, 
  FiLoader, 
  FiUpload, 
  FiX, 
  FiFileText,
  FiFile,
  FiPlus,
  FiArrowLeft
} from 'react-icons/fi';

const AddApplicationPage: React.FC = () => {
  const [formData, setFormData] = useState<CreateApplicationData>({
    company_name: '',
    job_title: '',
    job_posting_url: '',
    location: '',
    salary_range: '',
    status: 'applied',
    notes: '',
  });
  const [applicationDate, setApplicationDate] = useState<Dayjs | null>(dayjs());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumePreview, setResumePreview] = useState<string | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const coverLetterInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();

  const handleInputChange = (field: keyof CreateApplicationData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    type: 'resume' | 'coverLetter'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF, Word document, or text file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    if (type === 'resume') {
      setResumeFile(file);
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setResumePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setResumePreview(null);
      }
    } else {
      setCoverLetterFile(file);
    }
    
    setError(null);
  };

  const removeFile = (type: 'resume' | 'coverLetter') => {
    if (type === 'resume') {
      setResumeFile(null);
      setResumePreview(null);
      if (resumeInputRef.current) {
        resumeInputRef.current.value = '';
      }
    } else {
      setCoverLetterFile(null);
      if (coverLetterInputRef.current) {
        coverLetterInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company_name.trim() || !formData.job_title.trim() || !formData.job_posting_url?.trim()) {
      setError('Company name, job title, and job posting URL are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const submitData = {
        ...formData,
        application_date: applicationDate?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
      };

      let resumeUrl = '';
      if (resumeFile) {
        const uploadResponse = await filesAPI.uploadResume(resumeFile);
        resumeUrl = uploadResponse.data.url;
      }

      let coverLetterUrl = '';
      if (coverLetterFile) {
        const uploadResponse = await filesAPI.uploadCoverLetter(coverLetterFile);
        coverLetterUrl = uploadResponse.data.url;
      }

      await applicationAPI.create({
        ...submitData,
        resume_url: resumeUrl || undefined,
        cover_letter_url: coverLetterUrl || undefined
      });

      setSuccess(true);
      setFormData({
        company_name: '',
        job_title: '',
        job_posting_url: '',
        location: '',
        salary_range: '',
        status: 'applied',
        notes: '',
      });
      setApplicationDate(dayjs());
      setResumeFile(null);
      setResumePreview(null);
      setCoverLetterFile(null);
      
      setTimeout(() => {
        router.push('/pipeline');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create application');
    } finally {
      setLoading(false);
    }
  };

  const FileUploadCard: React.FC<{ 
    type: 'resume' | 'coverLetter';
    file: File | null;
    inputRef: React.RefObject<HTMLInputElement>;
    preview?: string | null;
  }> = ({ type, file, inputRef, preview }) => (
    <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/30 rounded-2xl p-4 sm:p-6 transition-all hover:bg-gray-800/70">
      {!file ? (
        <div 
          className="border-2 border-dashed border-gray-700/30 rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:bg-gray-700/50 transition-all"
          onClick={() => inputRef.current?.click()}
        >
          <input
            type="file"
            ref={inputRef}
            onChange={(e) => handleFileChange(e, type)}
            accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            className="hidden"
          />
          <div className="flex flex-col items-center">
            <FiUpload className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400 mb-2" />
            <p className="text-gray-100 text-sm sm:text-base">Upload {type === 'resume' ? 'Resume' : 'Cover Letter'}</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">PDF, Word, or Text (max 5MB)</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {type === 'resume' ? (
                <FiFileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mr-3" />
              ) : (
                <FiFile className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mr-3" />
              )}
              <div>
                <p className="text-gray-100 text-sm sm:text-base">{file.name}</p>
                <p className="text-xs sm:text-sm text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB • {file.type.split('/')[1].toUpperCase()}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeFile(type)}
              className="text-gray-400 hover:text-gray-100 transition-colors"
            >
              <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          
          {preview && type === 'resume' && file.type === 'application/pdf' && (
            <div className="mt-4 sm:mt-6">
              <p className="text-sm sm:text-base text-gray-100 mb-2">Preview:</p>
              <iframe 
                src={preview} 
                className="w-full h-64 sm:h-80 border border-gray-700/30 rounded-lg"
                title="Resume preview"
              />
            </div>
          )}
        </>
      )}
    </div>
  );

  if (success) {
    return (
      <Layout>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative overflow-hidden rounded-2xl bg-gray-800/50 border border-gray-700/30 p-6 sm:p-8 max-w-md w-full backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 to-transparent"></div>
            <div className="relative space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-3 rounded-lg bg-green-600/30 border border-green-600/50">
                  <FiCheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-100">Application Added</h2>
                  <p className="text-gray-400 text-sm sm:text-base">Redirecting to pipeline...</p>
                </div>
              </div>
              <div className="flex justify-center">
                <FiLoader className="w-6 h-6 sm:w-7 sm:h-7 text-green-400 animate-spin" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {error && (
            <div className="relative overflow-hidden rounded-2xl bg-gray-800/50 border border-red-600/30 backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 to-transparent"></div>
              <div className="relative p-4 sm:p-6 flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-red-600/30">
                    <FiX className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                  </div>
                  <span className="text-gray-100 font-medium text-sm sm:text-base truncate">{error}</span>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="p-2 rounded-lg hover:bg-gray-700/50 text-red-400 hover:text-gray-100 transition-colors"
                >
                  <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 rounded-xl flex items-center justify-center transition-transform hover:scale-105">
                  <FiPlus className="text-purple-400 w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-100">Add New Application</h1>
                  <p className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2">Track a new job application</p>
                </div>
              </div>
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-gray-100 transition-all border border-gray-700/30 hover:border-gray-600/50 text-sm sm:text-base"
              >
                <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium">Back to Pipeline</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/30 rounded-2xl p-4 sm:p-6 backdrop-blur-md">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-medium text-gray-300">Company Name *</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-3 py-2.5 sm:py-3 rounded-lg bg-gray-800/50 border border-gray-700/30 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all text-sm sm:text-base"
                    placeholder="e.g., Acme Corp"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-medium text-gray-300">Job Title *</label>
                  <input
                    type="text"
                    value={formData.job_title}
                    onChange={(e) => handleInputChange('job_title', e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-3 py-2.5 sm:py-3 rounded-lg bg-gray-800/50 border border-gray-700/30 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all text-sm sm:text-base"
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-medium text-gray-300">Job Posting URL *</label>
                  <input
                    type="url"
                    value={formData.job_posting_url}
                    onChange={(e) => handleInputChange('job_posting_url', e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-3 py-2.5 sm:py-3 rounded-lg bg-gray-800/50 border border-gray-700/30 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all text-sm sm:text-base"
                    placeholder="https://example.com/job-posting"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-medium text-gray-300">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2.5 sm:py-3 rounded-lg bg-gray-800/50 border border-gray-700/30 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all text-sm sm:text-base"
                    placeholder="e.g., Remote, New York, NY"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-medium text-gray-300">Salary Range</label>
                  <input
                    type="text"
                    value={formData.salary_range}
                    onChange={(e) => handleInputChange('salary_range', e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2.5 sm:py-3 rounded-lg bg-gray-800/50 border border-gray-700/30 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all text-sm sm:text-base"
                    placeholder="e.g., $80,000 - $120,000"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-medium text-gray-300">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2.5 sm:py-3 rounded-lg bg-gray-800/50 border border-gray-700/30 text-gray-100 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all text-sm sm:text-base"
                  >
                    <option value="saved">Saved</option>
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-medium text-gray-300">Application Date</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={applicationDate}
                      onChange={(newValue) => setApplicationDate(newValue)}
                      disabled={loading}
                      slotProps={{
                        textField: {
                          className: 'w-full px-3 py-2.5 sm:py-3 rounded-lg bg-gray-800/50 border border-gray-700/30 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all text-sm sm:text-base',
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm sm:text-base font-medium text-gray-300">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2.5 sm:py-3 min-h-[120px] rounded-lg bg-gray-800/50 border border-gray-700/30 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all text-sm sm:text-base"
                    placeholder="Additional notes about this application..."
                  />
                </div>

                {/* <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm sm:text-base font-medium text-gray-300">Upload Files</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <FileUploadCard 
                      type="resume" 
                      file={resumeFile} 
                      inputRef={resumeInputRef} 
                      preview={resumePreview} 
                    />
                    <FileUploadCard 
                      type="coverLetter" 
                      file={coverLetterFile} 
                      inputRef={coverLetterInputRef} 
                    />
                  </div>
                </div> */}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 sm:pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-gray-100 transition-all border border-gray-700/30 hover:border-gray-600/50 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-gray-100 font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <FiLoader className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiPlus className="w-5 h-5 sm:w-6 sm:h-6" />
                      Add Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <p className="text-sm text-gray-400">
            * Required fields. You can edit all information later from the application details page.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AddApplicationPage;