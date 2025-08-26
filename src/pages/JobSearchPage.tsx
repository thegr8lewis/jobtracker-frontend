"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Layout from "../components/Layout"
import { applicationAPI, jobAPI, type Job, type JobFilter } from "../lib/api"
import { getAuth } from "firebase/auth"
import {
  FiLoader,
  FiPlus,
  FiMapPin,
  FiDollarSign,
  FiExternalLink,
  FiSearch,
  FiX,
  FiFilter,
  FiRefreshCw,
  FiSave,
  FiChevronDown,
  FiChevronUp,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
} from "react-icons/fi"

const JobSearchPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [jobFilters, setJobFilters] = useState<JobFilter[]>([])
  const [jobsLoading, setJobsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [jobSearchQuery, setJobSearchQuery] = useState("")
  const [jobLocationQuery, setJobLocationQuery] = useState("")
  const [showFilterDialog, setShowFilterDialog] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [deletingFilter, setDeletingFilter] = useState<number | null>(null)
  const [newFilter, setNewFilter] = useState({
    keywords: [] as string[],
    locations: [] as string[],
    salary_min: 0,
    remote_only: false,
    providers: ["jooble", "adzuna"] as string[],
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [jobsPerPage] = useState(6)
  const router = useRouter()

  useEffect(() => {
    fetchJobFilters()
  }, [])

  const fetchJobs = async () => {
    try {
      setJobsLoading(true)
      setError(null)
      const params: any = {}
      if (jobSearchQuery) params.q = jobSearchQuery
      if (jobLocationQuery) params.loc = jobLocationQuery
      
      const response = await jobAPI.getAll(params)
      setJobs(response.data || response)
      setCurrentPage(1) // Reset to first page when new search
    } catch (err: any) {
      console.error("Error fetching jobs:", err)
      setError(err.response?.data?.message || err.message || "Failed to fetch jobs")
    } finally {
      setJobsLoading(false)
    }
  }

  const fetchJobFilters = async () => {
    try {
      const response = await jobAPI.getFilters()
      setJobFilters(response.data || response)
    } catch (err: any) {
      console.error("Error fetching job filters:", err)
    }
  }

  const saveJobFilter = async () => {
    try {
      setError(null)
      
      // Get the current user UID
      const auth = getAuth();
      const user = auth.currentUser;
      const user_uid = user?.uid || "unknown";
      
      await jobAPI.createFilter({
        ...newFilter,
        user_uid
      })
      
      setShowFilterDialog(false)
      setNewFilter({
        keywords: [],
        locations: [],
        salary_min: 0,
        remote_only: false,
        providers: ["jooble", "adzuna"],
      })
      fetchJobFilters()
    } catch (err: any) {
      console.error("Error saving filter:", err)
      setError(err.response?.data?.message || err.message || "Failed to save filter")
    }
  }

  const deleteJobFilter = async (filterId: number) => {
    try {
      setDeletingFilter(filterId)
      setError(null)
      await jobAPI.deleteFilter(filterId)
      fetchJobFilters()
    } catch (err: any) {
      console.error("Error deleting filter:", err)
      setError(err.response?.data?.message || err.message || "Failed to delete filter")
    } finally {
      setDeletingFilter(null)
    }
  }

  const triggerJobFetch = async () => {
    try {
      setJobsLoading(true)
      setError(null)
      await jobAPI.triggerFetch()
      // Wait a bit for the fetch to complete, then refresh jobs
      setTimeout(() => {
        fetchJobs()
      }, 3000)
    } catch (err: any) {
      console.error("Error triggering job fetch:", err)
      setError(err.response?.data?.message || err.message || "Failed to trigger job fetch")
      setJobsLoading(false)
    }
  }

  const handleSaveJob = async (job: Job) => {
    try {
      await applicationAPI.create({
        company_name: job.company || "Unknown Company",
        job_title: job.title,
        job_posting_url: job.link,
        location: job.location,
        salary_range: job.salary_min && job.salary_max 
          ? `${job.salary_min} - ${job.salary_max}` 
          : job.salary_min 
            ? `${job.salary_min}+` 
            : job.salary_max 
              ? `Up to ${job.salary_max}` 
              : undefined,
        status: "saved",
      })
      setSaveDialogOpen(true)
    } catch (err: any) {
      console.error("Error saving job:", err)
      setError(err.response?.data?.message || err.message || "Failed to save job")
    }
  }

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(jobs.length / jobsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const JobCard: React.FC<{ job: Job }> = ({ job }) => {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-white text-lg">{job.title}</h3>
            <p className="text-white/70">{job.company}</p>
          </div>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
            {job.source}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <FiMapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        
        {(job.salary_min || job.salary_max) && (
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <FiDollarSign className="w-4 h-4" />
            <span>
              {job.salary_min && job.salary_max 
                ? `${job.salary_min} - ${job.salary_max}` 
                : job.salary_min 
                  ? `${job.salary_min}+` 
                  : `Up to ${job.salary_max}`}
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <button
            onClick={() => window.open(job.link, "_blank")}
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
          >
            View Job <FiExternalLink className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleSaveJob(job)}
            className="bg-green-500/20 hover:bg-green-500/30 text-green-300 hover:text-green-200 px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors"
          >
            <FiSave className="w-3 h-3" /> Save
          </button>
        </div>
      </div>
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
                <button
                  onClick={() => router.push("/pipeline")}
                  className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20 self-start mb-4"
                >
                  <FiArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-medium text-sm sm:text-base">Back to Pipeline</span>
                </button>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                  Job Search
                </h1>
                <p className="text-white/60 text-sm sm:text-base md:text-lg">Discover new opportunities</p>
              </div>
            </div>
          </div>

          {/* Job Search Section */}
          <div className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
            {/* Header with toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                  <FiSearch className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Find Jobs</h2>
                  <p className="text-white/60 text-sm">Search for new opportunities</p>
                </div>
              </div>
            </div>

            {/* Compact Search Form */}
            <div className="space-y-4">
              {/* Basic Search */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Job title, keywords..."
                    value={jobSearchQuery}
                    onChange={(e) => setJobSearchQuery(e.target.value)}
                    className="pl-10 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all w-full text-sm"
                  />
                </div>

                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Location..."
                    value={jobLocationQuery}
                    onChange={(e) => setJobLocationQuery(e.target.value)}
                    className="pl-10 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all w-full text-sm"
                  />
                </div>

                <button
                  onClick={fetchJobs}
                  disabled={jobsLoading}
                  className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  {jobsLoading ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <FiSearch className="w-4 h-4" />
                      <span>Search Jobs</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/10 hover:border-white/20 text-sm"
                >
                  <FiFilter className="w-4 h-4" />
                  <span>Advanced Filters</span>
                  {showAdvancedFilters ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={() => setShowFilterDialog(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 transition-all border border-blue-500/30 text-sm"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Save Filter</span>
                </button>
                
                <button
                  onClick={triggerJobFetch}
                  disabled={jobsLoading}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-purple-200 transition-all border border-purple-500/30 disabled:opacity-50 text-sm"
                >
                  <FiRefreshCw className={`w-4 h-4 ${jobsLoading ? "animate-spin" : ""}`} />
                  <span>Fetch New</span>
                </button>
              </div>

              {/* Advanced Filters Panel */}
              {showAdvancedFilters && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-white mb-3">Advanced Options</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Min Salary</label>
                      <input
                        type="number"
                        placeholder="e.g., 50000"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Job Type</label>
                      <select className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all text-sm">
                        <option value="" className="bg-gray-900">Any</option>
                        <option value="full-time" className="bg-gray-900">Full Time</option>
                        <option value="part-time" className="bg-gray-900">Part Time</option>
                        <option value="contract" className="bg-gray-900">Contract</option>
                        <option value="remote" className="bg-gray-900">Remote</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                      <input
                        type="checkbox"
                        id="remote_only_search"
                        className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-500 focus:ring-blue-500"
                      />
                      <label htmlFor="remote_only_search" className="text-sm text-white/70">
                        Remote only
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Saved Filters Section */}
            {jobFilters.length > 0 && (
              <div className="mt-5 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">Saved Filters ({jobFilters.length})</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobFilters.map((filter) => (
                    <div 
                      key={filter.id} 
                      className="group flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg px-3 py-2 transition-all"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-blue-300 text-xs font-medium truncate">
                          {filter.keywords.slice(0, 2).join(", ")}
                          {filter.keywords.length > 2 && ` +${filter.keywords.length - 2}`}
                        </p>
                        <p className="text-blue-400/60 text-xs truncate">
                          {filter.locations.slice(0, 2).join(", ")}
                          {filter.locations.length > 2 && ` +${filter.locations.length - 2}`}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteJobFilter(filter.id)}
                        disabled={deletingFilter === filter.id}
                        className="p-1 rounded hover:bg-red-500/20 text-blue-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete filter"
                      >
                        {deletingFilter === filter.id ? (
                          <FiLoader className="w-3 h-3 animate-spin" />
                        ) : (
                          <FiTrash2 className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results Section */}
            {jobs.length > 0 && (
              <div className="mt-5 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">
                    Found {jobs.length} job{jobs.length !== 1 ? 's' : ''}
                  </h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {currentJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-6 space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                          currentPage === page
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        } border border-white/10`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Save Filter Dialog */}
          {showFilterDialog && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-4 sm:p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
                <div className="relative space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Save Job Search Filter</h3>
                    <button
                      onClick={() => setShowFilterDialog(false)}
                      className="p-1.5 sm:p-2 rounded-md sm:rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    >
                      <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Keywords</label>
                      <input
                        type="text"
                        placeholder="React, Developer, Frontend"
                        value={newFilter.keywords.join(", ")}
                        onChange={(e) => setNewFilter({...newFilter, keywords: e.target.value.split(",").map(k => k.trim())})}
                        className="w-full px-3 py-2.5 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all backdrop-blur-sm text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Locations</label>
                      <input
                        type="text"
                        placeholder="Nairobi, Remote, Kenya"
                        value={newFilter.locations.join(", ")}
                        onChange={(e) => setNewFilter({...newFilter, locations: e.target.value.split(",").map(l => l.trim())})}
                        className="w-full px-3 py-2.5 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all backdrop-blur-sm text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Minimum Salary</label>
                      <input
                        type="number"
                        placeholder="100000"
                        value={newFilter.salary_min || ""}
                        onChange={(e) => setNewFilter({...newFilter, salary_min: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2.5 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all backdrop-blur-sm text-sm sm:text-base"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="remote_only"
                        checked={newFilter.remote_only}
                        onChange={(e) => setNewFilter({...newFilter, remote_only: e.target.checked})}
                        className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                      />
                      <label htmlFor="remote_only" className="text-white text-sm">
                        Remote only
                      </label>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Providers</label>
                      <div className="flex flex-wrap gap-3">
                        {["jooble", "adzuna", "workable", "rapidapi"].map(provider => (
                          <div key={provider} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`provider-${provider}`}
                              checked={newFilter.providers.includes(provider)}
                              onChange={(e) => {
                                const providers = e.target.checked
                                  ? [...newFilter.providers, provider]
                                  : newFilter.providers.filter(p => p !== provider)
                                setNewFilter({...newFilter, providers})
                              }}
                              className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                            />
                            <label htmlFor={`provider-${provider}`} className="text-white text-sm capitalize">
                              {provider}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowFilterDialog(false)}
                      className="flex-1 px-3 py-2.5 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10 hover:border-white/20 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveJobFilter}
                      className="flex-1 px-3 py-2.5 rounded-lg sm:rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors shadow-lg hover:shadow-blue-500/25 text-sm sm:text-base"
                    >
                      Save Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Confirmation Dialog */}
          {saveDialogOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-4 sm:p-6 max-w-sm sm:max-w-md w-full shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
                <div className="relative space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-green-500/20 border border-green-500/30">
                      <FiSave className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">Job Saved</h3>
                      <p className="text-white/60 text-sm sm:text-base">Job has been added to your applications</p>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:gap-3 pt-2">
                    <button
                      onClick={() => setSaveDialogOpen(false)}
                      className="flex-1 px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors shadow-lg hover:shadow-green-500/25 text-sm sm:text-base"
                    >
                      OK
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

export default JobSearchPage