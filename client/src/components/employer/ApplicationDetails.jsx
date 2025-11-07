import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplications } from '../../context/ApplicationContext';
import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import '../../styles/ApplicationDetails.css';

const ApplicationDetails = () => {
  const { applicationId } = useParams(); // Get applicationId from URL
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    selectedApplication, 
    loading, 
    error, 
    getApplicationById, 
    updateApplicationStatus, 
    withdrawApplication,
    clearSelectedApplication,
    clearError 
  } = useApplications();
  const { fetchJobById, selectedJob } = useJobs();
  
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (applicationId) {
      getApplicationById(applicationId);
    }
    
    return () => {
      clearSelectedApplication();
      clearError();
    };
  }, [applicationId, getApplicationById, clearSelectedApplication, clearError]);

  useEffect(() => {
    if (selectedApplication?.job) {
      fetchJobById(selectedApplication.job);
    }
  }, [selectedApplication, fetchJobById]);

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedApplication) return;
    
    setActionLoading(true);
    try {
      await updateApplicationStatus(selectedApplication._id, newStatus);
      // Refresh the application data
      await getApplicationById(selectedApplication._id);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedApplication) return;
    
    if (window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      setActionLoading(true);
      try {
        await withdrawApplication(selectedApplication._id);
        navigate('/applications'); // Navigate back to applications list
      } catch (error) {
        console.error('Error withdrawing application:', error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleViewResume = () => {
    if (selectedApplication?.resume) {
      window.open(selectedApplication.resume, '_blank');
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

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'pending';
      case 'reviewed':
        return 'reviewed';
      case 'accepted':
        return 'accepted';
      case 'rejected':
        return 'rejected';
      default:
        return 'pending';
    }
  };

  const getTimelineItems = () => {
    if (!selectedApplication) return [];
    
    const items = [
      {
        title: 'Application Submitted',
        date: formatDate(selectedApplication.createdAt),
        status: 'completed'
      }
    ];

    if (selectedApplication.applicationStatus !== 'Pending') {
      items.push({
        title: `Application ${selectedApplication.applicationStatus}`,
        date: formatDate(selectedApplication.updatedAt),
        status: 'completed'
      });
    }

    return items;
  };

  if (loading) {
    return (
      <div className="application-details-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="application-details-page">
        <div className="error-container">
          <div className="error-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <p className="error-text">{error}</p>
          <button 
            className="action-button primary" 
            onClick={handleBack}
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  if (!selectedApplication) {
    return (
      <div className="application-details-page">
        <div className="error-container">
          <div className="error-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <p className="error-text">Application not found</p>
          <button 
            className="action-button primary" 
            onClick={handleBack}
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const canUpdateStatus = user?.role === 'Employer' && selectedJob?.postedBy === user._id;
  const canWithdraw = user?.role === 'Job Seeker' && selectedApplication.applicant === user._id && 
                     selectedApplication.applicationStatus === 'Pending';

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
                {selectedJob?.companyName || 'Company Name'} • {selectedJob?.location || 'Location'}
              </p>
            </div>
            <div className="application-meta">
              <div className="application-id">
                Application ID: {selectedApplication._id.slice(-8).toUpperCase()}
              </div>
              <div className="application-date">
                Submitted: {formatDate(selectedApplication.createdAt)}
              </div>
              <div className={`status-badge ${getStatusClass(selectedApplication.applicationStatus)}`}>
                <span className={`status-dot ${getStatusClass(selectedApplication.applicationStatus)}`}></span>
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
                <div className="card-icon">
                  <i className="fas fa-user"></i>
                </div>
                <h2 className="card-title">Personal Information</h2>
              </div>
              <div className="card-content">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{selectedApplication.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email Address</span>
                    <span className="info-value">{selectedApplication.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone Number</span>
                    <span className="info-value">{selectedApplication.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Address</span>
                    <span className="info-value">{selectedApplication.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="details-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fas fa-pen-alt"></i>
                </div>
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
                  <div className="card-icon">
                    <i className="fas fa-cog"></i>
                  </div>
                  <h2 className="card-title">Actions</h2>
                </div>
                <div className="card-content">
                  <div className="action-buttons">
                    {selectedApplication.applicationStatus === 'Pending' && (
                      <>
                        <button 
                          className="action-button secondary"
                          onClick={() => handleStatusUpdate('Reviewed')}
                          disabled={actionLoading}
                        >
                          {actionLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-eye"></i>} Mark as Reviewed
                        </button>
                        <button 
                          className="action-button primary"
                          onClick={() => handleStatusUpdate('Accepted')}
                          disabled={actionLoading}
                        >
                          {actionLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>} Accept Application
                        </button>
                        <button 
                          className="action-button danger"
                          onClick={() => handleStatusUpdate('Rejected')}
                          disabled={actionLoading}
                        >
                          {actionLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-times"></i>} Reject Application
                        </button>
                      </>
                    )}
                    {selectedApplication.applicationStatus === 'Reviewed' && (
                      <>
                        <button 
                          className="action-button primary"
                          onClick={() => handleStatusUpdate('Accepted')}
                          disabled={actionLoading}
                        >
                          {actionLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>} Accept Application
                        </button>
                        <button 
                          className="action-button danger"
                          onClick={() => handleStatusUpdate('Rejected')}
                          disabled={actionLoading}
                        >
                          {actionLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-times"></i>} Reject Application
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Withdraw Button for Job Seekers */}
            {canWithdraw && (
              <div className="details-card">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="fas fa-cog"></i>
                  </div>
                  <h2 className="card-title">Actions</h2>
                </div>
                <div className="card-content">
                  <div className="action-buttons">
                    <button 
                      className="action-button danger"
                      onClick={handleWithdraw}
                      disabled={actionLoading}
                    >
                      {actionLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash"></i>} Withdraw Application
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
                  <div className="sidebar-card-icon">
                    <i className="fas fa-briefcase"></i>
                  </div>
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
                <div className="sidebar-card-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <h3 className="sidebar-card-title">Resume</h3>
              </div>
              <div className="sidebar-card-content">
                <div className="resume-section">
                  <div className="resume-icon">
                    <i className="fas fa-file-pdf"></i>
                  </div>
                  <h4 className="resume-title">Resume Document</h4>
                  <p className="resume-subtitle">
                    Click below to view the uploaded resume
                  </p>
                  <button 
                    className="resume-button"
                    onClick={handleViewResume}
                  >
                    <i className="fas fa-eye"></i> View Resume
                  </button>
                </div>
              </div>
            </div>

            {/* Application Timeline */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <div className="sidebar-card-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <h3 className="sidebar-card-title">Application Timeline</h3>
              </div>
              <div className="sidebar-card-content">
                <div className="timeline">
                  {getTimelineItems().map((item, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-content">
                        <div className="timeline-title">{item.title}</div>
                        <div className="timeline-date">{item.date}</div>
                      </div>
                    </div>
                  ))}
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