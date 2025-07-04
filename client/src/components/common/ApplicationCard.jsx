import "./ApplicationCard.css";
import { useApplications } from "../../context/ApplicationContext";
import { Link } from "react-router-dom";
import { useState } from "react";

function ApplicationCard({ application, onViewDetails }) {
  const { withdrawApplication, loading } = useApplications();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdrawApplication = async () => {
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      setIsWithdrawing(true);
      try {
        await withdrawApplication(application._id);
        alert("Application withdrawn successfully!");
      } catch (error) {
        alert(error.response?.data?.message || "Failed to withdraw application");
      } finally {
        setIsWithdrawing(false);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "reviewed":
        return "status-reviewed";
      case "accepted":
        return "status-accepted";
      case "rejected":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle cases where job might be populated or just an ID
  const jobTitle = application.job?.title || "Job Title Not Available";
  const companyName = application.job?.companyName || "Company Name Not Available";
  const jobLocation = application.job?.city || "Location Not Specified";
  const jobSalary = application.job?.fixedSalary;

  return (
    <div className="application-card">
      <div className="application-card-header">
        <div className="application-job-info">
          <div className="job-details">
            <h4 className="application-job-title">{jobTitle}</h4>
            <p className="application-company-name">{companyName}</p>
          </div>
        </div>
        <div className={`application-status-badge ${getStatusBadgeClass(application.applicationStatus)}`}>
          {application.applicationStatus || "Pending"}
        </div>
      </div>

      <div className="application-card-body">
        <div className="application-info">
          <div className="application-info-item">
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
            <span>{jobLocation}</span>
          </div>

          {jobSalary && (
            <div className="application-info-item">
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
                <i className="fa fa-indian-rupee-sign"></i>{" "}
                {jobSalary.toLocaleString("en-IN")} / yr
              </span>
            </div>
          )}

          <div className="application-info-item">
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
            <span>Applied on {formatDate(application.createdAt)}</span>
          </div>

          <div className="application-info-item">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>{application.name}</span>
          </div>

          <div className="application-info-item">
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
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>{application.email}</span>
          </div>

          <div className="application-info-item">
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
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{application.phone}</span>
          </div>
        </div>

        {application.coverLetter && (
          <p className="application-cover-letter">
            "{application.coverLetter.substring(0, 150)}..."
          </p>
        )}
      </div>

      <div className="application-card-footer">
        <Link 
          to={`/application/${application._id}`} 
          className="view-application-btn"
          onClick={onViewDetails}
        >
          View Details
        </Link>
        
        <button
          className="withdraw-application-btn"
          onClick={handleWithdrawApplication}
          disabled={isWithdrawing || loading || application.applicationStatus === "Rejected" || application.applicationStatus === "Accepted"}
        >
          {isWithdrawing ? "Withdrawing..." : "Withdraw Application"}
        </button>
      </div>
    </div>
  );
}

export default ApplicationCard;