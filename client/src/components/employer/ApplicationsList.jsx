import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApplications } from "../../context/ApplicationContext";
import ApplicationCard from "../common/ApplicationCard";
import Pagination from "../common/Pagination";
import "../../styles/ApplicationsList.css";

function ApplicationsList() {
  const { jobId } = useParams();
  const { 
    jobApplications, 
    loading, 
    error, 
    getJobApplications, 
    updateApplicationStatus,
    clearError 
  } = useApplications();
  
  const [totalApplicationsCount, setTotalApplicationsCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [debugInfo, setDebugInfo] = useState({});

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Application status options
  const statusOptions = ["Pending", "Reviewed", "Accepted", "Rejected"];
  
  // Date range options
  const dateRanges = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 3 months" },
    { value: "365", label: "Last year" }
  ];

  // Enhanced debug logging
  useEffect(() => {
    console.log("=== ApplicationsList Debug Info ===");
    console.log("jobId:", jobId);
    console.log("loading:", loading);
    console.log("error:", error);
    console.log("jobApplications:", jobApplications);
    console.log("isInitialLoad:", isInitialLoad);
    
    setDebugInfo({
      jobId,
      loading,
      error,
      applicationsCount: jobApplications?.length || 0,
      isInitialLoad,
      timestamp: new Date().toISOString()
    });
  }, [jobId, loading, error, jobApplications, isInitialLoad]);

  // Clear error when component mounts
  useEffect(() => {
    if (error) {
      console.log("Clearing previous error:", error);
      clearError();
    }
  }, []);

  // Initial load - fetch job applications with better error handling
  useEffect(() => {
    const initializeData = async () => {
      if (!jobId) {
        console.error("No jobId provided");
        return;
      }

      console.log("Initializing data for jobId:", jobId);
      
      try {
        setIsInitialLoad(true);
        await getJobApplications(jobId);
        console.log("Successfully fetched job applications");
      } catch (err) {
        console.error("Error in initializeData:", err);
      } finally {
        setIsInitialLoad(false);
      }
    };

    initializeData();
  }, [jobId]); // Remove getJobApplications from dependencies to prevent infinite loops

  // Set total applications count when applications are loaded
  useEffect(() => {
    if (!isInitialLoad && jobApplications && jobApplications.length > 0) {
      // Check if no filters are applied
      const hasFilters = searchTerm || statusFilter || dateRangeFilter;

      if (!hasFilters) {
        setTotalApplicationsCount(jobApplications.length);
      }
    }
  }, [
    jobApplications,
    isInitialLoad,
    searchTerm,
    statusFilter,
    dateRangeFilter,
  ]);

  // Reset to first page when filters change
  useEffect(() => {
    if (!isInitialLoad) {
      setCurrentPage(1);
    }
  }, [
    searchTerm,
    statusFilter,
    dateRangeFilter,
    isInitialLoad,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      console.log("Updating application status:", applicationId, newStatus);
      await updateApplicationStatus(applicationId, newStatus);
      // Refresh applications after status update
      await getJobApplications(jobId);
      console.log("Successfully updated application status");
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  };

  const handleViewDetails = (applicationId) => {
    console.log("View application:", applicationId);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of results section
    const resultsSection = document.querySelector(".applicationslist-results-section");
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDateRangeFilter("");
    setCurrentPage(1);
  };

  const handleRetry = async () => {
    console.log("Retrying to fetch applications...");
    clearError();
    try {
      await getJobApplications(jobId);
    } catch (err) {
      console.error("Retry failed:", err);
    }
  };

  // Client-side filtering
  const filterApplications = (applicationsList) => {
    if (!applicationsList) return [];

    return applicationsList.filter((application) => {
      // Search term filter (applicant name or email)
      if (searchTerm.trim()) {
        const applicantName = application.name || "";
        const applicantEmail = application.email || "";
        const searchLower = searchTerm.toLowerCase();
        
        if (!applicantName.toLowerCase().includes(searchLower) && 
            !applicantEmail.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Status filter
      if (statusFilter) {
        const applicationStatus = application.applicationStatus || "Pending";
        if (applicationStatus !== statusFilter) {
          return false;
        }
      }

      // Date range filter
      if (dateRangeFilter) {
        const applicationDate = new Date(application.createdAt);
        const currentDate = new Date();
        const daysDiff = Math.floor((currentDate - applicationDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > parseInt(dateRangeFilter)) {
          return false;
        }
      }

      return true;
    });
  };

  // Client-side sorting
  const sortApplications = (applicationsList) => {
    const sortedApplications = [...applicationsList];

    switch (sortBy) {
      case "newest":
        return sortedApplications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return sortedApplications.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "status":
        return sortedApplications.sort((a, b) => {
          const statusOrder = { "Pending": 0, "Reviewed": 1, "Accepted": 2, "Rejected": 3 };
          const statusA = a.applicationStatus || "Pending";
          const statusB = b.applicationStatus || "Pending";
          return statusOrder[statusA] - statusOrder[statusB];
        });
      case "name":
        return sortedApplications.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
      default:
        return sortedApplications;
    }
  };

  // Apply client-side filters and sorting
  const processedApplications = sortApplications(filterApplications(jobApplications || []));

  // Calculate pagination
  const totalItems = processedApplications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = processedApplications.slice(startIndex, endIndex);

  // Calculate status counts for stats
  const getStatusCounts = () => {
    const applications = jobApplications || [];
    return {
      pending: applications.filter(app => (app.applicationStatus || "Pending") === "Pending").length,
      reviewed: applications.filter(app => app.applicationStatus === "Reviewed").length,
      accepted: applications.filter(app => app.applicationStatus === "Accepted").length,
      rejected: applications.filter(app => app.applicationStatus === "Rejected").length,
    };
  };

  const statusCounts = getStatusCounts();

  // Get job information from the first application (assuming all applications are for the same job)
  const jobInfo = jobApplications && jobApplications.length > 0 ? jobApplications[0].job : null;

  return (
    <>
      {/* Hero Section Start */}
      <div className="applicationslist-hero-section">
        <div className="applicationslist-hero-container">
          <div className="applicationslist-hero-content">
            <div className="applicationslist-hero-text">
              <h1 className="applicationslist-hero-title">
                Job <span className="gradient-text">Applications</span>
              </h1>
              <p className="applicationslist-hero-description">
                Manage and review all applications received for your job posting. 
                Track candidate progress and make informed hiring decisions.
              </p>

              {/* Job Info Section */}
              {jobInfo && (
                <div className="applicationslist-job-info-section">
                  <div className="applicationslist-job-info-header">
                    <div>
                      <h3 className="applicationslist-job-info-title">{jobInfo.title}</h3>
                      <p className="applicationslist-job-info-company">{jobInfo.companyName}</p>
                    </div>
                  </div>
                  <div className="applicationslist-job-info-details">
                    <div className="applicationslist-job-info-item">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span>{jobInfo.city}</span>
                    </div>
                    <div className="applicationslist-job-info-item">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span>{jobInfo.jobType}</span>
                    </div>
                    {jobInfo.fixedSalary && (
                      <div className="applicationslist-job-info-item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        <span>₹{jobInfo.fixedSalary.toLocaleString("en-IN")} / yr</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Search Section */}
              <div className="applicationslist-search-container">
                <form onSubmit={handleSearch} className="applicationslist-search-form">
                  <div className="applicationslist-search-input-wrapper">
                    <div className="applicationslist-input-group">
                      <svg
                        className="search-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search by applicant name or email"
                        className="applicationslist-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="applicationslist-search-btn">
                      <span>Search</span>
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>

              {/* Stats Section */}
              <div className="applicationslist-stats">
                <div className="applicationslist-stat-item">
                  <span className="applicationslist-stat-number">{totalApplicationsCount || 0}</span>
                  <span className="applicationslist-stat-label">Total Applications</span>
                </div>
                <div className="applicationslist-stat-divider"></div>
                <div className="applicationslist-stat-item">
                  <span className="applicationslist-stat-number">{statusCounts.pending}</span>
                  <span className="applicationslist-stat-label">Pending</span>
                </div>
                <div className="applicationslist-stat-divider"></div>
                <div className="applicationslist-stat-item">
                  <span className="applicationslist-stat-number">{statusCounts.reviewed}</span>
                  <span className="applicationslist-stat-label">Reviewed</span>
                </div>
                <div className="applicationslist-stat-divider"></div>
                <div className="applicationslist-stat-item">
                  <span className="applicationslist-stat-number">{statusCounts.accepted}</span>
                  <span className="applicationslist-stat-label">Accepted</span>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="applicationslist-decorations">
              <div className="applicationslist-floating-card applicationslist-floating-card-1">
                <div className="applicationslist-card-content">
                  <div className="applicationslist-status-dot applicationslist-status-green"></div>
                  <span className="applicationslist-card-text">Applications received</span>
                </div>
              </div>
              <div className="applicationslist-floating-card applicationslist-floating-card-2">
                <div className="applicationslist-card-content">
                  <div className="applicationslist-status-dot applicationslist-status-orange"></div>
                  <span className="applicationslist-card-text">Review progress</span>
                </div>
              </div>
              <div className="applicationslist-decoration-circle-1"></div>
              <div className="applicationslist-decoration-circle-2"></div>
            </div>
          </div>
        </div>
      </div>
      {/* Hero Section End */}

      {/* Filter and Applications List Section */}
      <div className="applicationslist-content-section">
        {/* Filter Section */}
        <div className="applicationslist-filter-section">
          <div className="applicationslist-filter-header">
            <h2 className="applicationslist-filter-title">Filter Applications</h2>
            <button className="applicationslist-clear-filters-btn" onClick={clearAllFilters}>
              Clear All Filters
            </button>
          </div>

          <div className="applicationslist-filter-options">
            <div className="applicationslist-filter-group">
              <label className="applicationslist-filter-label">Status</label>
              <select
                className="applicationslist-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="applicationslist-filter-group">
              <label className="applicationslist-filter-label">Applied Within</label>
              <select
                className="applicationslist-filter-select"
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}
              >
                <option value="">Any Time</option>
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="applicationslist-results-section">
          <div className="applicationslist-results-header">
            <div className="applicationslist-results-info">
              <h3 className="applicationslist-results-title">
                {loading ? "Loading..." : `${totalItems} Applications Found`}
              </h3>
              <p className="applicationslist-results-subtitle">
                {searchTerm && `Results for "${searchTerm}"`}
                {totalPages > 1 && ` - Page ${currentPage} of ${totalPages}`}
              </p>
            </div>

            <div className="applicationslist-sort-options">
              <label className="applicationslist-sort-label">Sort by:</label>
              <select
                className="applicationslist-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="status">Status</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="applicationslist-loading-container">
              <div className="applicationslist-loading-spinner"></div>
              <p className="applicationslist-loading-text">
                Loading applications...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="applicationslist-error-container">
              <svg
                className="applicationslist-error-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="applicationslist-error-title">Something went wrong</h3>
              <p className="applicationslist-error-message">{error}</p>
              <button className="applicationslist-retry-btn" onClick={handleRetry}>
                Try Again
              </button>
            </div>
          )}

          {/* Applications List */}
          {!loading && !error && (
            <>
              {totalItems === 0 ? (
                <div className="applicationslist-no-applications-container">
                  <svg
                    className="applicationslist-no-applications-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="applicationslist-no-applications-title">No applications found</h3>
                  <p className="applicationslist-no-applications-message">
                    {searchTerm || statusFilter || dateRangeFilter
                      ? "Try adjusting your search criteria to see more results."
                      : "No applications have been received for this job yet."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="applicationslist-applications-grid">
                    {currentApplications.map((application) => (
                      <ApplicationCard
                        key={application._id}
                        application={application}
                        onViewDetails={handleViewDetails}
                        onStatusUpdate={handleStatusUpdate}
                        showStatusActions={true}
                      />
                    ))}
                  </div>

                  {/* Pagination Component */}
                  <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ApplicationsList;