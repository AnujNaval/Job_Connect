import React from "react";
import "./JobCard.css";

function JobCard({ job, onViewDetails, onApply }) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-company-info">
          <div className="company-details">
            <h4 className="job-title">{job.title || "Job Title"}</h4>
            <p className="company-name">{job.companyName || "Company Name"}</p>
          </div>
        </div>
        <div className="job-badge">{job.jobType || "Full Time"}</div>
      </div>

      <div className="job-card-body">
        <div className="job-info">
          <div className="job-info-item">
            <svg
              className="info-icon"
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
            <span>{job.city || "Location not specified"}</span>
          </div>

          <div className="job-info-item">
            <svg
              className="info-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
            <span>
              {job.fixedSalary ? (
                <>
                  <i className="fa fa-indian-rupee-sign"></i>{" "}
                  {job.fixedSalary.toLocaleString()}
                </>
              ) : (
                "Salary not disclosed"
              )}
            </span>
          </div>

          <div className="job-info-item">
            <svg
              className="info-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {job.jobPostedOn
                ? new Date(job.jobPostedOn).toLocaleDateString()
                : "Recently posted"}
            </span>
          </div>
        </div>

        <p className="job-description">
          {job.description?.substring(0, 120)}...
        </p>
      </div>

      <div className="job-card-footer">
        <button className="view-job-btn" onClick={() => onViewDetails(job._id)}>
          View Details
        </button>
        <button className="apply-job-btn" onClick={() => onApply(job._id)}>
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default JobCard;
