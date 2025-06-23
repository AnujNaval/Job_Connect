import { useEffect, useState } from "react";
import { useJobs } from "../../context/JobContext";
import JobCard from "../common/JobCard";
import Pagination from "../common/Pagination";
import "../../styles/AllJobs.css";
import "../../styles/JobList.css";

function JobList() {
  const { myJobs, loading, error, fetchMyJobs } = useJobs();
  const [totalJobsCount, setTotalJobsCount] = useState(0);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [experienceLevelFilter, setExperienceLevelFilter] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter options
  const jobTypes = ["Full-Time", "Internship", "Part-Time"];
  const statusOptions = ["Active", "Expired", "Draft"];
  const categories = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Marketing",
    "Design",
    "Engineering",
    "Sales",
    "Other",
  ];
  const experienceLevels = [
    "Entry Level",
    "Mid Level",
    "Senior Level",
    "Executive Level",
  ];

  // Fetch employer's jobs on initial load
  useEffect(() => {
    fetchMyJobs();
  }, []);

  // Set total jobs count
  useEffect(() => {
    if (myJobs && myJobs.length > 0) {
      setTotalJobsCount(myJobs.length);
    }
  }, [myJobs]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, jobTypeFilter, statusFilter, categoryFilter, experienceLevelFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const resultsSection = document.querySelector(".jobs-results-section");
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setJobTypeFilter("");
    setStatusFilter("");
    setCategoryFilter("");
    setExperienceLevelFilter("");
    setCurrentPage(1);
  };

  // Filter jobs based on status and other criteria
  const filteredJobs = myJobs?.filter((job) => {
    // Status filtering logic based on schema
    let statusMatch = true;
    if (statusFilter) {
      if (statusFilter === "Active") {
        statusMatch = !job.expired;
      } else if (statusFilter === "Expired") {
        statusMatch = job.expired;
      } else if (statusFilter === "Draft") {
        statusMatch = !job.jobPostedOn || job.status === "Draft";
      }
    }

    return (
      (!searchTerm ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!jobTypeFilter || job.jobType === jobTypeFilter) &&
      (!categoryFilter || job.category === categoryFilter) &&
      (!experienceLevelFilter || job.experienceLevel === experienceLevelFilter) &&
      statusMatch
    );
  }) || [];

  // Sort by newest first by default
  const sortedJobs = [...filteredJobs].sort(
    (a, b) => new Date(b.jobPostedOn) - new Date(a.jobPostedOn)
  );

  // Pagination
  const totalItems = sortedJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = sortedJobs.slice(startIndex, endIndex);

  // Calculate status counts
  const activeJobsCount = myJobs?.filter((job) => !job.expired).length || 0;
  const expiredJobsCount = myJobs?.filter((job) => job.expired).length || 0;
  const draftJobsCount = myJobs?.filter((job) => !job.jobPostedOn || job.status === "Draft").length || 0;

  return (
    <>
      {/* Heading Section Start */}
      <div className="alljobs-hero-section">
        <div className="alljobs-hero-container">
          <div className="alljobs-hero-content">
            <div className="alljobs-hero-text">
              <h1 className="alljobs-hero-title">
                Manage Your <span className="gradient-text">Job Postings</span>
              </h1>
              <p className="alljobs-hero-description">
                View and manage all your job listings in one place. Track
                applications, update status, and find the best candidates for
                your open positions.
              </p>

              {/* Search Section */}
              <div className="alljobs-search-container">
                <form onSubmit={handleSearch} className="alljobs-search-form">
                  <div className="search-input-wrapper">
                    <div className="input-group">
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
                        placeholder="Search your jobs"
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="search-btn">
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
              <div className="alljobs-stats">
                <div className="stat-item">
                  <span className="stat-number">{totalJobsCount || 0}</span>
                  <span className="stat-label">Total Jobs</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">
                    {activeJobsCount || 0}
                  </span>
                  <span className="stat-label">Active</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">
                    {expiredJobsCount || 0}
                  </span>
                  <span className="stat-label">Expired</span>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="alljobs-decorations">
              <div className="floating-card floating-card-1">
                <div className="card-content">
                  <div className="status-dot status-green"></div>
                  <span className="card-text">Track applications</span>
                </div>
              </div>
              <div className="floating-card floating-card-2">
                <div className="card-content">
                  <div className="status-dot status-blue"></div>
                  <span className="card-text">Edit anytime</span>
                </div>
              </div>
              <div className="decoration-circle-1"></div>
              <div className="decoration-circle-2"></div>
            </div>
          </div>
        </div>
      </div>
      {/* Heading Section End */}

      {/* Filter and Jobs List Section */}
      <div className="jobs-content-section">
        {/* Filter Section */}
        <div className="jobs-filter-section">
          <div className="filter-header">
            <h2 className="filter-title">Filter Jobs</h2>
            <button className="clear-filters-btn" onClick={clearAllFilters}>
              Clear All Filters
            </button>
          </div>

          <div className="filter-options">
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select
                className="filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Job Type</label>
              <select
                className="filter-select"
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

            <div className="filter-group">
              <label className="filter-label">Experience Level</label>
              <select
                className="filter-select"
                value={experienceLevelFilter}
                onChange={(e) => setExperienceLevelFilter(e.target.value)}
              >
                <option value="">All Levels</option>
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active ({activeJobsCount})</option>
                <option value="Expired">Expired ({expiredJobsCount})</option>
                <option value="Draft">Drafts ({draftJobsCount})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="jobs-results-section">
          <div className="results-header">
            <div className="results-info">
              <h3 className="results-title">
                {loading ? "Loading..." : `${totalItems} Jobs Found`}
              </h3>
              <p className="results-subtitle">
                {totalPages > 1 && `Page ${currentPage} of ${totalPages}`}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading your job listings...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-container">
              <svg
                className="error-icon"
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
              <h3 className="error-title">Something went wrong</h3>
              <p className="error-message">{error}</p>
              <button className="retry-btn" onClick={fetchMyJobs}>
                Try Again
              </button>
            </div>
          )}

          {/* Jobs List */}
          {!loading && !error && (
            <>
              {totalItems === 0 ? (
                <div className="no-jobs-container">
                  <svg
                    className="no-jobs-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <h3 className="no-jobs-title">No jobs found</h3>
                  <p className="no-jobs-message">
                    {myJobs?.length === 0
                      ? "You haven't posted any jobs yet."
                      : "Try adjusting your search criteria."}
                  </p>
                  <button className="browse-all-btn" onClick={clearAllFilters}>
                    {myJobs?.length === 0 ? "Post a Job" : "Show All Jobs"}
                  </button>
                </div>
              ) : (
                <>
                  <div className="jobs-grid">
                    {currentJobs.map((job) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        variant="employer"
                        showStatus={true}
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

export default JobList;