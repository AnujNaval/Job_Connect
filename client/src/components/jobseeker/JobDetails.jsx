import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJobs } from "../../context/JobContext";
import { useAuth } from "../../context/AuthContext";
import "../../styles/JobDetails.css";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { selectedJob, loading, error, fetchJobById, clearError } = useJobs();
  const { user } = useAuth();

  // Debug logging
  console.log("JobDetails Debug:", {
    jobId,
    selectedJob,
    loading,
    error,
    hasContext: !!useJobs,
  });

  useEffect(() => {
    console.log("useEffect triggered with jobId:", jobId);
    if (jobId) {
      console.log("Calling fetchJobById...");
      fetchJobById(jobId).catch((err) => {
        console.error("fetchJobById error:", err);
      });
    }
    return () => {
      console.log("Cleanup: clearing errors");
      clearError();
    };
  }, [jobId]);

  const handleApply = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Handle job application logic
    alert("Application functionality would be implemented here");
  };

  const handleEdit = () => {
    if(!user) {
        navigate("/login");
        return;
    }
    alert("Edit functionality would be implemented here");
  };

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(
        `Are you sure you want to delete the job "${selectedJob.title}"?\n\nThis action cannot be undone.`
    );
    
    if (!confirmDelete) {
        return;
    }

    // Additional confirmation for extra safety
    const doubleConfirm = window.confirm(
        "This will permanently delete the job posting. Are you absolutely sure?"
    );
    
    if (!doubleConfirm) {
        return;
    }

    setIsDeleting(true);
    try {
        // Add your delete API call here
        // await deleteJob(jobId);
        
        // Simulate API call for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert("Job deleted successfully!");
        navigate("/jobs");
    } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job. Please try again.");
    } finally {
        setIsDeleting(false);
    }
    };

  const formatSalary = (salary) => {
    if (!salary) return "Salary not specified";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCompanyInitials = (companyName) => {
    return (
      companyName
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "CO"
    );
  };

  // Show loading state
  if (loading) {
    console.log("Rendering loading state");
    return (
      <div className="job-details-page">
        <div className="job-loading-container">
          <div className="job-loading-content">
            <div className="job-loading-spinner"></div>
            <p className="job-loading-text">
              Loading job details... (ID: {jobId})
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state with more details
  if (error) {
    console.log("Rendering error state:", error);
    return (
      <div className="job-details-page">
        <div className="job-error-container">
          <div className="job-error-content">
            <div className="job-error-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h2 className="job-error-title">Oops! Something went wrong</h2>
            <p className="job-error-message">{error}</p>
            <div
              style={{
                marginTop: "1rem",
                fontSize: "0.875rem",
                color: "#6b7280",
              }}
            >
              <p>Debug Info:</p>
              <p>Job ID: {jobId}</p>
              <p>Error: {error}</p>
            </div>
            <button
              className="job-error-button"
              onClick={() => navigate("/jobs")}
            >
              <i className="fas fa-arrow-left"></i> Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedJob) {
    return (
      <div className="job-details-page">
        <div className="job-not-found-container">
          <div className="job-not-found-content">
            <div className="job-not-found-icon">
              <i className="fas fa-search"></i>
            </div>
            <h2 className="job-not-found-title">Job Not Found</h2>
            <p className="job-not-found-message">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <button
              className="job-not-found-button"
              onClick={() => navigate("/jobs")}
            >
              <i className="fas fa-arrow-left"></i> Browse Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      {/* Header Section */}
      <header className="job-header-section">
        <div className="job-header-container">
          <div className="job-header-main">
            <div className="job-info-section">
              <div className="company-header">
                <div className="company-avatar">
                  {getCompanyInitials(selectedJob.companyName)}
                </div>
                <div className="job-title-group">
                  <h1 className="details-job-title">{selectedJob.title}</h1>
                  <p className="details-company-name">
                    {selectedJob.companyName}
                  </p>
                </div>
              </div>

              <div className="job-meta">
                <div className="meta-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>
                    {selectedJob.city}, {selectedJob.country}
                  </span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-clock"></i>
                  <span>Posted {formatDate(selectedJob.jobPostedOn)}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-users"></i>
                  <span>{selectedJob.workMode}</span>
                </div>
              </div>

              <div className="job-tags">
                <span className="job-tag type-tag">{selectedJob.category}</span>
                <span className="job-tag type-tag">{selectedJob.jobType}</span>
                <span className="job-tag experience-tag">
                  {selectedJob.experienceLevel}
                </span>
              </div>
            </div>

            <div className="job-apply-section">
              <div className="salary-display">
                <h3 className="salary-amount">
                  {formatSalary(selectedJob.fixedSalary)}
                </h3>
                <p className="salary-period">per year</p>
              </div>
              {user?.role === "Job Seeker" && (
                <>
                  <button className="apply-button" onClick={handleApply}>
                    <i className="fas fa-paper-plane"></i> Apply Now
                  </button>
                  <p className="apply-note">Apply with your profile</p>
                </>
              )}
              {user?.role === "Employer" && (
                <>
                  <button className="apply-button" onClick={handleEdit}>
                    <i className="fas fa-edit"></i> Edit 
                  </button>
                  <button className="delete-button" onClick={handleDeleteClick}>
                    <i className="fas fa-trash"></i> Delete
                  </button>
                  <p className="apply-note">Manage this Job Posting</p>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="job-content-container">
        <div className="job-content-grid">
          {/* Left Column - Job Details */}
          <div className="job-main-content">
            {/* Job Description */}
            <div className="content-card">
              <h2 className="card-title">
                <i className="fas fa-file-alt"></i> Job Description
              </h2>
              <div className="details-job-description">
                {selectedJob.description}
              </div>
            </div>

            {/* Requirements (if available) */}
            <div className="content-card">
              <h2 className="card-title">
                <i className="fas fa-check-circle"></i> Requirements
              </h2>
              <ul className="requirements-list">
                <li className="requirement-item">
                  <div className="requirement-bullet"></div>
                  <div className="requirement-text">
                    {selectedJob.experienceLevel} experience required
                  </div>
                </li>
                <li className="requirement-item">
                  <div className="requirement-bullet"></div>
                  <div className="requirement-text">
                    Strong background in {selectedJob.category}
                  </div>
                </li>
                <li className="requirement-item">
                  <div className="requirement-bullet"></div>
                  <div className="requirement-text">
                    Excellent communication and teamwork skills
                  </div>
                </li>
                <li className="requirement-item">
                  <div className="requirement-bullet"></div>
                  <div className="requirement-text">
                    Available for {selectedJob.jobType} position
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="job-sidebar">
            {/* Job Details */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">
                <i className="fas fa-info-circle"></i> Job Details
              </h3>
              <div className="details-list">
                <div className="detail-row">
                  <span className="detail-label">Job Type</span>
                  <span className="detail-value">{selectedJob.jobType}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Experience Level</span>
                  <span className="detail-value">
                    {selectedJob.experienceLevel}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Work Mode</span>
                  <span className="detail-value">{selectedJob.workMode}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{selectedJob.category}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Posted On</span>
                  <span className="detail-value">
                    {formatDate(selectedJob.jobPostedOn)}
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">
                <i className="fas fa-map-marker-alt"></i> Location
              </h3>
              <div className="location-info">
                <i className="fas fa-map-marker-alt location-icon"></i>
                <div className="location-details">
                  <p className="location-city">
                    {selectedJob.city}, {selectedJob.country}
                  </p>
                  <p className="location-address">{selectedJob.location}</p>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">
                <i className="fas fa-building"></i> About Company
              </h3>
              <div className="sidebar-company-info">
                <div className="sidebar-company-logo">
                  {getCompanyInitials(selectedJob.companyName)}
                </div>
                <div className="sidebar-company-details">
                  <h4 className="sidebar-company-title">
                    {selectedJob.companyName}
                  </h4>
                  <p className="sidebar-company-type">Technology Company</p>
                </div>
              </div>
              <p className="sidebar-company-description">
                {selectedJob.companyName} is a leading company in the{" "}
                {selectedJob.category} industry, committed to innovation and
                excellence. We offer great opportunities for career growth and
                professional development.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetails;