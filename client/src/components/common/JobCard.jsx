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
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>
              {job.fixedSalary ? (
                <>
                  <i className="fa fa-indian-rupee-sign"></i>{" "}
                  {job.fixedSalary.toLocaleString("en-IN")}{" "}/ yr
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
