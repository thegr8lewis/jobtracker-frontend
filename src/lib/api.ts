
// import axios from 'axios';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ' https://job-tracker-backend-ztii.onrender.com/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     // You might want to add auth token here if needed
//     // const token = localStorage.getItem('token');
//     // if (token) {
//     //   config.headers.Authorization = `Bearer ${token}`;
//     // }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const message = error.response?.data?.message || 
//                    error.response?.data?.detail || 
//                    error.message || 
//                    'An error occurred';
//     return Promise.reject({ 
//       message, 
//       status: error.response?.status,
//       data: error.response?.data 
//     });
//   }
// );


// export interface Application {
//   id: number;
//   company_name: string;
//   job_title: string;
//   job_posting_url?: string;
//   location?: string;
//   salary_range?: string;
//   application_date: string;
//   status: 'saved' | 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
//   notes?: string;
//   resume?: string;  // Changed from resume_url
//   cover_letter?: string;  // Changed from cover_letter_url
//   resume_content?: string;
//   cover_letter_content?: string;
//   timeline_events?: TimelineEvent[];
//   created_at: string;
//   updated_at: string;
// }

// export interface TimelineEvent {
//   id: number;
//   event_type: string;
//   title: string;
//   description?: string;
//   date: string;
//   completed: boolean;
//   created_at: string;
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
//   status?: string;
//   notes?: string;
//   resume_url?: string;
//   cover_letter_url?: string;
//   resume_content?: string;
//   cover_letter_content?: string;
// }

// // API functions
// export const applicationAPI = {
//   getAll: () => api.get<Application[]>('/applications/'),
//   getById: (id: number) => api.get<Application>(`/applications/${id}/`),
//   create: (data: CreateApplicationData) => api.post<Application>('/applications/', data),
//   update: (id: number, data: Partial<Application>) => api.patch<Application>(`/applications/${id}/`, data),
//   delete: (id: number) => api.delete(`/applications/${id}/`),
//   updateStatus: (id: number, status: string) => 
//     api.patch<Application>(`/applications/${id}/status/`, { status }),  
//   addTimelineEvent: (id: number, data: { 
//     event_type: string; 
//     title: string; 
//     description?: string; 
//     date: string; 
//     completed?: boolean 
//   }) => api.post<TimelineEvent>(`/applications/${id}/timeline/`, data),
//   getTimelineEvents: (id: number) => api.get<TimelineEvent[]>(`/applications/${id}/timeline/events/`),

//     updateTimelineEvent: (appId: number, eventId: number, data: Partial<TimelineEvent>) =>
//     api.patch<TimelineEvent>(`/applications/${appId}/timeline/${eventId}/`, data),
//   deleteTimelineEvent: (appId: number, eventId: number) =>
//     api.delete(`/applications/${appId}/timeline/${eventId}/`),
// };



// export const statsAPI = {
//   getDashboard: () => api.get<DashboardStats>('/stats/dashboard/'),
//   getAnalytics: (period: string = '30d') => 
//     api.get<AnalyticsData[]>(`/stats/analytics/?period=${period}`),
// };

// export const filesAPI = {
//   uploadResume: (file: File) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     return api.post('/files/resume/', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//   },
//   uploadCoverLetter: (file: File) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     return api.post('/files/cover-letter/', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//   },
//   getFileContent: (url: string) => api.get('/file-content/', { params: { url } }),
// };

// export default api;




import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://job-tracker-backend-ztii.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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

export interface TimelineEvent {
  id: number;
  event_type: string;
  title: string;
  description?: string;
  date: string;
  completed: boolean;
  created_at: string;
}

export interface Application {
  id: number;
  company_name: string;
  job_title: string;
  job_posting_url?: string;
  location?: string;
  salary_range?: string;
  application_date: string;
  status: 'saved' | 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  notes?: string;
  resume?: string;
  cover_letter?: string;
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
  status?: string;
  notes?: string;
  resume_url?: string;
  cover_letter_url?: string;
  resume_content?: string;
  cover_letter_content?: string;
}

export interface AnalyticsData {
  date: string;
  total_applications: number;
  interviews: number;
  offers: number;
  // Add any other fields your analytics endpoint returns
}

// ------------------ API FUNCTIONS ------------------

export const applicationAPI = {
  getAll: () => api.get<Application[]>('/applications/'),
  getById: (id: number) => api.get<Application>(`/applications/${id}/`),
  create: (data: CreateApplicationData) => api.post<Application>('/applications/', data),
  update: (id: number, data: Partial<Application>) => api.patch<Application>(`/applications/${id}/`, data),
  delete: (id: number) => api.delete(`/applications/${id}/`),
  updateStatus: (id: number, status: string) => api.patch<Application>(`/applications/${id}/status/`, { status }),

  addTimelineEvent: (
    id: number,
    data: { event_type: string; title: string; description?: string; date: string; completed?: boolean }
  ) => api.post<TimelineEvent>(`/applications/${id}/timeline/`, data),

  getTimelineEvents: (id: number) => api.get<TimelineEvent[]>(`/applications/${id}/timeline/events/`),

  updateTimelineEvent: (appId: number, eventId: number, data: Partial<TimelineEvent>) =>
    api.patch<TimelineEvent>(`/applications/${appId}/timeline/${eventId}/`, data),

  deleteTimelineEvent: (appId: number, eventId: number) =>
    api.delete(`/applications/${appId}/timeline/${eventId}/`),
};

export const statsAPI = {
  getDashboard: () => api.get<DashboardStats>('/stats/dashboard/'),
  getAnalytics: (period: string = '30d') => api.get<AnalyticsData[]>(`/stats/analytics/?period=${period}`),
};

export const filesAPI = {
  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/resume/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadCoverLetter: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/cover-letter/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getFileContent: (url: string) => api.get('/file-content/', { params: { url } }),
};

export default api;
