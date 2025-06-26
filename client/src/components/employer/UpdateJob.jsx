import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobs } from "../../context/JobContext";
import { useAuth } from "../../context/AuthContext";
import "../../styles/UpdateJob.css";

const UpdateJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    selectedJob, 
    fetchJobById, 
    updateJob, 
    loading, 
    error, 
    clearError 
  } = useJobs();

  const [formData, setFormData] = useState({
    companyName: '',
    title: '',
    description: '',
    category: '',
    country: '',
    city: '',
    location: '',
    fixedSalary: '',
    jobType: '',
    experienceLevel: '',
    workMode: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Category options based on schema
  const categoryOptions = [
    'Technology', 'Healthcare', 'Finance', 'Education', 
    'Marketing', 'Design', 'Engineering', 'Sales', 'Other'
  ];

  // Job type options based on schema
  const jobTypeOptions = ['Full-Time', 'Internship', 'Part-Time'];

  // Experience level options based on schema
  const experienceLevelOptions = [
    'Entry Level', 'Mid Level', 'Senior Level', 'Executive Level'
  ];

  // Work mode options based on schema
  const workModeOptions = ['Remote', 'On-site', 'Hybrid'];

  useEffect(() => {
    // Check if user is authorized
    if (!user || user.role !== 'Employer') {
      navigate('/login');
      return;
    }

    // Fetch job details only if we don't have the job or it's a different job
    if (jobId && (!selectedJob || selectedJob._id !== jobId)) {
      fetchJobById(jobId);
    }

    // Clear any existing errors
    clearError();
  }, [jobId, user?.role, navigate]); // Removed fetchJobById and clearError from dependencies

  useEffect(() => {
    // Populate form when job data is loaded
    if (selectedJob) {
      setFormData({
        companyName: selectedJob.companyName || '',
        title: selectedJob.title || '',
        description: selectedJob.description || '',
        category: selectedJob.category || '',
        country: selectedJob.country || '',
        city: selectedJob.city || '',
        location: selectedJob.location || '',
        fixedSalary: selectedJob.fixedSalary || '',
        jobType: selectedJob.jobType || '',
        experienceLevel: selectedJob.experienceLevel || '',
        workMode: selectedJob.workMode || ''
      });
    }
  }, [selectedJob]);

  const validateForm = () => {
    const errors = {};

    // Company name validation
    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    } else if (formData.companyName.length < 3) {
      errors.companyName = 'Company name must be at least 3 characters';
    } else if (formData.companyName.length > 30) {
      errors.companyName = 'Company name cannot exceed 30 characters';
    }

    // Title validation
    if (!formData.title.trim()) {
      errors.title = 'Job title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 30) {
      errors.title = 'Title cannot exceed 30 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.description = 'Job description is required';
    } else if (formData.description.length < 30) {
      errors.description = 'Description must be at least 30 characters';
    } else if (formData.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }

    // Category validation
    if (!formData.category) {
      errors.category = 'Please select a category';
    }

    // Country validation
    if (!formData.country.trim()) {
      errors.country = 'Country is required';
    }

    // City validation
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    // Location validation
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    } else if (formData.location.length < 20) {
      errors.location = 'Location must be at least 20 characters';
    }

    // Salary validation
    if (!formData.fixedSalary) {
      errors.fixedSalary = 'Salary is required';
    } else if (formData.fixedSalary.toString().length < 4) {
      errors.fixedSalary = 'Salary must be at least 4 digits';
    } else if (formData.fixedSalary.toString().length > 9) {
      errors.fixedSalary = 'Salary cannot exceed 9 digits';
    }

    // Job type validation
    if (!formData.jobType) {
      errors.jobType = 'Please select a job type';
    }

    // Experience level validation
    if (!formData.experienceLevel) {
      errors.experienceLevel = 'Please select an experience level';
    }

    // Work mode validation
    if (!formData.workMode) {
      errors.workMode = 'Please select a work mode';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear success message when user starts editing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      await updateJob(jobId, {
        ...formData,
        fixedSalary: parseInt(formData.fixedSalary, 10)
      });

      setSuccessMessage('Job updated successfully!');
      
      // Redirect to job details or employer dashboard after a short delay
      setTimeout(() => {
        navigate('/my-jobs');
      }, 2000);
    } catch (err) {
      // Error is handled by the context
      console.error('Error updating job:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/employer/jobs');
  };

  // Loading skeleton
  if (loading && !selectedJob) {
    return (
      <section className="update-job-section">
        <div className="update-job-container">
          <div className="update-loading-container">
            <div className="update-skeleton update-skeleton-title"></div>
            <div className="update-skeleton update-skeleton-line"></div>
            <div className="update-skeleton update-skeleton-line short"></div>
            <div className="update-skeleton update-skeleton-line"></div>
            <div className="update-skeleton update-skeleton-line short"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="update-job-section">
      <div className="update-job-container">
        {/* Header */}
        <div className="update-job-header">
          <h1 className="update-job-title">
            Update <span className="update-gradient-text">Job</span>
          </h1>
          <p className="update-job-subtitle">
            Modify your job posting to attract the right candidates
          </p>
        </div>

        {/* Form Container */}
        <div className="update-job-form-container">
          {/* Job Info Card */}
          {selectedJob && (
            <div className="update-job-info-card">
              <div className="update-job-info-icon">
                <i className="fas fa-edit"></i>
              </div>
              <div className="update-job-info-content">
                <h3 className="update-job-info-title">
                  Updating: {selectedJob.title}
                </h3>
                <p className="update-job-info-subtitle">
                  Posted on {new Date(selectedJob.jobPostedOn).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="update-success-message">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="update-error-message">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="update-job-form">
            {/* Basic Information Section */}
            <div className="update-form-section">
              <h3 className="update-form-section-title">Basic Information</h3>
              
              <div className="update-form-row update-form-row-2">
                <div className="update-form-group">
                  <label htmlFor="companyName" className="update-form-label required">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={`update-form-input ${formErrors.companyName ? 'error' : ''}`}
                    placeholder="Enter company name"
                    disabled={isSubmitting}
                  />
                  {formErrors.companyName && (
                    <div className="update-form-error">{formErrors.companyName}</div>
                  )}
                </div>

                <div className="update-form-group">
                  <label htmlFor="title" className="update-form-label required">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`update-form-input ${formErrors.title ? 'error' : ''}`}
                    placeholder="Enter job title"
                    disabled={isSubmitting}
                  />
                  {formErrors.title && (
                    <div className="update-form-error">{formErrors.title}</div>
                  )}
                </div>
              </div>

              <div className="update-form-group">
                <label htmlFor="description" className="update-form-label required">
                  Job Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`update-form-textarea ${formErrors.description ? 'error' : ''}`}
                  placeholder="Describe the job role, responsibilities, and requirements..."
                  disabled={isSubmitting}
                />
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  {formData.description.length}/500 characters
                </div>
                {formErrors.description && (
                  <div className="update-form-error">{formErrors.description}</div>
                )}
              </div>

              <div className="update-form-row update-form-row-2">
                <div className="update-form-group">
                  <label htmlFor="category" className="update-form-label required">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`update-form-select ${formErrors.category ? 'error' : ''}`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <div className="update-form-error">{formErrors.category}</div>
                  )}
                </div>

                <div className="update-form-group">
                  <label htmlFor="fixedSalary" className="update-form-label required">
                    Salary (₹)
                  </label>
                  <div className="update-salary-input-container">
                    <input
                      type="number"
                      id="fixedSalary"
                      name="fixedSalary"
                      value={formData.fixedSalary}
                      onChange={handleInputChange}
                      className={`update-form-input ${formErrors.fixedSalary ? 'error' : ''}`}
                      placeholder="Enter salary amount"
                      min="1000"
                      max="999999999"
                      disabled={isSubmitting}
                    />
                  </div>
                  {formErrors.fixedSalary && (
                    <div className="update-form-error">{formErrors.fixedSalary}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="update-form-section">
              <h3 className="update-form-section-title">Location Details</h3>
              
              <div className="update-form-row update-form-row-2">
                <div className="update-form-group">
                  <label htmlFor="country" className="update-form-label required">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`update-form-input ${formErrors.country ? 'error' : ''}`}
                    placeholder="Enter country"
                    disabled={isSubmitting}
                  />
                  {formErrors.country && (
                    <div className="update-form-error">{formErrors.country}</div>
                  )}
                </div>

                <div className="update-form-group">
                  <label htmlFor="city" className="update-form-label required">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`update-form-input ${formErrors.city ? 'error' : ''}`}
                    placeholder="Enter city"
                    disabled={isSubmitting}
                  />
                  {formErrors.city && (
                    <div className="update-form-error">{formErrors.city}</div>
                  )}
                </div>
              </div>

              <div className="update-form-group">
                <label htmlFor="location" className="update-form-label required">
                  Detailed Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`update-form-input ${formErrors.location ? 'error' : ''}`}
                  placeholder="Enter detailed location address"
                  disabled={isSubmitting}
                />
                {formErrors.location && (
                  <div className="update-form-error">{formErrors.location}</div>
                )}
              </div>
            </div>

            {/* Job Details Section */}
            <div className="update-form-section">
              <h3 className="update-form-section-title">Job Details</h3>
              
              <div className="update-form-row update-form-row-3">
                <div className="update-form-group">
                  <label htmlFor="jobType" className="update-form-label required">
                    Job Type
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className={`update-form-select ${formErrors.jobType ? 'error' : ''}`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select job type</option>
                    {jobTypeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {formErrors.jobType && (
                    <div className="update-form-error">{formErrors.jobType}</div>
                  )}
                </div>

                <div className="update-form-group">
                  <label htmlFor="experienceLevel" className="update-form-label required">
                    Experience Level
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className={`update-form-select ${formErrors.experienceLevel ? 'error' : ''}`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select experience level</option>
                    {experienceLevelOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {formErrors.experienceLevel && (
                    <div className="update-form-error">{formErrors.experienceLevel}</div>
                  )}
                </div>

                <div className="update-form-group">
                  <label htmlFor="workMode" className="update-form-label required">
                    Work Mode
                  </label>
                  <select
                    id="workMode"
                    name="workMode"
                    value={formData.workMode}
                    onChange={handleInputChange}
                    className={`update-form-select ${formErrors.workMode ? 'error' : ''}`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select work mode</option>
                    {workModeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {formErrors.workMode && (
                    <div className="update-form-error">{formErrors.workMode}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="update-form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="update-btn-cancel"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="update-btn-submit"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? (
                  <>
                    <div className="update-loading-spinner"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i> Update Job
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdateJob;