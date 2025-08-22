// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { useRouter } from "next/router"
// import Layout from "../components/Layout"
// import { applicationAPI, type Application, type ApplicationStatus } from "../lib/api"
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
//   FiX,
//   FiEdit3,
//   FiTrash2,
//   FiArrowLeft,
// } from "react-icons/fi"

// const statusColumns: {
//   key: ApplicationStatus
//   label: string
//   description: string
//   iconColor: string
//   bgColor: string
//   borderColor: string
//   glowColor: string
// }[] = [
//   {
//     key: "saved",
//     label: "Saved",
//     description: "Jobs you want to apply to",
//     iconColor: "text-amber-400",
//     bgColor: "bg-gradient-to-br from-amber-500/10 to-yellow-500/5",
//     borderColor: "border-amber-500/20",
//     glowColor: "shadow-amber-500/10",
//   },
//   {
//     key: "applied",
//     label: "Applied",
//     description: "Applications submitted",
//     iconColor: "text-blue-400",
//     bgColor: "bg-gradient-to-br from-blue-500/10 to-cyan-500/5",
//     borderColor: "border-blue-500/20",
//     glowColor: "shadow-blue-500/10",
//   },
//   {
//     key: "interview",
//     label: "Interview",
//     description: "In progress interviews",
//     iconColor: "text-purple-400",
//     bgColor: "bg-gradient-to-br from-purple-500/10 to-fuchsia-500/5",
//     borderColor: "border-purple-500/20",
//     glowColor: "shadow-purple-500/10",
//   },
//   {
//     key: "offer",
//     label: "Offer",
//     description: "Received offers",
//     iconColor: "text-emerald-400",
//     bgColor: "bg-gradient-to-br from-emerald-500/10 to-teal-500/5",
//     borderColor: "border-emerald-500/20",
//     glowColor: "shadow-emerald-500/10",
//   },
//   {
//     key: "rejected",
//     label: "Rejected",
//     description: "Unsuccessful applications",
//     iconColor: "text-rose-400",
//     bgColor: "bg-gradient-to-br from-rose-500/10 to-red-500/5",
//     borderColor: "border-rose-500/20",
//     glowColor: "shadow-rose-500/10",
//   },
//   {
//     key: "withdrawn",
//     label: "Withdrawn",
//     description: "Applications withdrawn",
//     iconColor: "text-slate-400",
//     bgColor: "bg-gradient-to-br from-slate-500/10 to-gray-500/5",
//     borderColor: "border-slate-500/20",
//     glowColor: "shadow-slate-500/10",
//   },
// ]

// const PipelinePage: React.FC = () => {
//   const [applications, setApplications] = useState<Application[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
//   const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)
//   const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | null>(null)
//   const [searchQuery, setSearchQuery] = useState("")
//   const router = useRouter()

//   useEffect(() => {
//     fetchApplications()
//   }, [])

//   const fetchApplications = async () => {
//     try {
//       setLoading(true)
//       setError(null)
//       const response = await applicationAPI.getAll()
//       setApplications(response.data || response)
//     } catch (err: any) {
//       console.error("Error fetching applications:", err)
//       setError(err.response?.data?.message || err.message || "Failed to fetch applications")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleStatusChange = async (applicationId: number, newStatus: ApplicationStatus) => {
//     try {
//       setUpdatingStatus(applicationId)
//       setError(null)

//       let updateResponse
//       try {
//         updateResponse = await applicationAPI.updateStatus(applicationId, newStatus)
//       } catch (firstError) {
//         try {
//           updateResponse = await applicationAPI.update(applicationId, { status: newStatus })
//         } catch (secondError) {
//           updateResponse = await fetch(`/api/applications/${applicationId}`, {
//             method: "PATCH",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ status: newStatus }),
//           })
//           if (!updateResponse.ok) throw new Error(`HTTP error! status: ${updateResponse.status}`)
//         }
//       }
//       await fetchApplications()
//     } catch (err: any) {
//       console.error("Error updating status:", err)
//       setError(err.response?.data?.message || err.message || "Failed to update status")
//     } finally {
//       setUpdatingStatus(null)
//     }
//   }

//   const handleDeleteApplication = async () => {
//     if (!selectedApplication) return
//     try {
//       setError(null)
//       await applicationAPI.delete(selectedApplication.id)
//       await fetchApplications()
//       setDeleteDialogOpen(false)
//     } catch (err: any) {
//       console.error("Error deleting application:", err)
//       setError(err.response?.data?.message || err.message || "Failed to delete application")
//     }
//   }

//   const handleAddApplication = () => router.push("/add-application")
//   const handleJobClick = (applicationId: number) => router.push(`/applications/${applicationId}`)
//   const handleEditApplication = (applicationId: number) => router.push(`/applications/${applicationId}/edit`)

//   const getApplicationsByStatus = (status: ApplicationStatus) =>
//     applications
//       .filter((app) => app.status === status)
//       .filter((app) =>
//         searchQuery
//           ? app.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             app.company_name.toLowerCase().includes(searchQuery.toLowerCase())
//           : true,
//       )

//   const getStatusColor = (status: ApplicationStatus) => {
//     const statusInfo = statusColumns.find((s) => s.key === status)
//     return statusInfo ? `${statusInfo.bgColor} ${statusInfo.borderColor}` : "bg-slate-500/10 border-slate-500/20"
//   }

//   const ApplicationCard: React.FC<{ application: Application; index: number }> = ({ application, index }) => {
//     const statusInfo = statusColumns.find((s) => s.key === application.status)

//     return (
//       <div
//         className={`group relative overflow-hidden rounded-2xl ${statusInfo?.bgColor} backdrop-blur-sm border ${statusInfo?.borderColor} hover:${statusInfo?.glowColor} hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer`}
//         onClick={() => handleJobClick(application.id)}
//       >
//         {/* Animated background gradient */}
//         <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

//         {/* Floating orb effect */}
//         <div
//           className={`absolute -top-8 -right-8 w-16 h-16 rounded-full ${statusInfo?.bgColor} blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-150`}
//         ></div>

//         <div className="relative p-6 space-y-4">
//           {/* Header with status badge */}
//           <div className="flex items-start justify-between">
//             <div className="flex items-center gap-3">
//               <div className={`p-2.5 rounded-xl ${statusInfo?.bgColor} border ${statusInfo?.borderColor} shadow-lg`}>
//                 <FiBriefcase className={`w-5 h-5 ${statusInfo?.iconColor}`} />
//               </div>
//               <div>
//                 <h3 className="font-bold text-white text-lg leading-tight group-hover:text-white/90 transition-colors">
//                   {application.job_title}
//                 </h3>
//                 <p className="text-white/60 text-sm font-medium">{application.company_name}</p>
//               </div>
//             </div>
//             <span
//               className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusInfo?.iconColor} bg-white/10 border border-white/20 backdrop-blur-sm`}
//             >
//               #{index + 1}
//             </span>
//           </div>

//           {/* Details grid */}
//           <div className="grid grid-cols-1 gap-3 text-sm">
//             <div className="flex items-center gap-2 text-white/70">
//               <FiCalendar className="w-4 h-4 text-white/50" />
//               <span>
//                 {new Date(application.application_date).toLocaleDateString("en-US", {
//                   month: "short",
//                   day: "numeric",
//                   year: "numeric",
//                 })}
//               </span>
//             </div>

//             {application.location && (
//               <div className="flex items-center gap-2 text-white/70">
//                 <FiMapPin className="w-4 h-4 text-white/50" />
//                 <span className="truncate">{application.location}</span>
//               </div>
//             )}

//             {application.salary_range && (
//               <div className="flex items-center gap-2 text-white/70">
//                 <FiDollarSign className="w-4 h-4 text-white/50" />
//                 <span className="font-medium">{application.salary_range}</span>
//               </div>
//             )}
//           </div>

//           {/* Action buttons */}
//           <div className="flex items-center justify-between pt-2 border-t border-white/10">
//             <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
//               {application.job_posting_url && (
//                 <button
//                   onClick={() => window.open(application.job_posting_url, "_blank")}
//                   className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200 hover:scale-110"
//                   title="Open job posting"
//                 >
//                   <FiExternalLink className="w-4 h-4" />
//                 </button>
//               )}
//               <button
//                 onClick={() => handleEditApplication(application.id)}
//                 className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200 hover:scale-110"
//                 title="Edit application"
//               >
//                 <FiEdit3 className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => {
//                   setSelectedApplication(application)
//                   setDeleteDialogOpen(true)
//                 }}
//                 className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 hover:scale-110"
//                 title="Delete application"
//               >
//                 <FiTrash2 className="w-4 h-4" />
//               </button>
//             </div>

//             <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
//               {updatingStatus === application.id && <FiLoader className="w-4 h-4 text-white/60 animate-spin" />}
//               <select
//                 value={application.status}
//                 onChange={(e) => handleStatusChange(application.id, e.target.value as ApplicationStatus)}
//                 disabled={updatingStatus === application.id}
//                 className={`bg-white/5 border ${getStatusColor(application.status)} rounded-lg px-3 py-1.5 text-xs font-medium text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm`}
//               >
//                 {statusColumns.map((status) => (
//                   <option key={status.key} value={status.key} className="bg-gray-900 text-white">
//                     {status.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   const StatusDetailView: React.FC<{ applications: Application[]; status: ApplicationStatus }> = ({
//     applications,
//     status,
//   }) => {
//     const statusInfo = statusColumns.find((s) => s.key === status)

//     return (
//       <div className="space-y-8">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setSelectedStatus(null)}
//               className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20"
//             >
//               <FiArrowLeft className="w-4 h-4" />
//               <span className="font-medium">Back to Overview</span>
//             </button>
//             <div className="flex items-center gap-3">
//               <div className={`p-3 rounded-xl ${statusInfo?.bgColor} border ${statusInfo?.borderColor} shadow-lg`}>
//                 <FiBriefcase className={`w-6 h-6 ${statusInfo?.iconColor}`} />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-white">{statusInfo?.label}</h1>
//                 <p className="text-white/60">{statusInfo?.description}</p>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <span
//               className={`px-4 py-2 rounded-xl text-sm font-bold ${statusInfo?.iconColor} ${statusInfo?.bgColor} border ${statusInfo?.borderColor} backdrop-blur-sm`}
//             >
//               {applications.length} {applications.length === 1 ? "application" : "applications"}
//             </span>
//           </div>
//         </div>

//         {/* Applications grid */}
//         {applications.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//             {applications.map((application, index) => (
//               <ApplicationCard key={application.id} application={application} index={index} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-16">
//             <div
//               className={`inline-flex p-4 rounded-2xl ${statusInfo?.bgColor} border ${statusInfo?.borderColor} mb-4`}
//             >
//               <FiBriefcase className={`w-8 h-8 ${statusInfo?.iconColor}`} />
//             </div>
//             <h3 className="text-xl font-semibold text-white mb-2">No applications yet</h3>
//             <p className="text-white/60 mb-6">Start by adding your first application to this status.</p>
//             <button
//               onClick={handleAddApplication}
//               className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200 border border-white/20 hover:border-white/30"
//             >
//               <FiPlus className="w-4 h-4" />
//               Add Application
//             </button>
//           </div>
//         )}
//       </div>
//     )
//   }

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-[60vh]">
//           <div className="relative">
//             <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
//             <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-blue-500 rounded-full animate-spin animate-reverse"></div>
//           </div>
//         </div>
//       </Layout>
//     )
//   }

//   return (
//     <Layout>
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
//         <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
//           {/* Error notification */}
//           {error && (
//             <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 backdrop-blur-sm">
//               <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent"></div>
//               <div className="relative p-4 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 rounded-lg bg-red-500/20">
//                     <FiX className="w-5 h-5 text-red-400" />
//                   </div>
//                   <span className="text-white font-medium">{error}</span>
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

//           {/* Header and search */}
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//             <div>
//               <h1 className="text-4xl font-bold text-white mb-2">Application Pipeline</h1>
//               <p className="text-white/60 text-lg">Track and manage your job applications</p>
//             </div>

//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
//                 <input
//                   type="text"
//                   placeholder="Search applications..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all backdrop-blur-sm w-64"
//                 />
//               </div>

//               <button
//                 onClick={handleAddApplication}
//                 className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5"
//               >
//                 <FiPlus className="w-5 h-5" />
//                 Add Application
//               </button>
//             </div>
//           </div>

//           {/* Main content */}
//           {!selectedStatus ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
//               {statusColumns.map((statusInfo) => {
//                 const columnApplications = getApplicationsByStatus(statusInfo.key)
//                 return (
//                   <div
//                     key={statusInfo.key}
//                     className={`group relative overflow-hidden rounded-2xl ${statusInfo.bgColor} backdrop-blur-sm border ${statusInfo.borderColor} hover:${statusInfo.glowColor} hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer`}
//                     onClick={() => setSelectedStatus(statusInfo.key)}
//                   >
//                     {/* Animated background */}
//                     <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

//                     {/* Floating orb */}
//                     <div
//                       className={`absolute -top-8 -right-8 w-16 h-16 rounded-full ${statusInfo.bgColor} blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-150`}
//                     ></div>

//                     <div className="relative p-6 space-y-4">
//                       <div className="flex items-center justify-between">
//                         <div
//                           className={`p-3 rounded-xl ${statusInfo.bgColor} border ${statusInfo.borderColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}
//                         >
//                           <FiBriefcase className={`w-6 h-6 ${statusInfo.iconColor}`} />
//                         </div>
//                         <span
//                           className={`px-3 py-1.5 rounded-full text-sm font-bold ${statusInfo.iconColor} bg-white/10 border border-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}
//                         >
//                           {columnApplications.length}
//                         </span>
//                       </div>

//                       <div>
//                         <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
//                           {statusInfo.label}
//                         </h3>
//                         <p className="text-white/60 text-sm leading-relaxed">{statusInfo.description}</p>
//                       </div>

//                       <div className="flex items-center justify-between pt-2 border-t border-white/10">
//                         <span className="text-xs text-white/50 font-medium">
//                           {columnApplications.length} {columnApplications.length === 1 ? "item" : "items"}
//                         </span>
//                         <FiChevronRight
//                           className={`w-4 h-4 ${statusInfo.iconColor} group-hover:translate-x-1 transition-transform duration-300`}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           ) : (
//             <StatusDetailView applications={getApplicationsByStatus(selectedStatus)} status={selectedStatus} />
//           )}

//           {/* Delete confirmation modal */}
//           {deleteDialogOpen && selectedApplication && (
//             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//               <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-6 max-w-md w-full shadow-2xl">
//                 <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
//                 <div className="relative space-y-4">
//                   <div className="flex items-center gap-3">
//                     <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30">
//                       <FiTrash2 className="w-6 h-6 text-red-400" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold text-white">Delete Application</h3>
//                       <p className="text-white/60">This action cannot be undone</p>
//                     </div>
//                   </div>

//                   <div className="p-4 rounded-xl bg-white/5 border border-white/10">
//                     <p className="text-white font-medium">{selectedApplication.job_title}</p>
//                     <p className="text-white/60 text-sm">{selectedApplication.company_name}</p>
//                   </div>

//                   <div className="flex gap-3 pt-2">
//                     <button
//                       onClick={() => setDeleteDialogOpen(false)}
//                       className="flex-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10 hover:border-white/20"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleDeleteApplication}
//                       className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors shadow-lg hover:shadow-red-500/25"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   )
// }

// export default PipelinePage



"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Layout from "../components/Layout"
import { applicationAPI, type Application, type ApplicationStatus } from "../lib/api"
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
  FiX,
  FiEdit3,
  FiTrash2,
  FiArrowLeft,
} from "react-icons/fi"

const statusColumns: {
  key: ApplicationStatus
  label: string
  description: string
  iconColor: string
  bgColor: string
  borderColor: string
  glowColor: string
}[] = [
  {
    key: "saved",
    label: "Saved",
    description: "Jobs you want to apply to",
    iconColor: "text-amber-400",
    bgColor: "bg-gradient-to-br from-amber-500/10 to-yellow-500/5",
    borderColor: "border-amber-500/20",
    glowColor: "shadow-amber-500/10",
  },
  {
    key: "applied",
    label: "Applied",
    description: "Applications submitted",
    iconColor: "text-blue-400",
    bgColor: "bg-gradient-to-br from-blue-500/10 to-cyan-500/5",
    borderColor: "border-blue-500/20",
    glowColor: "shadow-blue-500/10",
  },
  {
    key: "interview",
    label: "Interview",
    description: "In progress interviews",
    iconColor: "text-purple-400",
    bgColor: "bg-gradient-to-br from-purple-500/10 to-fuchsia-500/5",
    borderColor: "border-purple-500/20",
    glowColor: "shadow-purple-500/10",
  },
  {
    key: "offer",
    label: "Offer",
    description: "Received offers",
    iconColor: "text-emerald-400",
    bgColor: "bg-gradient-to-br from-emerald-500/10 to-teal-500/5",
    borderColor: "border-emerald-500/20",
    glowColor: "shadow-emerald-500/10",
  },
  {
    key: "rejected",
    label: "Rejected",
    description: "Unsuccessful applications",
    iconColor: "text-rose-400",
    bgColor: "bg-gradient-to-br from-rose-500/10 to-red-500/5",
    borderColor: "border-rose-500/20",
    glowColor: "shadow-rose-500/10",
  },
  {
    key: "withdrawn",
    label: "Withdrawn",
    description: "Applications withdrawn",
    iconColor: "text-slate-400",
    bgColor: "bg-gradient-to-br from-slate-500/10 to-gray-500/5",
    borderColor: "border-slate-500/20",
    glowColor: "shadow-slate-500/10",
  },
]

const PipelinePage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await applicationAPI.getAll()
      setApplications(response.data || response)
    } catch (err: any) {
      console.error("Error fetching applications:", err)
      setError(err.response?.data?.message || err.message || "Failed to fetch applications")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (applicationId: number, newStatus: ApplicationStatus) => {
    try {
      setUpdatingStatus(applicationId)
      setError(null)

      let updateResponse
      try {
        updateResponse = await applicationAPI.updateStatus(applicationId, newStatus)
      } catch (firstError) {
        try {
          updateResponse = await applicationAPI.update(applicationId, { status: newStatus })
        } catch (secondError) {
          updateResponse = await fetch(`/api/applications/${applicationId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          })
          if (!updateResponse.ok) throw new Error(`HTTP error! status: ${updateResponse.status}`)
        }
      }
      await fetchApplications()
    } catch (err: any) {
      console.error("Error updating status:", err)
      setError(err.response?.data?.message || err.message || "Failed to update status")
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleDeleteApplication = async () => {
    if (!selectedApplication) return
    try {
      setError(null)
      await applicationAPI.delete(selectedApplication.id)
      await fetchApplications()
      setDeleteDialogOpen(false)
    } catch (err: any) {
      console.error("Error deleting application:", err)
      setError(err.response?.data?.message || err.message || "Failed to delete application")
    }
  }

  const handleAddApplication = () => router.push("/add-application")
 const handleJobClick = (applicationId: number) => router.push(`/application/${applicationId}`)
  const handleEditApplication = (applicationId: number) => router.push(`/applications/${applicationId}/edit`)

  const getApplicationsByStatus = (status: ApplicationStatus) =>
    applications
      .filter((app) => app.status === status)
      .filter((app) =>
        searchQuery
          ? app.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.company_name.toLowerCase().includes(searchQuery.toLowerCase())
          : true,
      )

  const getStatusColor = (status: ApplicationStatus) => {
    const statusInfo = statusColumns.find((s) => s.key === status)
    return statusInfo ? `${statusInfo.bgColor} ${statusInfo.borderColor}` : "bg-slate-500/10 border-slate-500/20"
  }

  const ApplicationCard: React.FC<{ application: Application; index: number }> = ({ application, index }) => {
    const statusInfo = statusColumns.find((s) => s.key === application.status)

    return (
      <div
        className={`group relative overflow-hidden rounded-xl sm:rounded-2xl ${statusInfo?.bgColor} backdrop-blur-sm border ${statusInfo?.borderColor} hover:${statusInfo?.glowColor} hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer`}
        onClick={() => handleJobClick(application.id)}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div
          className={`absolute -top-4 -right-4 sm:-top-8 sm:-right-8 w-8 h-8 sm:w-16 sm:h-16 rounded-full ${statusInfo?.bgColor} blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-150`}
        ></div>

        <div className="relative p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div
                className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl ${statusInfo?.bgColor} border ${statusInfo?.borderColor} shadow-lg`}
              >
                <FiBriefcase className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${statusInfo?.iconColor}`} />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base md:text-lg leading-tight group-hover:text-white/90 transition-colors truncate">
                  {application.job_title}
                </h3>
                <p className="text-white/60 text-xs sm:text-sm font-medium truncate">{application.company_name}</p>
              </div>
            </div>
            <span
              className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold ${statusInfo?.iconColor} bg-white/10 border border-white/20 backdrop-blur-sm flex-shrink-0`}
            >
              #{index + 1}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-white/70">
              <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4 text-white/50 flex-shrink-0" />
              <span className="truncate">
                {new Date(application.application_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {application.location && (
              <div className="flex items-center gap-2 text-white/70">
                <FiMapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white/50 flex-shrink-0" />
                <span className="truncate">{application.location}</span>
              </div>
            )}

            {application.salary_range && (
              <div className="flex items-center gap-2 text-white/70">
                <FiDollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-white/50 flex-shrink-0" />
                <span className="font-medium truncate">{application.salary_range}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex gap-1 sm:gap-2" onClick={(e) => e.stopPropagation()}>
              {application.job_posting_url && (
                <button
                  onClick={() => window.open(application.job_posting_url, "_blank")}
                  className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200 hover:scale-110"
                  title="Open job posting"
                >
                  <FiExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              )}
              <button
                onClick={() => handleEditApplication(application.id)}
                className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200 hover:scale-110"
                title="Edit application"
              >
                <FiEdit3 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedApplication(application)
                  setDeleteDialogOpen(true)
                }}
                className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 hover:scale-110"
                title="Delete application"
              >
                <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1 sm:gap-2" onClick={(e) => e.stopPropagation()}>
              {updatingStatus === application.id && (
                <FiLoader className="w-3 h-3 sm:w-4 sm:h-4 text-white/60 animate-spin" />
              )}
              <select
                value={application.status}
                onChange={(e) => handleStatusChange(application.id, e.target.value as ApplicationStatus)}
                disabled={updatingStatus === application.id}
                className={`bg-white/5 border ${getStatusColor(application.status)} rounded-md sm:rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-medium text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm`}
              >
                {statusColumns.map((status) => (
                  <option key={status.key} value={status.key} className="bg-gray-900 text-white">
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const StatusDetailView: React.FC<{ applications: Application[]; status: ApplicationStatus }> = ({
    applications,
    status,
  }) => {
    const statusInfo = statusColumns.find((s) => s.key === status)

    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <button
              onClick={() => setSelectedStatus(null)}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20 self-start"
            >
              <FiArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium text-sm sm:text-base">Back to Overview</span>
            </button>
            <div className="flex items-center gap-3">
              <div
                className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${statusInfo?.bgColor} border ${statusInfo?.borderColor} shadow-lg`}
              >
                <FiBriefcase className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${statusInfo?.iconColor}`} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 group-hover:text-white/90 transition-colors">
                  {statusInfo?.label}
                </h1>
                <p className="text-white/60 text-sm sm:text-base">{statusInfo?.description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold ${statusInfo?.iconColor} ${statusInfo?.bgColor} border ${statusInfo?.borderColor} backdrop-blur-sm`}
            >
              {applications.length} {applications.length === 1 ? "application" : "applications"}
            </span>
          </div>
        </div>

        {applications.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {applications.map((application, index) => (
              <ApplicationCard key={application.id} application={application} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div
              className={`inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl ${statusInfo?.bgColor} border ${statusInfo?.borderColor} mb-4`}
            >
              <FiBriefcase className={`w-6 h-6 sm:w-8 sm:h-8 ${statusInfo?.iconColor}`} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No applications yet</h3>
            <p className="text-white/60 mb-4 sm:mb-6 text-sm sm:text-base">
              Start by adding your first application to this status.
            </p>
            <button
              onClick={handleAddApplication}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 text-sm sm:text-base"
            >
              <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Add Application</span>
              <span className="xs:hidden">Add</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-2 sm:border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-2 sm:border-4 border-transparent border-r-blue-500 rounded-full animate-spin animate-reverse"></div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-8">
          {error && (
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent"></div>
              <div className="relative p-3 sm:p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-red-500/20 flex-shrink-0">
                    <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                  </div>
                  <span className="text-white font-medium text-sm sm:text-base truncate">{error}</span>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="p-1.5 sm:p-2 rounded-md sm:rounded-lg hover:bg-white/10 text-red-400 hover:text-white transition-colors flex-shrink-0"
                >
                  <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                  Application Pipeline
                </h1>
                <p className="text-white/60 text-sm sm:text-base md:text-lg">Track and manage your job applications</p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="relative">
                  <FiSearch className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all backdrop-blur-sm w-full sm:w-48 md:w-64 text-sm sm:text-base"
                  />
                </div>

                <button
                  onClick={handleAddApplication}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Add Application</span>
                  <span className="xs:hidden">Add</span>
                </button>
              </div>
            </div>
          </div>

          {!selectedStatus ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {statusColumns.map((statusInfo) => {
                const columnApplications = getApplicationsByStatus(statusInfo.key)
                return (
                  <div
                    key={statusInfo.key}
                    className={`group relative overflow-hidden rounded-xl sm:rounded-2xl ${statusInfo.bgColor} backdrop-blur-sm border ${statusInfo.borderColor} hover:${statusInfo.glowColor} hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer`}
                    onClick={() => setSelectedStatus(statusInfo.key)}
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div
                      className={`absolute -top-4 -right-4 sm:-top-8 sm:-right-8 w-8 h-8 sm:w-16 sm:h-16 rounded-full ${statusInfo?.bgColor} blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-150`}
                    ></div>

                    <div className="relative p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl ${statusInfo?.bgColor} border ${statusInfo?.borderColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <FiBriefcase className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${statusInfo.iconColor}`} />
                        </div>
                        <span
                          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold ${statusInfo.iconColor} bg-white/10 border border-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}
                        >
                          {columnApplications.length}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-white/90 transition-colors">
                          {statusInfo.label}
                        </h3>
                        <p className="text-white/60 text-xs sm:text-sm leading-relaxed">{statusInfo.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-xs text-white/50 font-medium">
                          {columnApplications.length} {columnApplications.length === 1 ? "item" : "items"}
                        </span>
                        <FiChevronRight
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${statusInfo.iconColor} group-hover:translate-x-1 transition-transform duration-300`}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <StatusDetailView applications={getApplicationsByStatus(selectedStatus)} status={selectedStatus} />
          )}

          {deleteDialogOpen && selectedApplication && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-4 sm:p-6 max-w-sm sm:max-w-md w-full shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
                <div className="relative space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-red-500/20 border border-red-500/30">
                      <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">Delete Application</h3>
                      <p className="text-white/60 text-sm sm:text-base">This action cannot be undone</p>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white font-medium text-sm sm:text-base truncate">
                      {selectedApplication.job_title}
                    </p>
                    <p className="text-white/60 text-xs sm:text-sm truncate">{selectedApplication.company_name}</p>
                  </div>

                  <div className="flex gap-2 sm:gap-3 pt-2">
                    <button
                      onClick={() => setDeleteDialogOpen(false)}
                      className="flex-1 px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10 hover:border-white/20 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteApplication}
                      className="flex-1 px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors shadow-lg hover:shadow-red-500/25 text-sm sm:text-base"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default PipelinePage
