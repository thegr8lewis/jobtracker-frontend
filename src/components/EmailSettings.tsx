// import React, { useState, useEffect } from 'react';
// import { FiMail, FiLink, FiCheckCircle, FiXCircle, FiLoader, FiCheck } from 'react-icons/fi';
// import { useAuth } from '../lib/auth-context';
// import api from '../lib/api';

// interface EmailSettingsProps {
//   onConnected?: () => void;
//   onDisconnected?: () => void;
// }

// interface EmailSettings {
//   gmail_connected: boolean;
//   connected_email?: string;
// }

// const EmailSettings: React.FC<EmailSettingsProps> = ({ onConnected, onDisconnected }) => {
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [emailSettings, setEmailSettings] = useState<EmailSettings>({ gmail_connected: false });
//   const [fetchingSettings, setFetchingSettings] = useState(true);

//   // Helper function to automatically include X-User-UID
//   const apiWithUid = (method: 'get' | 'post', url: string, data?: any) => {
//     if (!user) throw new Error('User not logged in');
//     const config = { headers: { 'X-User-UID': user.uid } };
//     return method === 'get' ? api.get(url, config) : api.post(url, data || {}, config);
//   };

//   // Fetch email settings on mount
//   useEffect(() => {
//     const fetchEmailSettings = async () => {
//       if (!user) return;

//       try {
//         const response = await apiWithUid('get', '/applications/email/settings/');
//         setEmailSettings(response.data);
//       } catch (err) {
//         console.error('Failed to fetch email settings:', err);
//       } finally {
//         setFetchingSettings(false);
//       }
//     };

//     fetchEmailSettings();
//   }, [user]);

//   const connectGmail = async () => {
//     if (!user) return;

//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const response = await apiWithUid('get', '/applications/email/connect/');
//       const { auth_url } = response.data;

//       const authWindow = window.open(auth_url, 'gmail_auth', 'width=600,height=700');

//       const checkWindow = setInterval(async () => {
//         if (authWindow?.closed) {
//           clearInterval(checkWindow);
//           try {
//             const res = await apiWithUid('get', '/applications/email/settings/');
//             if (res.data.gmail_connected) {
//               setEmailSettings(res.data);
//               setSuccess('Gmail connected successfully!');
//               onConnected?.();
//             } else {
//               setError('Failed to connect Gmail. Please try again.');
//             }
//           } catch {
//             setError('Failed to verify Gmail connection.');
//           }
//         }
//       }, 1000);

//     } catch (err: any) {
//       setError(err.message || 'Failed to connect Gmail');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const disconnectGmail = async () => {
//     if (!user) return;

//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       await apiWithUid('post', '/applications/email/disconnect/');
//       setEmailSettings({ gmail_connected: false });
//       setSuccess('Gmail disconnected successfully');
//       onDisconnected?.();
//     } catch (err: any) {
//       setError(err.message || 'Failed to disconnect Gmail');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const processEmails = async () => {
//     if (!user) return;

//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       await apiWithUid('post', '/applications/email/process/');
//       setSuccess('Email processing started! Check your applications for updates.');
//     } catch (err: any) {
//       setError(err.message || 'Failed to process emails');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetchingSettings) {
//     return (
//       <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
//         <div className="flex items-center justify-center py-8">
//           <FiLoader className="animate-spin w-6 h-6 text-purple-400" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
//       <div className="flex items-center gap-3 mb-6">
//         <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
//           <FiMail className="text-blue-400 w-5 h-5" />
//         </div>
//         <div className="flex-1">
//           <h3 className="text-xl font-semibold text-white">Email Integration</h3>
//           <p className="text-gray-400 text-sm">Connect Gmail to automatically track job application updates</p>
//         </div>
//         {emailSettings.gmail_connected && (
//           <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full">
//             <FiCheck className="w-4 h-4 text-green-400" />
//             <span className="text-green-400 text-sm font-medium">Connected</span>
//           </div>
//         )}
//       </div>

//       {error && (
//         <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-xl mb-4 flex items-center gap-2">
//           <FiXCircle className="w-4 h-4" />
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-3 rounded-xl mb-4 flex items-center gap-2">
//           <FiCheckCircle className="w-4 h-4" />
//           {success}
//         </div>
//       )}

//       <div className="space-y-4">
//         {/* Gmail Connection Status */}
//         <div className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-5">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h4 className="text-white font-semibold mb-1">Gmail Connection</h4>
//               {emailSettings.gmail_connected ? (
//                 <div className="space-y-1">
//                   <p className="text-gray-400 text-sm">
//                     Your Gmail account is connected and monitoring job-related emails
//                   </p>
//                   {emailSettings.connected_email && (
//                     <p className="text-blue-400 text-sm font-medium">
//                       Connected as: {emailSettings.connected_email}
//                     </p>
//                   )}
//                 </div>
//               ) : (
//                 <p className="text-gray-400 text-sm">
//                   Connect your Gmail to automatically detect job application updates, interview invitations, and rejection emails
//                 </p>
//               )}
//             </div>
//             <div className="flex items-center gap-2">
//               <div className={`w-3 h-3 rounded-full ${emailSettings.gmail_connected ? 'bg-green-400' : 'bg-gray-500'}`} />
//               <span className={`text-sm font-medium ${emailSettings.gmail_connected ? 'text-green-400' : 'text-gray-400'}`}>
//                 {emailSettings.gmail_connected ? 'Connected' : 'Disconnected'}
//               </span>
//             </div>
//           </div>
          
//           <div className="flex gap-3">
//             {!emailSettings.gmail_connected ? (
//               <button
//                 onClick={connectGmail}
//                 disabled={loading}
//                 className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-600/50 disabled:to-blue-700/50 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-lg shadow-blue-600/25"
//               >
//                 {loading ? <FiLoader className="animate-spin w-4 h-4" /> : <FiLink className="w-4 h-4" />}
//                 Connect Gmail
//               </button>
//             ) : (
//               <button
//                 onClick={disconnectGmail}
//                 disabled={loading}
//                 className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-red-600/50 disabled:to-red-700/50 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-lg shadow-red-600/25"
//               >
//                 {loading ? <FiLoader className="animate-spin w-4 h-4" /> : <FiXCircle className="w-4 h-4" />}
//                 Disconnect Gmail
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Manual Processing - Only show if connected */}
//         {emailSettings.gmail_connected && (
//           <div className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-5">
//             <h4 className="text-white font-semibold mb-2">Manual Sync</h4>
//             <p className="text-gray-400 text-sm mb-4">
//               Manually trigger email processing to check for new job-related emails immediately
//             </p>
            
//             <button
//               onClick={processEmails}
//               disabled={loading}
//               className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-purple-600/50 disabled:to-purple-700/50 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-lg shadow-purple-600/25"
//             >
//               {loading ? <FiLoader className="animate-spin w-4 h-4" /> : <FiMail className="w-4 h-4" />}
//               Sync Emails Now
//             </button>
//           </div>
//         )}

//         {/* How it works */}
//         <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-5">
//           <h4 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
//             <div className="w-2 h-2 bg-blue-400 rounded-full" />
//             How Email Integration Works
//           </h4>
//           <ul className="text-blue-300/90 text-sm space-y-2">
//             <li className="flex items-start gap-2">
//               <div className="w-1.5 h-1.5 bg-blue-400/60 rounded-full mt-2 flex-shrink-0" />
//               Securely connects to your Gmail using OAuth authentication
//             </li>
//             <li className="flex items-start gap-2">
//               <div className="w-1.5 h-1.5 bg-blue-400/60 rounded-full mt-2 flex-shrink-0" />
//               Intelligently scans for emails from companies in your application list
//             </li>
//             <li className="flex items-start gap-2">
//               <div className="w-1.5 h-1.5 bg-blue-400/60 rounded-full mt-2 flex-shrink-0" />
//               Uses AI to detect interview invitations, rejections, and job offers
//             </li>
//             <li className="flex items-start gap-2">
//               <div className="w-1.5 h-1.5 bg-blue-400/60 rounded-full mt-2 flex-shrink-0" />
//               Automatically updates application status and creates timeline events
//             </li>
//             <li className="flex items-start gap-2">
//               <div className="w-1.5 h-1.5 bg-blue-400/60 rounded-full mt-2 flex-shrink-0" />
//               Your data remains private and is never stored on our servers
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmailSettings;


import React, { useState, useEffect } from 'react';
import {
  FiMail,
  FiLink,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiMaximize2,
  FiX,
  FiRefreshCw,
  FiClock,
  FiSearch,
  FiExternalLink,
  FiEye,
  FiEyeOff,
  FiAlertTriangle, FiFileText
} from 'react-icons/fi';
import { useAuth } from '../lib/auth-context';
import api from '../lib/api';

interface EmailSettingsProps {
  onConnected?: () => void;
  onDisconnected?: () => void;
}

interface EmailSettings {
  gmail_connected: boolean;
  connected_email?: string;
}

interface EmailLog {
  id: number;
  sender_email: string;
  sender_name: string;
  subject: string;
  snippet: string;
  full_content?: string;
  date?: string;
  application_id?: number;
  status?: string;
  is_read?: boolean;
  confidence_score?: number;
  classification?: string;
}

const EmailSettings: React.FC<EmailSettingsProps> = ({ onConnected, onDisconnected }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({ gmail_connected: false });
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [fetchingSettings, setFetchingSettings] = useState(true);
  const [logsExpanded, setLogsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [expandedEmailId, setExpandedEmailId] = useState<number | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Fetch email settings on mount
  useEffect(() => {
    const fetchEmailSettings = async () => {
      if (!user) return;

      try {
        const res = await api.get('/applications/email/settings/', {
          headers: { 'X-User-UID': user.uid },
        });
        setEmailSettings(res.data);
        if (res.data.gmail_connected) {
          fetchEmailLogs();
        }
      } catch (err) {
        console.error('Failed to fetch email settings:', err);
        setError('Failed to load email settings');
      } finally {
        setFetchingSettings(false);
      }
    };

    fetchEmailSettings();
  }, [user]);

  // Auto-refresh emails
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (autoRefreshEnabled && emailSettings.gmail_connected) {
      intervalId = setInterval(() => {
        fetchEmailLogs();
      }, 300000); // Refresh every 5 minutes
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefreshEnabled, emailSettings.gmail_connected]);

  const fetchEmailLogs = async () => {
    if (!user || !emailSettings.gmail_connected) return;

    try {
      const res = await api.get('/applications/email/logs/', {
        headers: { 'X-User-UID': user.uid },
      });
      setEmailLogs(res.data || []);
      setLastChecked(new Date());
    } catch (err) {
      console.error('Failed to fetch email logs:', err);
      setError('Failed to load email logs');
    }
  };

  const fetchEmailContent = async (emailId: number) => {
    try {
      const res = await api.get(`/applications/email/logs/${emailId}/`, {
        headers: { 'X-User-UID': user?.uid },
      });
      setEmailLogs(prevLogs =>
        prevLogs.map(log =>
          log.id === emailId ? { ...log, full_content: res.data.full_content } : log
        )
      );
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(prev => (prev ? { ...prev, full_content: res.data.full_content } : null));
      }
    } catch (err) {
      console.error('Failed to fetch email content:', err);
      setError('Failed to load email content');
    }
  };

  const connectGmail = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.get('/applications/email/connect/', {
        headers: { 'X-User-UID': user.uid },
      });
      const { auth_url } = res.data;

      const authWindow = window.open(auth_url, 'gmail_auth', 'width=600,height=700');
      const checkWindow = setInterval(async () => {
        if (authWindow?.closed) {
          clearInterval(checkWindow);
          try {
            const res2 = await api.get('/applications/email/settings/', {
              headers: { 'X-User-UID': user.uid },
            });
            if (res2.data.gmail_connected) {
              setEmailSettings(res2.data);
              setSuccess('Gmail connected successfully! Email tracking is now active.');
              onConnected?.();
              fetchEmailLogs();
            } else {
              setError('Gmail connection was cancelled or failed. Please try again.');
            }
          } catch {
            setError('Failed to verify Gmail connection. Please try again.');
          }
        }
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to connect Gmail');
    } finally {
      setLoading(false);
    }
  };

  const disconnectGmail = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post('/applications/email/disconnect/', {}, {
        headers: { 'X-User-UID': user.uid },
      });
      setEmailSettings({ gmail_connected: false });
      setEmailLogs([]);
      setSuccess('Gmail disconnected successfully. Email tracking has been disabled.');
      onDisconnected?.();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to disconnect Gmail');
    } finally {
      setLoading(false);
    }
  };

  const processEmails = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post('/applications/email/process/', {}, {
        headers: { 'X-User-UID': user.uid },
      });
      setSuccess('Email sync completed! Found new job-related emails.');
      await fetchEmailLogs();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to sync emails');
    } finally {
      setLoading(false);
    }
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

  const getStatusBadge = (status?: string) => {
    const statusColors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      accepted: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
      interview: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      default: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    const colorClass = statusColors[status as keyof typeof statusColors] || statusColors.default;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colorClass}`}>
        {status || 'Unknown'}
      </span>
    );
  };

  const getClassificationBadge = (classification?: string) => {
    const classificationColors = {
      INTERVIEW: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      OFFER: 'bg-green-500/20 text-green-400 border-green-500/30',
      REJECTION: 'bg-red-500/20 text-red-400 border-red-500/30',
      FOLLOW_UP: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      APPLICATION_RECEIVED: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      default: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    const colorClass = classificationColors[classification as keyof typeof classificationColors] || classificationColors.default;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colorClass}`}>
        {classification || 'UNCLASSIFIED'}
      </span>
    );
  };

  const toggleEmailExpansion = (emailId: number) => {
    if (expandedEmailId === emailId) {
      setExpandedEmailId(null);
    } else {
      setExpandedEmailId(emailId);
      const email = emailLogs.find(log => log.id === emailId);
      if (email && !email.full_content) {
        fetchEmailContent(emailId);
      }
    }
  };

  const openEmailDetails = (email: EmailLog) => {
    setSelectedEmail(email);
    setShowDetailModal(true);
    if (!email.full_content) {
      fetchEmailContent(email.id);
    }
  };

  const filteredLogs = emailLogs.filter(log => {
    const matchesSearch =
      log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.sender_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || log.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
      case 'sender':
        return a.sender_name.localeCompare(b.sender_name);
      case 'subject':
        return a.subject.localeCompare(b.subject);
      default:
        return 0;
    }
  });

  if (fetchingSettings) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 flex justify-center py-10">
        <div className="flex items-center gap-3">
          <FiLoader className="animate-spin w-6 h-6 text-purple-400" />
          <span className="text-gray-300">Loading email settings...</span>
        </div>
      </div>
    );
  }

  const EmailLogList = ({ isModal = false }: { isModal?: boolean }) => (
    <div className={`space-y-4 ${isModal ? 'max-h-[60vh] overflow-y-auto' : 'max-h-72 overflow-y-auto'}`}>
      {isModal && (
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-64 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="interview">Interview</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
            >
              <option value="date">Sort by Date</option>
              <option value="sender">Sort by Sender</option>
              <option value="subject">Sort by Subject</option>
            </select>
          </div>
          <div className="flex gap-4 text-sm text-gray-400">
            <span>Total: {emailLogs.length}</span>
            <span>Filtered: {sortedLogs.length}</span>
            {lastChecked && <span>Last checked: {lastChecked.toLocaleTimeString()}</span>}
          </div>
        </div>
      )}
      {sortedLogs.length === 0 ? (
        <div className="text-center py-8">
          <FiMail className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            {emailLogs.length === 0 ? 'No email logs available yet.' : 'No emails match your search criteria.'}
          </p>
          {emailLogs.length === 0 && emailSettings.gmail_connected && (
            <p className="text-gray-500 text-xs mt-2">
              Try syncing your emails or check back later for updates.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedLogs.map((log) => (
            <div
              key={log.id}
              className={`p-4 bg-gray-900/40 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200 ${
                !log.is_read ? 'border-l-4 border-l-purple-500' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {log.sender_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-300 truncate">{log.sender_name}</p>
                    <p className="text-xs text-gray-500 truncate">{log.sender_email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {log.classification && getClassificationBadge(log.classification)}
                  {log.status && getStatusBadge(log.status)}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FiClock className="w-3 h-3" />
                    {formatDate(log.date)}
                  </div>
                  <button
                    onClick={() => openEmailDetails(log)}
                    className="p-1.5 hover:bg-gray-800/50 rounded-lg transition-colors"
                    title="View detailed email"
                  >
                    <FiMaximize2 className="w-4 h-4 text-gray-400 hover:text-purple-400" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-medium text-sm line-clamp-2">{log.subject}</h4>
                {expandedEmailId === log.id ? (
                  <div className="text-gray-400 text-xs bg-gray-800/50 p-3 rounded-lg">
                    {log.full_content ? (
                      <div dangerouslySetInnerHTML={{ __html: log.full_content }} />
                    ) : (
                      <div className="flex items-center justify-center py-4">
                        <FiLoader className="animate-spin w-4 h-4 mr-2" />
                        Loading content...
                      </div>
                    )}
                    <button
                      onClick={() => toggleEmailExpansion(log.id)}
                      className="mt-3 flex items-center gap-1 text-purple-400 hover:text-purple-300 text-xs"
                    >
                      <FiEyeOff className="w-3 h-3" />
                      Hide content
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-400 text-xs line-clamp-2">{log.snippet}</p>
                    <button
                      onClick={() => toggleEmailExpansion(log.id)}
                      className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-xs"
                    >
                      <FiEye className="w-3 h-3" />
                      View full content
                    </button>
                  </>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700/30 flex justify-between items-center">
                {log.application_id && (
                  <div className="flex items-center gap-2">
                    <FiFileText className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-purple-400">Application #{log.application_id}</span>
                    <FiExternalLink className="w-3 h-3 text-gray-500" />
                  </div>
                )}
                {log.confidence_score !== undefined && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FiAlertTriangle className="w-3 h-3" />
                    Confidence: {formatConfidenceScore(log.confidence_score)}
                  </div>
                )}
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
            onClick={() => setShowDetailModal(false)}
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
                  {selectedEmail.sender_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{selectedEmail.sender_name}</p>
                  <p className="text-gray-400 text-sm">{selectedEmail.sender_email}</p>
                </div>
              </div>
              <div className="border-t border-gray-700/30 pt-4">
                <h3 className="text-white font-semibold text-lg">{selectedEmail.subject}</h3>
                <div className="flex items-center gap-4 mt-2">
                  {selectedEmail.classification && getClassificationBadge(selectedEmail.classification)}
                  {selectedEmail.status && getStatusBadge(selectedEmail.status)}
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <FiClock className="w-4 h-4" />
                    {formatDate(selectedEmail.date)}
                  </div>
                </div>
              </div>
              {selectedEmail.application_id && (
                <div className="flex items-center gap-2 text-sm text-purple-400">
                  <FiFileText className="w-4 h-4" />
                  Application #{selectedEmail.application_id}
                  <FiExternalLink className="w-4 h-4 text-gray-500" />
                </div>
              )}
              {selectedEmail.confidence_score !== undefined && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <FiAlertTriangle className="w-4 h-4" />
                  Confidence: {formatConfidenceScore(selectedEmail.confidence_score)}
                </div>
              )}
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg text-gray-300 text-sm">
                {selectedEmail.full_content ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedEmail.full_content }} />
                ) : (
                  <div className="flex items-center justify-center py-4">
                    <FiLoader className="animate-spin w-5 h-5 mr-2" />
                    Loading content...
                  </div>
                )}
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
    <>
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <FiMail className="text-white w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white">Email Integration</h3>
            <p className="text-gray-400 text-sm">Automatically track job application updates from your Gmail</p>
          </div>
          {emailSettings.gmail_connected && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-medium">Connected</span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-start gap-3">
            <FiXCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Connection Error</p>
              <p className="text-sm text-red-300 mt-1">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl flex items-start gap-3">
            <FiCheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Success</p>
              <p className="text-sm text-green-300 mt-1">{success}</p>
            </div>
          </div>
        )}

        <div className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-white font-semibold mb-2">Gmail Connection</h4>
              {emailSettings.gmail_connected ? (
                <div className="space-y-1">
                  <p className="text-gray-300 text-sm">
                    📧 Connected as: <span className="text-blue-400 font-medium">{emailSettings.connected_email}</span>
                  </p>
                  <p className="text-gray-400 text-xs">Automatically monitoring for job application updates</p>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  Connect your Gmail to automatically detect job application emails and updates
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  emailSettings.gmail_connected ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-gray-500'
                }`}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {!emailSettings.gmail_connected ? (
              <button
                onClick={connectGmail}
                disabled={loading}
                className="flex items-center gap-2 px-6 Flowerpy-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl text-sm font-medium shadow-lg transition-all duration-200"
              >
                {loading ? <FiLoader className="animate-spin w-4 h-4" /> : <FiLink className="w-4 h-4" />}
                Connect Gmail
              </button>
            ) : (
              <button
                onClick={disconnectGmail}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl text-sm font-medium shadow-lg transition-all duration-200"
              >
                {loading ? <FiLoader className="animate-spin w-4 h-4" /> : <FiXCircle className="w-4 h-4" />}
                Disconnect Gmail
              </button>
            )}
          </div>
        </div>

        {emailSettings.gmail_connected && (
          <div className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h4 className="text-white font-semibold mb-1">Email Management</h4>
                <p className="text-gray-400 text-sm">Control how and when your emails are processed</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={processEmails}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl text-sm font-medium shadow-lg transition-all duration-200"
                >
                  {loading ? <FiLoader className="animate-spin w-4 h-4" /> : <FiRefreshCw className="w-4 h-4" />}
                  Sync Now
                </button>
                <button
                  onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                    autoRefreshEnabled
                      ? 'bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30'
                      : 'bg-gray-600/20 text-gray-400 border-gray-600/30 hover:bg-gray-600/30'
                  }`}
                >
                  {autoRefreshEnabled ? (
                    <>
                      <FiCheckCircle className="w-4 h-4" />
                      Auto Refresh On
                    </>
                  ) : (
                    <>
                      <FiXCircle className="w-4 h-4" />
                      Auto Refresh Off
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              {lastChecked ? (
                <>
                  <FiClock className="w-3 h-3" />
                  Last checked: {lastChecked.toLocaleTimeString()}
                </>
              ) : (
                'Not checked yet'
              )}
            </div>
          </div>
        )}

        {emailSettings.gmail_connected && (
          <div className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setLogsExpanded(!logsExpanded)}
              >
                <h4 className="text-white font-semibold">Recent Email Logs</h4>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full">
                  {emailLogs.length}
                </span>
                {logsExpanded ? (
                  <FiChevronUp className="w-5 h-5 text-gray-300" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-300" />
                )}
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-all duration-200"
              >
                <FiMaximize2 className="w-4 h-4" />
                View All
              </button>
            </div>
            {logsExpanded && <EmailLogList />}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FiMail className="text-white w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Email Tracker</h2>
                  <p className="text-gray-400 text-sm">All your job application emails in one place</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-6">
              <EmailLogList isModal={true} />
            </div>
          </div>
        </div>
      )}

      {showDetailModal && <EmailDetailModal />}
    </>
  );
};

export default EmailSettings;