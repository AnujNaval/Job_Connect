import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplications } from '../../context/ApplicationContext';
import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import '../../styles/ApplicationDetails.css';

const ApplicationDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    selectedApplication, 
    getApplicationById, 
    updateApplicationStatus,
    withdrawApplication,
    loading: appLoading,
    error: appError,
    clearError
  } = useApplications();
  const { 
    selectedJob, 
    fetchJobById, 
    loading: jobLoading,
    error: jobError
  } = useJobs();

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (applicationId) {
      getApplicationById(applicationId);
      clearError();
    }
  }, [applicationId, getApplicationById, clearError]);

  useEffect(() => {
    if (selectedApplication?.job) {
      fetchJobById(selectedApplication.job);
    }
  }, [selectedApplication, fetchJobById]);

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedApplication || !user || user.role !== 'Employer') return;
    
    setActionLoading(true);
    try {
      await updateApplicationStatus(selectedApplication._id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdrawApplication = async () => {
    if (!selectedApplication || !user || user.role !== 'Job Seeker') return;
    
    if (window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      setActionLoading(true);
      try {
        await withdrawApplication(selectedApplication._id);
        alert('Application withdrawn successfully!');
        navigate('/my-applications');
      } catch (error) {
        console.error('Error withdrawing application:', error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'pending';
      case 'reviewed': return 'reviewed';
      case 'accepted': return 'accepted';
      case 'rejected': return 'rejected';
      default: return 'pending';
    }
  };

  const canUpdateStatus = user?.role === 'Employer' && selectedApplication;
  const canWithdraw = user?.role === 'Job Seeker' && selectedApplication?.applicationStatus !== 'Accepted' && selectedApplication?.applicationStatus !== 'Rejected';

  if (appLoading || jobLoading) {
    return (
      <div className="application-details-page">
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          <div className="loading-text">Loading application details...</div>
        </div>
      </div>
    );
  }

  if (appError || jobError || !selectedApplication) {
    return (
      <div className="application-details-page">
        <div className="error-container">
          <i className="fas fa-exclamation-triangle"></i>
          <div className="error-text">
            {appError || jobError || 'Application not found'}
          </div>
          <button 
            className="action-button primary"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-chevron-left"></i> Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="application-details-page">
      <div className="application-details-container">
        {/* Header Section */}
        <div className="application-header">
          <div className="application-header-content">
            <div className="application-title-section">
              <h1 className="application-title">
                Application for {selectedJob?.title || 'Job Position'}
              </h1>
              <p className="application-subtitle">
                {selectedJob?.companyName || 'Company Name'}
              </p>
            </div>
            
            <div className="application-meta">
              <div className="application-id">
                Application ID: {selectedApplication._id.slice(-8).toUpperCase()}
              </div>
              <div className="application-date">
                Submitted: {formatDate(selectedApplication.createdAt)}
              </div>
              <div className={`status-badge ${getStatusColor(selectedApplication.applicationStatus)}`}>
                <div className={`status-dot ${getStatusColor(selectedApplication.applicationStatus)}`}></div>
                {selectedApplication.applicationStatus}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="application-content">
          {/* Left Column - Main Details */}
          <div className="application-main">
            {/* Personal Information */}
            <div className="details-card">
              <div className="card-header">
                <i className="fas fa-user"></i>
                <h2 className="card-title">Personal Information</h2>
              </div>
              <div className="card-content">
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">Full Name</div>
                    <div className="info-value">{selectedApplication.name}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Email Address</div>
                    <div className="info-value">{selectedApplication.email}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Phone Number</div>
                    <div className="info-value">{selectedApplication.phone}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Address</div>
                    <div className="info-value">{selectedApplication.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="details-card">
              <div className="card-header">
                <i className="fas fa-file-alt"></i>
                <h2 className="card-title">Cover Letter</h2>
              </div>
              <div className="card-content">
                <div className="cover-letter-content">
                  {selectedApplication.coverLetter}
                </div>
              </div>
            </div>

            {/* Action Buttons for Employers */}
            {canUpdateStatus && (
              <div className="details-card">
                <div className="card-header">
                  <i className="fas fa-cog"></i>
                  <h2 className="card-title">Application Actions</h2>
                </div>
                <div className="card-content">
                  <div className="action-buttons">
                    <button
                      className="action-button primary"
                      onClick={() => handleStatusUpdate('Reviewed')}
                      disabled={actionLoading || selectedApplication.applicationStatus === 'Reviewed'}
                    >
                      <i className="fas fa-eye"></i> Mark as Reviewed
                    </button>
                    <button
                      className="action-button primary"
                      onClick={() => handleStatusUpdate('Accepted')}
                      disabled={actionLoading || selectedApplication.applicationStatus === 'Accepted'}
                    >
                      <i className="fas fa-check"></i> Accept Application
                    </button>
                    <button
                      className="action-button danger"
                      onClick={() => handleStatusUpdate('Rejected')}
                      disabled={actionLoading || selectedApplication.applicationStatus === 'Rejected'}
                    >
                      <i className="fas fa-times"></i> Reject Application
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="application-sidebar">
            {/* Job Details */}
            {selectedJob && (
              <div className="sidebar-card">
                <div className="sidebar-card-header">
                  <i className="fas fa-briefcase"></i>
                  <h3 className="sidebar-card-title">Job Details</h3>
                </div>
                <div className="sidebar-card-content">
                  <div className="job-detail-item">
                    <span className="job-detail-label">Position</span>
                    <span className="job-detail-value">{selectedJob.title}</span>
                  </div>
                  <div className="job-detail-item">
                    <span className="job-detail-label">Company</span>
                    <span className="job-detail-value">{selectedJob.companyName}</span>
                  </div>
                  <div className="job-detail-item">
                    <span className="job-detail-label">Location</span>
                    <span className="job-detail-value">{selectedJob.city}, {selectedJob.country}</span>
                  </div>
                  <div className="job-detail-item">
                    <span className="job-detail-label">Job Type</span>
                    <span className="job-detail-value">{selectedJob.jobType}</span>
                  </div>
                  <div className="job-detail-item">
                    <span className="job-detail-label">Experience</span>
                    <span className="job-detail-value">{selectedJob.experienceLevel}</span>
                  </div>
                  <div className="job-detail-item">
                    <span className="job-detail-label">Work Mode</span>
                    <span className="job-detail-value">{selectedJob.workMode}</span>
                  </div>
                  {selectedJob.fixedSalary && (
                    <div className="job-detail-item">
                      <span className="job-detail-label">Salary</span>
                      <span className="job-detail-value">${selectedJob.fixedSalary.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Resume Section */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <i className="fas fa-file-pdf"></i>
                <h3 className="sidebar-card-title">Resume</h3>
              </div>
              <div className="sidebar-card-content">
                <div className="resume-section">
                  <i className="fas fa-paperclip"></i>
                  <div className="resume-title">Resume Document</div>
                  <div className="resume-subtitle">
                    Click to view or download the applicant's resume
                  </div>
                  <a 
                    href={selectedApplication.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-button"
                  >
                    <i className="fas fa-download"></i> View Resume
                  </a>
                </div>
              </div>
            </div>

            {/* Application Timeline */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <i className="fas fa-calendar-alt"></i>
                <h3 className="sidebar-card-title">Application Timeline</h3>
              </div>
              <div className="sidebar-card-content">
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-content">
                      <div className="timeline-title">Application Submitted</div>
                      <div className="timeline-date">
                        {formatDate(selectedApplication.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  {selectedApplication.updatedAt !== selectedApplication.createdAt && (
                    <div className="timeline-item">
                      <div className="timeline-content">
                        <div className="timeline-title">Status Updated</div>
                        <div className="timeline-date">
                          {formatDate(selectedApplication.updatedAt)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="timeline-item">
                    <div className="timeline-content">
                      <div className="timeline-title">Current Status</div>
                      <div className="timeline-date">
                        {selectedApplication.applicationStatus}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <i className="fas fa-bolt"></i>
                <h3 className="sidebar-card-title">Quick Actions</h3>
              </div>
              <div className="sidebar-card-content">
                <div className="action-buttons">
                  <button
                    className="action-button secondary"
                    onClick={() => navigate(-1)}
                  >
                    <i className="fas fa-chevron-left"></i> Back to Applications
                  </button>
                  
                  {canWithdraw && (
                    <button
                      className="action-button danger"
                      onClick={handleWithdrawApplication}
                      disabled={actionLoading}
                    >
                      <i className="fas fa-trash-alt"></i> Withdraw Application
                    </button>
                  )}
                  
                  {selectedJob && (
                    <button
                      className="action-button primary"
                      onClick={() => navigate(`/job-details/${selectedJob._id}`)}
                    >
                      <i className="fas fa-eye"></i> View Job Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;