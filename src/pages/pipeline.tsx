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
  FiCheck,
  FiGrid,
  FiList,
  FiChevronDown,
  FiChevronUp,
  FiFilter
} from "react-icons/fi"

const statusColumns: {
  key: ApplicationStatus
  label: string
  description: string
  iconColor: string
  bgColor: string
  borderColor: string
  textColor: string
  glowColor: string
}[] = [
  {
    key: "saved",
    label: "Saved",
    description: "Jobs you want to apply to",
    iconColor: "text-amber-400",
    bgColor: "bg-gradient-to-br from-amber-500/10 to-yellow-500/5",
    borderColor: "border-amber-500/20",
    textColor: "text-amber-400",
    glowColor: "shadow-amber-500/10",
  },
  {
    key: "applied",
    label: "Applied",
    description: "Applications submitted",
    iconColor: "text-blue-400",
    bgColor: "bg-gradient-to-br from-blue-500/10 to-cyan-500/5",
    borderColor: "border-blue-500/20",
    textColor: "text-blue-400",
    glowColor: "shadow-blue-500/10",
  },
  {
    key: "interview",
    label: "Interview",
    description: "In progress interviews",
    iconColor: "text-purple-400",
    bgColor: "bg-gradient-to-br from-purple-500/10 to-fuchsia-500/5",
    borderColor: "border-purple-500/20",
    textColor: "text-purple-400",
    glowColor: "shadow-purple-500/10",
  },
  {
    key: "offer",
    label: "Offer",
    description: "Received offers",
    iconColor: "text-emerald-400",
    bgColor: "bg-gradient-to-br from-emerald-500/10 to-teal-500/5",
    borderColor: "border-emerald-500/20",
    textColor: "text-emerald-400",
    glowColor: "shadow-emerald-500/10",
  },
  {
    key: "rejected",
    label: "Rejected",
    description: "Unsuccessful applications",
    iconColor: "text-rose-400",
    bgColor: "bg-gradient-to-br from-rose-500/10 to-red-500/5",
    borderColor: "border-rose-500/20",
    textColor: "text-rose-400",
    glowColor: "shadow-rose-500/10",
  },
  {
    key: "withdrawn",
    label: "Withdrawn",
    description: "Applications withdrawn",
    iconColor: "text-slate-400",
    bgColor: "bg-gradient-to-br from-slate-500/10 to-gray-500/5",
    borderColor: "border-slate-500/20",
    textColor: "text-slate-400",
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
  const [viewMode, setViewMode] = useState<"card" | "table">("card")
  const [sortConfig, setSortConfig] = useState<{key: string; direction: 'ascending' | 'descending'} | null>(null)
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
      await applicationAPI.updateStatus(applicationId, newStatus)
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
  const handleEditApplication = (applicationId: number) => router.push(`/application/${applicationId}`)
  const handleJobSearchClick = () => router.push("/job-search")

  const getApplicationsByStatus = (status: ApplicationStatus) => {
    let filteredApplications = applications
      .filter((app) => app.status === status)
      .filter((app) =>
        searchQuery
          ? app.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.company_name.toLowerCase().includes(searchQuery.toLowerCase())
          : true,
      )
    
    // Apply sorting if configured
    // Apply sorting if configured
if (sortConfig && sortConfig.key) {
  filteredApplications = filteredApplications.sort((a, b) => {
    const key = sortConfig.key as keyof Application;
    const valueA = a[key];
    const valueB = b[key];
    
    // Handle undefined values
    if (valueA === undefined || valueB === undefined) {
      return 0; // or handle as you prefer
    }
    
    if (valueA < valueB) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });
}
    
    return filteredApplications
  }

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const getStatusInfo = (status: ApplicationStatus) => {
    return statusColumns.find((s) => s.key === status) || statusColumns[0]
  }

  const ApplicationCard: React.FC<{ application: Application; index: number }> = ({ application, index }) => {
    const statusInfo = getStatusInfo(application.status)

    return (
      <div
        className={`group relative overflow-hidden rounded-xl backdrop-blur-sm border ${statusInfo.borderColor} hover:${statusInfo.glowColor} hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer ${statusInfo.bgColor}`}
        onClick={() => handleJobClick(application.id)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div
          className={`absolute -top-4 -right-4 w-8 h-8 rounded-full ${statusInfo.bgColor} blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-150`}
        ></div>

        <div className="relative p-4 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={`p-2 rounded-lg ${statusInfo.bgColor} border ${statusInfo.borderColor} shadow-lg flex-shrink-0`}>
                <FiBriefcase className={`w-5 h-5 ${statusInfo.iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white text-lg leading-tight truncate">
                  {application.job_title}
                </h3>
                <p className="text-white/70 text-sm font-medium truncate">{application.company_name}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.textColor} bg-white/10 border border-white/20 backdrop-blur-sm flex-shrink-0 h-fit`}>
              #{index + 1}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <FiCalendar className="w-4 h-4 text-white/50 flex-shrink-0" />
              <span>
                {new Date(application.application_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {application.location && (
              <div className="flex items-center gap-2">
                <FiMapPin className="w-4 h-4 text-white/50 flex-shrink-0" />
                <span className="truncate">{application.location}</span>
              </div>
            )}

            {application.salary_range && (
              <div className="flex items-center gap-2">
                <FiDollarSign className="w-4 h-4 text-white/50 flex-shrink-0" />
                <span className="font-medium">{application.salary_range}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              {application.job_posting_url && (
                <button
                  onClick={() => window.open(application.job_posting_url, "_blank")}
                  className="p-2 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200"
                  title="Open job posting"
                >
                  <FiExternalLink className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleEditApplication(application.id)
                }}
                className="p-2 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200"
                title="Edit application"
              >
                <FiEdit3 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedApplication(application)
                  setDeleteDialogOpen(true)
                }}
                className="p-2 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200"
                title="Delete application"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              {updatingStatus === application.id && (
                <FiLoader className="w-4 h-4 text-white/60 animate-spin" />
              )}
              <select
                value={application.status}
                onChange={(e) => handleStatusChange(application.id, e.target.value as ApplicationStatus)}
                disabled={updatingStatus === application.id}
                className={`bg-white/5 border ${statusInfo.borderColor} rounded-md px-3 py-1.5 text-sm font-medium text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm`}
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

  const ApplicationTableRow: React.FC<{ application: Application; index: number }> = ({ application, index }) => {
    const statusInfo = getStatusInfo(application.status)

    return (
      <tr 
        className={`group border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer ${statusInfo.bgColor}`}
        onClick={() => handleJobClick(application.id)}
      >
        <td className="px-6 py-4 text-center text-sm font-medium text-white/60">
          {index + 1}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
              <FiBriefcase className={`w-4 h-4 ${statusInfo.iconColor}`} />
            </div>
            <div>
              <div className="font-medium text-white">{application.job_title}</div>
              <div className="text-sm text-white/70">{application.company_name}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-white/70">
          {new Date(application.application_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </td>
        <td className="px-6 py-4 text-sm text-white/70">
          {application.location || "-"}
        </td>
        <td className="px-6 py-4 text-sm text-white/70">
          {application.salary_range || "-"}
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.textColor} bg-white/10`}>
            {statusInfo.label}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2 justify-end opacity-70 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
            {application.job_posting_url && (
              <button
                onClick={() => window.open(application.job_posting_url, "_blank")}
                className="p-2 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                title="Open job posting"
              >
                <FiExternalLink className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleEditApplication(application.id)
              }}
              className="p-2 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="Edit application"
            >
              <FiEdit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedApplication(application)
                setDeleteDialogOpen(true)
              }}
              className="p-2 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
              title="Delete application"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
            <select
              value={application.status}
              onChange={(e) => handleStatusChange(application.id, e.target.value as ApplicationStatus)}
              disabled={updatingStatus === application.id}
              className={`bg-white/5 border ${statusInfo.borderColor} rounded-md px-2 py-1 text-xs font-medium text-white focus:ring-1 focus:ring-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm`}
              onClick={(e) => e.stopPropagation()}
            >
              {statusColumns.map((status) => (
                <option key={status.key} value={status.key} className="bg-gray-900 text-white">
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </td>
      </tr>
    )
  }

  const StatusColumn: React.FC<{ statusInfo: typeof statusColumns[0] }> = ({ statusInfo }) => {
    const columnApplications = getApplicationsByStatus(statusInfo.key)

    return (
      <div
        className={`group relative overflow-hidden rounded-xl backdrop-blur-sm border ${statusInfo.borderColor} hover:${statusInfo.glowColor} hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer ${statusInfo.bgColor}`}
        onClick={() => setSelectedStatus(statusInfo.key)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div
          className={`absolute -top-4 -right-4 w-8 h-8 rounded-full ${statusInfo.bgColor} blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-150`}
        ></div>

        <div className="relative p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-lg ${statusInfo.bgColor} border ${statusInfo.borderColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <FiBriefcase className={`w-5 h-5 ${statusInfo.iconColor}`} />
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.textColor} bg-white/10 border border-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
              {columnApplications.length}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {statusInfo.label}
            </h3>
            <p className="text-sm text-white/70">
              {statusInfo.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <span className="text-sm text-white/50">
              {columnApplications.length} {columnApplications.length === 1 ? "item" : "items"}
            </span>
            <FiChevronRight
              className={`w-5 h-5 ${statusInfo.iconColor} group-hover:translate-x-1 transition-transform duration-300`}
            />
          </div>
        </div>
      </div>
    )
  }

  const StatusDetailView: React.FC<{ applications: Application[]; status: ApplicationStatus }> = ({
    applications,
    status,
  }) => {
    const statusInfo = getStatusInfo(status)

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              onClick={() => setSelectedStatus(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 border border-white/10 self-start"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Overview</span>
            </button>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
                <FiBriefcase className={`w-6 h-6 ${statusInfo.iconColor}`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {statusInfo.label}
                </h1>
                <p className="text-white/60">{statusInfo.description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-lg bg-white/5 border border-white/10 overflow-hidden">
              <button
                onClick={() => setViewMode("card")}
                className={`p-2.5 ${viewMode === "card" ? "bg-white/10 text-white" : "text-white/60"} transition-colors`}
                title="Card view"
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2.5 ${viewMode === "table" ? "bg-white/10 text-white" : "text-white/60"} transition-colors`}
                title="Table view"
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
            <span className={`px-3 py-2 rounded-lg text-sm font-semibold ${statusInfo.textColor} ${statusInfo.bgColor} border ${statusInfo.borderColor} backdrop-blur-sm`}>
              {applications.length} {applications.length === 1 ? "application" : "applications"}
            </span>
          </div>
        </div>

        {applications.length > 0 ? (
          viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {applications.map((application, index) => (
                <ApplicationCard key={application.id} application={application} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Date Applied</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {applications.map((application, index) => (
                    <ApplicationTableRow key={application.id} application={application} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
            <div className={`inline-flex p-4 rounded-xl ${statusInfo.bgColor} border ${statusInfo.borderColor} mb-4`}>
              <FiBriefcase className={`w-8 h-8 ${statusInfo.iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No applications yet</h3>
            <p className="text-white/60 mb-6">
              Start by adding your first application to this status.
            </p>
            <button
              onClick={handleAddApplication}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Application</span>
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
            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-500 rounded-full animate-spin animate-reverse"></div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="rounded-xl bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 backdrop-blur-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="p-2 rounded-lg bg-red-500/20 flex-shrink-0">
                    <FiX className="w-5 h-5 text-red-400" />
                  </div>
                  <span className="text-white font-medium truncate">{error}</span>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="p-2 rounded-lg hover:bg-white/10 text-red-400 hover:text-white transition-colors flex-shrink-0"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Application Pipeline
                </h1>
                <p className="text-white/60">Track and manage your job applications</p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all backdrop-blur-sm w-full sm:w-64"
                  />
                </div>

                <button
                  onClick={handleJobSearchClick}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 border border-white/10"
                >
                  <FiSearch className="w-5 h-5" />
                  <span>Find Jobs</span>
                </button>

                <button
                  onClick={handleAddApplication}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                >
                  <FiPlus className="w-5 h-5" />
                  <span>Add Application</span>
                </button>
              </div>
            </div>
          </div>

          {!selectedStatus ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
              {statusColumns.map((statusInfo) => (
                <StatusColumn key={statusInfo.key} statusInfo={statusInfo} />
              ))}
            </div>
          ) : (
            <StatusDetailView applications={getApplicationsByStatus(selectedStatus)} status={selectedStatus} />
          )}

          {/* Delete Application Dialog */}
          {deleteDialogOpen && selectedApplication && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-6 max-w-md w-full shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
                <div className="relative space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                      <FiTrash2 className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Delete Application</h3>
                      <p className="text-white/60">This action cannot be undone</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="font-medium text-white truncate">
                      {selectedApplication.job_title}
                    </p>
                    <p className="text-white/60 text-sm truncate">{selectedApplication.company_name}</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setDeleteDialogOpen(false)}
                      className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteApplication}
                      className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors shadow-lg hover:shadow-red-500/25"
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