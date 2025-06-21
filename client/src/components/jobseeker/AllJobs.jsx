import { useEffect, useState } from "react";
import { useJobs } from "../../context/JobContext";
import JobCard from "../common/JobCard";
import Pagination from "../common/Pagination";
import "../../styles/AllJobs.css";

function AllJobs() {
  const { jobs, loading, error, fetchAllJobs } = useJobs();
  const [totalJobsCount, setTotalJobsCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [experienceLevelFilter, setExperienceLevelFilter] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [salaryRangeFilter, setSalaryRangeFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter options (matching your job schema enums)
  const jobTypes = ["Full-Time", "Internship", "Part-Time"];
  const experienceLevels = [
    "Entry Level",
    "Mid Level",
    "Senior Level",
    "Executive Level",
  ];
  const workModes = ["Remote", "On-site", "Hybrid"];
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
  const countries = [
    "India",
    "USA",
    "UK",
    "Canada",
    "Australia",
    "Germany",
    "Singapore",
  ];

  // Initial load - fetch all jobs without filters
  useEffect(() => {
    const initializeData = async () => {
      await fetchAllJobs({}); // Fetch all jobs without filters
      setIsInitialLoad(false);
    };
    initializeData();
  }, []);

  // Set total jobs count when jobs are loaded without filters
  useEffect(() => {
    if (!isInitialLoad && jobs && jobs.length > 0) {
      // Check if no filters are applied
      const hasFilters =
        searchTerm ||
        locationFilter ||
        jobTypeFilter ||
        experienceLevelFilter ||
        workModeFilter ||
        categoryFilter ||
        countryFilter;

      if (!hasFilters) {
        setTotalJobsCount(jobs.length);
      }
    }
  }, [
    jobs,
    isInitialLoad,
    searchTerm,
    locationFilter,
    jobTypeFilter,
    experienceLevelFilter,
    workModeFilter,
    categoryFilter,
    countryFilter,
  ]);

  // Fetch filtered jobs when filters change
  useEffect(() => {
    if (!isInitialLoad) {
      fetchFilteredJobs();
    }
  }, [
    searchTerm,
    locationFilter,
    jobTypeFilter,
    experienceLevelFilter,
    workModeFilter,
    categoryFilter,
    countryFilter,
    isInitialLoad,
  ]);

  // Reset to first page when filters change
  useEffect(() => {
    if (!isInitialLoad) {
      setCurrentPage(1);
    }
  }, [
    searchTerm,
    locationFilter,
    jobTypeFilter,
    experienceLevelFilter,
    workModeFilter,
    categoryFilter,
    countryFilter,
    isInitialLoad,
  ]);

  const fetchFilteredJobs = async () => {
    // Build query parameters object
    const queryParams = {};

    if (searchTerm.trim()) {
      // Since backend supports regex search on title and companyName
      queryParams.title = searchTerm.trim();
    }

    if (locationFilter.trim()) {
      queryParams.city = locationFilter.trim();
    }

    if (jobTypeFilter) {
      queryParams.jobType = jobTypeFilter;
    }

    if (experienceLevelFilter) {
      queryParams.experienceLevel = experienceLevelFilter;
    }

    if (workModeFilter) {
      queryParams.workMode = workModeFilter;
    }

    if (categoryFilter) {
      queryParams.category = categoryFilter;
    }

    if (countryFilter) {
      queryParams.country = countryFilter;
    }

    // Call fetchAllJobs with query parameters
    await fetchAllJobs(queryParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFilteredJobs();
    setCurrentPage(1);
  };

  const handleViewDetails = (jobId) => {
    // Navigate to job details page
    console.log("View job:", jobId);
  };

  const handleApply = (jobId) => {
    // Handle job application
    console.log("Apply to job:", jobId);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of results section
    const resultsSection = document.querySelector(".jobs-results-section");
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setJobTypeFilter("");
    setExperienceLevelFilter("");
    setWorkModeFilter("");
    setCategoryFilter("");
    setCountryFilter("");
    setSalaryRangeFilter("");
    setCurrentPage(1);
    // Fetch all jobs without filters
    fetchAllJobs({});
  };

  // Client-side filtering for salary range (since schema uses fixedSalary as Number)
  const filterJobsBySalary = (jobsList) => {
    if (!salaryRangeFilter) return jobsList;

    return jobsList.filter((job) => {
      const salary = job.fixedSalary || 0;

      switch (salaryRangeFilter) {
        case "0-500000":
          return salary < 500000;
        case "500000-800000":
          return salary >= 500000 && salary <= 800000;
        case "800000-1200000":
          return salary >= 800000 && salary <= 1200000;
        case "1200000+":
          return salary > 1200000;
        default:
          return true;
      }
    });
  };

  // Client-side sorting
  const sortJobs = (jobsList) => {
    const sortedJobs = [...jobsList];

    switch (sortBy) {
      case "newest":
        return sortedJobs.sort(
          (a, b) => new Date(b.jobPostedOn) - new Date(a.jobPostedOn)
        );
      case "oldest":
        return sortedJobs.sort(
          (a, b) => new Date(a.jobPostedOn) - new Date(b.jobPostedOn)
        );
      case "salary-high":
        return sortedJobs.sort(
          (a, b) => (b.fixedSalary || 0) - (a.fixedSalary || 0)
        );
      case "salary-low":
        return sortedJobs.sort(
          (a, b) => (a.fixedSalary || 0) - (b.fixedSalary || 0)
        );
      case "company":
        return sortedJobs.sort((a, b) =>
          (a.companyName || "").localeCompare(b.companyName || "")
        );
      default:
        return sortedJobs;
    }
  };

  // Apply client-side filters and sorting
  const processedJobs = sortJobs(filterJobsBySalary(jobs || []));

  // Calculate pagination
  const totalItems = processedJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = processedJobs.slice(startIndex, endIndex);

  return (
    <>
      {/* Heading Section Start */}
      <div className="alljobs-hero-section">
        <div className="alljobs-hero-container">
          <div className="alljobs-hero-content">
            <div className="alljobs-hero-text">
              <h1 className="alljobs-hero-title">
                Discover Your Next{" "}
                <span className="gradient-text">Career Move</span>
              </h1>
              <p className="alljobs-hero-description">
                Browse through thousands of job opportunities from top
                companies. Find the perfect role that matches your skills and
                ambitions.
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
                        placeholder="Job title, keywords, or company"
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <svg
                        className="location-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder="City, state, or remote"
                        className="search-input"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="search-btn">
                      <span>Search Jobs</span>
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
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Employers</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">10k+</span>
                  <span className="stat-label">Happy Hires</span>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="alljobs-decorations">
              <div className="floating-card floating-card-1">
                <div className="card-content">
                  <div className="status-dot status-green"></div>
                  <span className="card-text">New jobs daily</span>
                </div>
              </div>
              <div className="floating-card floating-card-2">
                <div className="card-content">
                  <div className="status-dot status-blue"></div>
                  <span className="card-text">Remote friendly</span>
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
              <label className="filter-label">Country</label>
              <select
                className="filter-select"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
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
              <label className="filter-label">Work Mode</label>
              <select
                className="filter-select"
                value={workModeFilter}
                onChange={(e) => setWorkModeFilter(e.target.value)}
              >
                <option value="">Any Mode</option>
                {workModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Salary Range</label>
              <select
                className="filter-select"
                value={salaryRangeFilter}
                onChange={(e) => setSalaryRangeFilter(e.target.value)}
              >
                <option value="">Any Salary</option>
                <option value="0-500000">Under ₹5,00,000</option>
                <option value="500000-800000">₹5,00,000 - ₹8,00,000</option>
                <option value="800000-1200000">₹8,00,000 - ₹12,00,000</option>
                <option value="1200000+">₹12,00,000+</option>
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
                {searchTerm && `Results for "${searchTerm}"`}
                {locationFilter && ` in ${locationFilter}`}
                {totalPages > 1 && ` - Page ${currentPage} of ${totalPages}`}
              </p>
            </div>

            <div className="sort-options">
              <label className="sort-label">Sort by:</label>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="salary-high">Salary: High to Low</option>
                <option value="salary-low">Salary: Low to High</option>
                <option value="company">Company A-Z</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">
                Finding the perfect jobs for you...
              </p>
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
              <button className="retry-btn" onClick={() => fetchAllJobs({})}>
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <h3 className="no-jobs-title">No jobs found</h3>
                  <p className="no-jobs-message">
                    Try adjusting your search criteria or browse all available
                    positions.
                  </p>
                  <button className="browse-all-btn" onClick={clearAllFilters}>
                    Browse All Jobs
                  </button>
                </div>
              ) : (
                <>
                  <div className="jobs-grid">
                    {currentJobs.map((job) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        onViewDetails={handleViewDetails}
                        onApply={handleApply}
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

export default AllJobs;
