import { useEffect, useState } from "react";
import { useApplications } from "../../context/ApplicationContext";
import ApplicationCard from "../common/ApplicationCard";
import Pagination from "../common/Pagination";
import "../../styles/MyApplications.css";

function MyApplications() {
  const { userApplications, loading, error, getUserApplications } = useApplications();
  const [totalApplicationsCount, setTotalApplicationsCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Application status options
  const statusOptions = ["Pending", "Reviewed", "Accepted", "Rejected"];
  
  // Job type options
  const jobTypes = ["Full-Time", "Internship", "Part-Time"];
  
  // Date range options
  const dateRanges = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 3 months" },
    { value: "365", label: "Last year" }
  ];

  // Initial load - fetch user applications
  useEffect(() => {
    const initializeData = async () => {
      await getUserApplications();
      setIsInitialLoad(false);
    };
    initializeData();
  }, [getUserApplications]);

  // Set total applications count when applications are loaded
  useEffect(() => {
    if (!isInitialLoad && userApplications && userApplications.length > 0) {
      // Check if no filters are applied
      const hasFilters =
        searchTerm ||
        companyFilter ||
        statusFilter ||
        jobTypeFilter ||
        locationFilter ||
        dateRangeFilter;

      if (!hasFilters) {
        setTotalApplicationsCount(userApplications.length);
      }
    }
  }, [
    userApplications,
    isInitialLoad,
    searchTerm,
    companyFilter,
    statusFilter,
    jobTypeFilter,
    locationFilter,
    dateRangeFilter,
  ]);

  // Reset to first page when filters change
  useEffect(() => {
    if (!isInitialLoad) {
      setCurrentPage(1);
    }
  }, [
    searchTerm,
    companyFilter,
    statusFilter,
    jobTypeFilter,
    locationFilter,
    dateRangeFilter,
    isInitialLoad,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleViewDetails = (applicationId) => {
    console.log("View application:", applicationId);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of results section
    const resultsSection = document.querySelector(".applications-results-section");
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setCompanyFilter("");
    setStatusFilter("");
    setJobTypeFilter("");
    setLocationFilter("");
    setDateRangeFilter("");
    setCurrentPage(1);
  };

  // Client-side filtering
  const filterApplications = (applicationsList) => {
    if (!applicationsList) return [];

    return applicationsList.filter((application) => {
      // Search term filter (job title or company name)
      if (searchTerm.trim()) {
        const jobTitle = application.job?.title || "";
        const companyName = application.job?.companyName || "";
        const searchLower = searchTerm.toLowerCase();
        
        if (!jobTitle.toLowerCase().includes(searchLower) && 
            !companyName.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Company filter
      if (companyFilter.trim()) {
        const companyName = application.job?.companyName || "";
        if (!companyName.toLowerCase().includes(companyFilter.toLowerCase())) {
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

      // Job type filter
      if (jobTypeFilter) {
        const jobType = application.job?.jobType || "";
        if (jobType !== jobTypeFilter) {
          return false;
        }
      }

      // Location filter
      if (locationFilter.trim()) {
        const jobLocation = application.job?.city || "";
        if (!jobLocation.toLowerCase().includes(locationFilter.toLowerCase())) {
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
      case "company":
        return sortedApplications.sort((a, b) =>
          (a.job?.companyName || "").localeCompare(b.job?.companyName || "")
        );
      case "job-title":
        return sortedApplications.sort((a, b) =>
          (a.job?.title || "").localeCompare(b.job?.title || "")
        );
      default:
        return sortedApplications;
    }
  };

  // Apply client-side filters and sorting
  const processedApplications = sortApplications(filterApplications(userApplications || []));

  // Calculate pagination
  const totalItems = processedApplications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = processedApplications.slice(startIndex, endIndex);

  // Calculate status counts for stats
  const getStatusCounts = () => {
    const applications = userApplications || [];
    return {
      pending: applications.filter(app => (app.applicationStatus || "Pending") === "Pending").length,
      reviewed: applications.filter(app => app.applicationStatus === "Reviewed").length,
      accepted: applications.filter(app => app.applicationStatus === "Accepted").length,
      rejected: applications.filter(app => app.applicationStatus === "Rejected").length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <>
      {/* Hero Section Start */}
      <div className="myapplications-hero-section">
        <div className="myapplications-hero-container">
          <div className="myapplications-hero-content">
            <div className="myapplications-hero-text">
              <h1 className="myapplications-hero-title">
                Your Job{" "}
                <span className="gradient-text">Applications</span>
              </h1>
              <p className="myapplications-hero-description">
                Track and manage all your job applications in one place. Stay 
                updated on your application status and never miss an opportunity.
              </p>

              {/* Search Section */}
              <div className="myapplications-search-container">
                <form onSubmit={handleSearch} className="myapplications-search-form">
                  <div className="application-search-input-wrapper">
                    <div className="application-input-group">
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
                        placeholder="Search by job title or company"
                        className="application-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="application-search-btn">
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
              <div className="myapplications-stats">
                <div className="application-stat-item">
                  <span className="application-stat-number">{totalApplicationsCount || 0}</span>
                  <span className="application-stat-label">Total Applications</span>
                </div>
                <div className="application-stat-divider"></div>
                <div className="application-stat-item">
                  <span className="application-stat-number">{statusCounts.pending}</span>
                  <span className="application-stat-label">Pending</span>
                </div>
                <div className="application-stat-divider"></div>
                <div className="application-stat-item">
                  <span className="application-stat-number">{statusCounts.accepted}</span>
                  <span className="application-stat-label">Accepted</span>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="myapplications-decorations">
              <div className="application-floating-card application-floating-card-1">
                <div className="application-card-content">
                  <div className="application-status-dot application-status-green"></div>
                  <span className="application-card-text">Applications tracked</span>
                </div>
              </div>
              <div className="application-floating-card application-floating-card-2">
                <div className="application-card-content">
                  <div className="application-status-dot application-status-orange"></div>
                  <span className="application-card-text">Status updates</span>
                </div>
              </div>
              <div className="application-decoration-circle-1"></div>
              <div className="application-decoration-circle-2"></div>
            </div>
          </div>
        </div>
      </div>
      {/* Hero Section End */}

      {/* Filter and Applications List Section */}
      <div className="applications-content-section">
        {/* Filter Section */}
        <div className="applications-filter-section">
          <div className="application-filter-header">
            <h2 className="application-filter-title">Filter Applications</h2>
            <button className="application-clear-filters-btn" onClick={clearAllFilters}>
              Clear All Filters
            </button>
          </div>

          <div className="application-filter-options">
            <div className="application-filter-group">
              <label className="application-filter-label">Status</label>
              <select
                className="application-filter-select"
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

            <div className="application-filter-group">
              <label className="application-filter-label">Company</label>
              <input
                type="text"
                className="application-filter-select"
                placeholder="Filter by company"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
              />
            </div>

            <div className="application-filter-group">
              <label className="application-filter-label">Job Type</label>
              <select
                className="application-filter-select"
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="application-filter-group">
              <label className="application-filter-label">Applied Within</label>
              <select
                className="application-filter-select"
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
        <div className="applications-results-section">
          <div className="application-results-header">
            <div className="application-results-info">
              <h3 className="application-results-title">
                {loading ? "Loading..." : `${totalItems} Applications Found`}
              </h3>
              <p className="application-results-subtitle">
                {searchTerm && `Results for "${searchTerm}"`}
                {totalPages > 1 && ` - Page ${currentPage} of ${totalPages}`}
              </p>
            </div>

            <div className="application-sort-options">
              <label className="application-sort-label">Sort by:</label>
              <select
                className="application-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="status">Status</option>
                <option value="company">Company A-Z</option>
                <option value="job-title">Job Title A-Z</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="application-loading-container">
              <div className="application-loading-spinner"></div>
              <p className="application-loading-text">
                Loading your applications...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="application-error-container">
              <svg
                className="application-error-icon"
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
              <h3 className="application-error-title">Something went wrong</h3>
              <p className="application-error-message">{error}</p>
              <button className="application-retry-btn" onClick={getUserApplications}>
                Try Again
              </button>
            </div>
          )}

          {/* Applications List */}
          {!loading && !error && (
            <>
              {totalItems === 0 ? (
                <div className="no-applications-container">
                  <svg
                    className="no-applications-icon"
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
                  <h3 className="no-applications-title">No applications found</h3>
                  <p className="no-applications-message">
                    {searchTerm || companyFilter || statusFilter || jobTypeFilter || locationFilter || dateRangeFilter
                      ? "Try adjusting your search criteria to see more results."
                      : "You haven't applied to any jobs yet. Start exploring opportunities!"}
                  </p>
                  {!(searchTerm || companyFilter || statusFilter || jobTypeFilter || locationFilter || dateRangeFilter) && (
                    <a href="/jobs" className="browse-jobs-btn">
                      Browse Jobs
                    </a>
                  )}
                </div>
              ) : (
                <>
                  <div className="applications-grid">
                    {currentApplications.map((application) => (
                      <ApplicationCard
                        key={application._id}
                        application={application}
                        onViewDetails={handleViewDetails}
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

export default MyApplications;