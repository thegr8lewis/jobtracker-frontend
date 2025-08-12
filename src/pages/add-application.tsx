
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

const AddApplicationPage = () => {
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
  
  // File states
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumePreview, setResumePreview] = useState<string | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  
  // Refs
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

    // Validate file types
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

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    if (type === 'resume') {
      setResumeFile(file);
      // Create preview for PDF
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
    if (!formData.company_name.trim() || !formData.job_title.trim()) {
      setError('Company name and job title are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const submitData = {
        ...formData,
        application_date: applicationDate?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
      };

      // Upload resume if exists
      let resumeUrl = '';
      if (resumeFile) {
        const uploadResponse = await filesAPI.uploadResume(resumeFile);
        resumeUrl = uploadResponse.data.url;
      }

      // Upload cover letter if exists
      let coverLetterUrl = '';
      if (coverLetterFile) {
        const uploadResponse = await filesAPI.uploadCoverLetter(coverLetterFile);
        coverLetterUrl = uploadResponse.data.url;
      }

      // Create application with file URLs if available
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

  if (success) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="glass-card p-6 text-center max-w-md">
            <FiCheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">Application Added Successfully!</h2>
            <p className="text-white/80">Redirecting to pipeline...</p>
            <FiLoader className="w-6 h-6 text-green-400 animate-spin mx-auto mt-4" />
          </div>
        </div>
      </Layout>
    );
  }

  const FileUploadCard = ({ 
    type, 
    file, 
    inputRef,
    preview
  }: {
    type: 'resume' | 'coverLetter';
    file: File | null;
    inputRef: React.RefObject<HTMLInputElement>;
    preview?: string | null;
  }) => (
    <div className="border border-white/20 rounded-lg p-4 bg-white/5">
      {!file ? (
        <div 
          className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:bg-white/5 transition-colors"
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
            <FiUpload className="w-8 h-8 text-white/60 mb-2" />
            <p className="text-white/80">Click to upload {type === 'resume' ? 'resume' : 'cover letter'}</p>
            <p className="text-xs text-white/50 mt-1">PDF, Word or Text (max 5MB)</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {type === 'resume' ? (
                <FiFileText className="w-5 h-5 text-blue-400 mr-3" />
              ) : (
                <FiFile className="w-5 h-5 text-purple-400 mr-3" />
              )}
              <div>
                <p className="text-white/90">{file.name}</p>
                <p className="text-xs text-white/50">
                  {(file.size / 1024).toFixed(1)} KB • {file.type.split('/')[1].toUpperCase()}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeFile(type)}
              className="text-white/50 hover:text-white/80"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          {preview && type === 'resume' && file.type === 'application/pdf' && (
            <div className="mt-4">
              <p className="text-sm text-white/80 mb-2">Preview:</p>
              <iframe 
                src={preview} 
                className="w-full h-64 border border-white/10 rounded"
                title="Resume preview"
              />
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-white/70 hover:text-white mr-4"
          >
            <FiArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold">Add New Application</h1>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Company Name *</label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  required
                  disabled={loading}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Acme Corp"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Job Title *</label>
                <input
                  type="text"
                  value={formData.job_title}
                  onChange={(e) => handleInputChange('job_title', e.target.value)}
                  required
                  disabled={loading}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Software Engineer"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={loading}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Remote, New York, NY"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Salary Range</label>
                <input
                  type="text"
                  value={formData.salary_range}
                  onChange={(e) => handleInputChange('salary_range', e.target.value)}
                  disabled={loading}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., $80,000 - $120,000"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  disabled={loading}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-white/80">Application Date</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={applicationDate}
                    onChange={(newValue) => setApplicationDate(newValue)}
                    disabled={loading}
                    slotProps={{
                      textField: {
                        className: 'w-full bg-gray-700/50 border-gray-600',
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-white/80">Job Posting URL</label>
                <input
                  type="url"
                  value={formData.job_posting_url}
                  onChange={(e) => handleInputChange('job_posting_url', e.target.value)}
                  disabled={loading}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/job-posting"
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-white/80">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  disabled={loading}
                  className="w-full p-3 min-h-[120px] bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional notes about this application..."
                />
              </div>
              
              {/* <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-white/80">Resume</label>
                <FileUploadCard 
                  type="resume" 
                  file={resumeFile} 
                  inputRef={resumeInputRef}
                  preview={resumePreview}
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-white/80">Cover Letter</label>
                <FileUploadCard 
                  type="coverLetter" 
                  file={coverLetterFile} 
                  inputRef={coverLetterInputRef}
                />
              </div> */}
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FiLoader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiPlus className="w-5 h-5" />
                    Add Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        <p className="mt-4 text-sm text-white/60">
          * Required fields. You can edit all information later from the application details page.
        </p>
      </div>
    </Layout>
  );
};

export default AddApplicationPage;