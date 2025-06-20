import { useEffect, useState } from "react";
import { useJobs } from "../../context/JobContext";
import JobCard from "../common/JobCard";
import Pagination from "../common/Pagination"; 
import "../../styles/AllJobs.css";

function AllJobs() {
  const { jobs, loading, error, fetchAllJobs } = useJobs();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchAllJobs();
  }, []);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, locationFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Add your search logic here
    console.log("Searching for:", searchTerm, "in", locationFilter);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleViewDetails = (jobId) => {
    // Navigate to job details page
    // You can use React Router here
    console.log("View job:", jobId);
  };

  const handleApply = (jobId) => {
    // Handle job application
    console.log("Apply to job:", jobId);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of results section
    const resultsSection = document.querySelector('.jobs-results-section');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter jobs based on search criteria (you can expand this logic)
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === "" || 
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === "" ||
      job.location?.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  // Calculate pagination
  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

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
                  <span className="stat-number">{totalItems || 0}</span>
                  <span className="stat-label">
                    {searchTerm || locationFilter ? 'Matching Jobs' : 'Active Jobs'}
                  </span>
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
            <button
              className="clear-filters-btn"
              onClick={() => {
                setSearchTerm("");
                setLocationFilter("");
                setCurrentPage(1);
                // Reset other filters if you add them
              }}
            >
              Clear All Filters
            </button>
          </div>

          <div className="filter-options">
            <div className="filter-group">
              <label className="filter-label">Job Type</label>
              <select className="filter-select">
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Experience Level</label>
              <select className="filter-select">
                <option value="">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Salary Range</label>
              <select className="filter-select">
                <option value="">Any Salary</option>
                <option value="0-50000">Under &#8377;50,000</option>
                <option value="50000-80000">&#8377;50,000 - &#8377;80,000</option>
                <option value="80000-120000">&#8377;80,000 - &#8377;120,000</option>
                <option value="120000+">&#8377;120,000+</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Remote Work</label>
              <select className="filter-select">
                <option value="">Any</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
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
              <select className="sort-select">
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
              <button className="retry-btn" onClick={() => fetchAllJobs()}>
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
                  <button
                    className="browse-all-btn"
                    onClick={() => {
                      setSearchTerm("");
                      setLocationFilter("");
                      setCurrentPage(1);
                      fetchAllJobs();
                    }}
                  >
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