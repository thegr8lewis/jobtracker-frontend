
// import axios from 'axios';
// import { getAuth } from "firebase/auth";

// // Base URL
// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL ||
//   'http://localhost:8000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 90000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // ------------------ INTERCEPTORS ------------------

// api.interceptors.request.use(
//   async (config) => {
//     const auth = getAuth();
//     const user = auth.currentUser;
//     console.log("Current user:", user);
//     if (user) {
//       config.headers['X-User-UID'] = user.uid;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const message =
//       error.response?.data?.message ||
//       error.response?.data?.detail ||
//       error.message ||
//       'An error occurred';
//     return Promise.reject({
//       message,
//       status: error.response?.status,
//       data: error.response?.data,
//     });
//   }
// );

// // ------------------ TYPES ------------------

// export type ApplicationStatus = 
//   | 'saved'
//   | 'applied'
//   | 'interview'
//   | 'offer'
//   | 'rejected'
//   | 'withdrawn';

// export interface TimelineEvent {
//   id: number;
//   event_type: string;
//   title: string;
//   description?: string;
//   date: string;
//   completed: boolean;
//   created_at: string;
// }

// export interface Application {
//   id: number;
//   user_uid: string;
//   company_name: string;
//   job_title: string;
//   job_posting_url?: string;
//   location?: string;
//   salary_range?: string;
//   application_date: string;
//   status: ApplicationStatus;
//   notes?: string;
//   resume?: string;
//   cover_letter?: string;
//   resume_url?: string;
//   cover_letter_url?: string;
//   resume_content?: string;
//   cover_letter_content?: string;
//   timeline_events?: TimelineEvent[];
//   created_at: string;
//   updated_at: string;
// }

// export interface DashboardStats {
//   total_applications: number;
//   applications_this_month: number;
//   interview_rate: number;
//   offer_rate: number;
//   last_updated: string;
// }

// export interface CreateApplicationData {
//   company_name: string;
//   job_title: string;
//   job_posting_url?: string;
//   location?: string;
//   salary_range?: string;
//   application_date?: string;
//   status?: ApplicationStatus;
//   notes?: string;
//   resume_url?: string;
//   cover_letter_url?: string;
//   resume_content?: string;
//   cover_letter_content?: string;
// }

// export interface AnalyticsData {
//   date: string;
//   applications_count: number;
//   interviews_count: number;
//   offers_count: number;
// }

// // ------------------ NEW TYPES FOR JOB SEARCH ------------------

// export interface Job {
//   id: number;
//   title: string;
//   company: string;
//   location: string;
//   salary_min: number;
//   salary_max: number;
//   link: string;
//   source: string;
//   posted_at: string;
//   fetched_at: string;
// }

// export interface JobFilter {
//   id: number;
//   user_uid: string;
//   keywords: string[];
//   locations: string[];
//   salary_min: number;
//   remote_only: boolean;
//   providers: string[];
//   created_at: string;
//   updated_at: string;
// }

// export interface CreateJobFilterData {
//   keywords: string[];
//   locations: string[];
//   salary_min?: number;
//   remote_only?: boolean;
//   providers?: string[];
// }


// // ------------------ API FUNCTIONS ------------------

// export const applicationAPI = {
//   getAll: () => api.get<Application[]>('/applications/'),
//   getById: (id: number) => api.get<Application>(`/applications/${id}/`),
//   create: (data: CreateApplicationData) => api.post<Application>('/applications/', data),
//   update: (id: number, data: Partial<Application>) => api.patch<Application>(`/applications/${id}/`, data),
//   delete: (id: number) => api.delete(`/applications/${id}/`),
//   updateStatus: (id: number, status: ApplicationStatus) => 
//     api.patch<Application>(`/applications/${id}/status/`, { status }),

//   addTimelineEvent: (
//     id: number,
//     data: { event_type: string; title: string; description?: string; date: string; completed?: boolean }
//   ) => api.post<TimelineEvent>(`/applications/${id}/timeline/`, data),

//   getTimelineEvents: (id: number) => api.get<TimelineEvent[]>(`/applications/${id}/timeline/events/`),

//   updateTimelineEvent: (appId: number, eventId: number, data: Partial<TimelineEvent>) =>
//     api.patch<TimelineEvent>(`/applications/${appId}/timeline/${eventId}/`, data),

//   deleteTimelineEvent: (appId: number, eventId: number) =>
//     api.delete(`/applications/${appId}/timeline/${eventId}/`),
// };

// export const statsAPI = {
//   getDashboard: () => api.get<DashboardStats>('/stats/dashboard/'),
//   getAnalytics: (period: string = '30d') => api.get<AnalyticsData[]>(`/stats/analytics/?period=${period}`),
// };

// export const filesAPI = {
//   uploadResume: (file: File) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     return api.post('/files/resume/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
//   },
//   uploadCoverLetter: (file: File) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     return api.post('/files/cover-letter/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
//   },
//   getFileContent: (url: string) => api.get('/file-content/', { params: { url } }),
// };

// // ------------------ NEW JOB SEARCH API FUNCTIONS ------------------

// export const jobAPI = {
//   // Get jobs with optional search filters
//   getAll: (params?: { q?: string; loc?: string }) => 
//     api.get<Job[]>('/applications/jobs/', { params }),
  
//   // Job filters management
//   getFilters: () => api.get<JobFilter[]>('/applications/filters/'),
//   getFilter: (id: number) => api.get<JobFilter>(`/applications/filters/${id}/`),
//   createFilter: (data: CreateJobFilterData) => api.post<JobFilter>('/applications/filters/', data),
//   updateFilter: (id: number, data: Partial<JobFilter>) => 
//     api.patch<JobFilter>(`/applications/filters/${id}/`, data),
//   deleteFilter: (id: number) => api.delete(`/applications/filters/${id}/`),
  
//   // Trigger immediate job fetch
//   triggerFetch: () => api.post('/applications/fetch-now/'),
// };

// export default api;

// https://job-tracker-backend-ztii.onrender.com

import axios from 'axios';
import { getAuth } from "firebase/auth";

// Base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  '/ https://job-tracker-backend-ztii.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ------------------ INTERCEPTORS ------------------

api.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      config.headers['X-User-UID'] = user.uid;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      'An error occurred';
    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// ------------------ TYPES ------------------

export type ApplicationStatus = 
  | 'saved'
  | 'applied'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export interface TimelineEvent {
  id: number;
  event_type: string;
  title: string;
  description?: string;
  date: string;
  completed: boolean;
  created_at: string;
}

export interface EmailLog {
  id: number;
  application: number;
  user_uid: string;
  email_id: string;
  thread_id?: string;
  sender_email: string;
  sender_name?: string;
  subject: string;
  snippet?: string;
  received_date: string;
  classification: string;
  confidence_score: number;
  ai_analysis: any;
  suggested_status?: string;
  processed: boolean;
  processed_at?: string;
  status_updated: boolean;
  timeline_created: boolean;
  user_reviewed: boolean;
  created_at: string;
}

export interface Application {
  id: number;
  user_uid: string;
  company_name: string;
  job_title: string;
  job_posting_url?: string;
  location?: string;
  salary_range?: string;
  application_date: string;
  status: ApplicationStatus;
  notes?: string;
  resume?: string;
  cover_letter?: string;
  resume_url?: string;
  cover_letter_url?: string;
  resume_content?: string;
  cover_letter_content?: string;
  timeline_events?: TimelineEvent[];
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_applications: number;
  applications_this_month: number;
  interview_rate: number;
  offer_rate: number;
  last_updated: string;
}

export interface CreateApplicationData {
  company_name: string;
  job_title: string;
  job_posting_url?: string;
  location?: string;
  salary_range?: string;
  application_date?: string;
  status?: ApplicationStatus;
  notes?: string;
  resume_url?: string;
  cover_letter_url?: string;
  resume_content?: string;
  cover_letter_content?: string;
}

export interface AnalyticsData {
  date: string;
  applications_count: number;
  interviews_count: number;
  offers_count: number;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary_min: number;
  salary_max: number;
  link: string;
  source: string;
  posted_at: string;
  fetched_at: string;
}

export interface JobFilter {
  id: number;
  user_uid: string;
  keywords: string[];
  locations: string[];
  salary_min: number;
  remote_only: boolean;
  providers: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateJobFilterData {
  keywords: string[];
  locations: string[];
  salary_min?: number;
  remote_only?: boolean;
  providers?: string[];
}

export interface UserEmailSettings {
  connected_email: string | undefined;
  email_tracking_enabled: boolean;
  gmail_connected: boolean;
  auto_process_emails: boolean;
  last_email_check: string | null;
}

// ------------------ API FUNCTIONS ------------------

export const applicationAPI = {
  getAll: () => api.get<Application[]>('/applications/'),
  getById: (id: number) => api.get<Application>(`/applications/${id}/`),
  create: (data: CreateApplicationData) => api.post<Application>('/applications/', data),
  update: (id: number, data: Partial<Application>) => api.patch<Application>(`/applications/${id}/`, data),
  delete: (id: number) => api.delete(`/applications/${id}/`),
  updateStatus: (id: number, status: ApplicationStatus) => 
    api.patch<Application>(`/applications/${id}/status/`, { status }),

  addTimelineEvent: (
    id: number,
    data: { event_type: string; title: string; description?: string; date: string; completed?: boolean }
  ) => api.post<TimelineEvent>(`/applications/${id}/timeline/`, data),

  getTimelineEvents: (id: number) => api.get<TimelineEvent[]>(`/applications/${id}/timeline/events/`),

  updateTimelineEvent: (appId: number, eventId: number, data: Partial<TimelineEvent>) =>
    api.patch<TimelineEvent>(`/applications/${appId}/timeline/${eventId}/`, data),

  deleteTimelineEvent: (appId: number, eventId: number) =>
    api.delete(`/applications/${appId}/timeline/${eventId}/`),

  getEmailLogs: (applicationId: number) => 
    api.get<EmailLog[]>(`/applications/${applicationId}/email-logs/`),

  processEmails: () => api.post('/applications/email/process/'),
};

export const statsAPI = {
  getDashboard: () => api.get<DashboardStats>('/stats/dashboard/'),
  getAnalytics: (period: string = '30d') => api.get<AnalyticsData[]>(`/stats/analytics/?period=${period}`),
};

export const filesAPI = {
  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/resume/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  uploadCoverLetter: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/cover-letter/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getFileContent: (url: string) => api.get('/file-content/', { params: { url } }),
};

export const jobAPI = {
  getAll: (params?: { q?: string; loc?: string }) => 
    api.get<Job[]>('/applications/jobs/', { params }),
  
  getFilters: () => api.get<JobFilter[]>('/applications/filters/'),
  getFilter: (id: number) => api.get<JobFilter>(`/applications/filters/${id}/`),
  createFilter: (data: CreateJobFilterData) => api.post<JobFilter>('/applications/filters/', data),
  updateFilter: (id: number, data: Partial<JobFilter>) => 
    api.patch<JobFilter>(`/applications/filters/${id}/`, data),
  deleteFilter: (id: number) => api.delete(`/applications/filters/${id}/`),
  
  triggerFetch: () => api.post('/applications/fetch-now/'),
};

export const emailAPI = {
  connect: () => api.get('/applications/email/connect/'),
  disconnect: () => api.post('/applications/email/disconnect/'),
  process: () => api.post('/applications/email/process/'),
  getSettings: () => api.get<UserEmailSettings>('/applications/email/settings/'),
  updateSettings: (data: Partial<UserEmailSettings>) => 
    api.patch<UserEmailSettings>('/applications/email/settings/', data),
};

export default api;