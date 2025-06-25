import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from "../../context/JobContext";
import "../../styles/JobPostForm.css";

const JobPostForm = () => {
  const navigate = useNavigate();
  const { createJob, loading, error, clearError } = useJobs();
  
  // Form state
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
    workMode: '',
  });

  // Validation errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Dropdown options based on your schema
  const categories = [
    'Technology', 'Healthcare', 'Finance', 'Education', 
    'Marketing', 'Design', 'Engineering', 'Sales', 'Other'
  ];
  
  const jobTypes = ['Full-Time', 'Internship', 'Part-Time'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive Level'];
  const workModes = ['Remote', 'On-site', 'Hybrid'];

  // Clear context errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Validation functions
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'companyName':
        if (!value.trim()) {
          newErrors.companyName = 'Please provide company name!';
        } else if (value.length < 3) {
          newErrors.companyName = 'Company Name must contain at least 3 Characters!';
        } else if (value.length > 30) {
          newErrors.companyName = 'Company Name cannot exceed 30 Characters!';
        } else {
          delete newErrors.companyName;
        }
        break;

      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Please provide a title.';
        } else if (value.length < 3) {
          newErrors.title = 'Title must contain at least 3 Characters!';
        } else if (value.length > 30) {
          newErrors.title = 'Title cannot exceed 30 Characters!';
        } else {
          delete newErrors.title;
        }
        break;

      case 'description':
        if (!value.trim()) {
          newErrors.description = 'Please provide description.';
        } else if (value.length < 30) {
          newErrors.description = 'Description must contain at least 30 Characters!';
        } else if (value.length > 500) {
          newErrors.description = 'Description cannot exceed 500 Characters!';
        } else {
          delete newErrors.description;
        }
        break;

      case 'category':
        if (!value) {
          newErrors.category = 'Please provide a category.';
        } else {
          delete newErrors.category;
        }
        break;

      case 'country':
        if (!value.trim()) {
          newErrors.country = 'Please provide a country name.';
        } else {
          delete newErrors.country;
        }
        break;

      case 'city':
        if (!value.trim()) {
          newErrors.city = 'Please provide a city name.';
        } else {
          delete newErrors.city;
        }
        break;

      case 'location':
        if (!value.trim()) {
          newErrors.location = 'Please provide location.';
        } else if (value.length < 20) {
          newErrors.location = 'Location must contain at least 20 characters!';
        } else {
          delete newErrors.location;
        }
        break;

      case 'fixedSalary':
        if (value && (value.length < 4 || value.length > 9)) {
          newErrors.fixedSalary = 'Salary must be between 4 and 9 digits';
        } else if (value && isNaN(value)) {
          newErrors.fixedSalary = 'Please enter a valid number';
        } else {
          delete newErrors.fixedSalary;
        }
        break;

      case 'jobType':
        if (!value) {
          newErrors.jobType = 'Please provide job type.';
        } else {
          delete newErrors.jobType;
        }
        break;

      case 'experienceLevel':
        if (!value) {
          newErrors.experienceLevel = 'Please provide experience level.';
        } else {
          delete newErrors.experienceLevel;
        }
        break;

      case 'workMode':
        if (!value) {
          newErrors.workMode = 'Please provide work mode.';
        } else {
          delete newErrors.workMode;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate field if it has been touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  // Handle input blur (when field loses focus)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'companyName', 'title', 'description', 'category', 
      'country', 'city', 'location', 'jobType', 
      'experienceLevel', 'workMode'
    ];

    requiredFields.forEach(field => {
      validateField(field, formData[field]);
    });

    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate form
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare data for submission
      const jobData = {
        ...formData,
        fixedSalary: formData.fixedSalary ? parseInt(formData.fixedSalary) : undefined
      };

      await createJob(jobData);
      
      if (!error) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate('/my-jobs');
        }, 500);
      }
    } catch (err) {
      console.error('Job creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/employer/dashboard');
  };

  // Get field class based on validation state
  const getFieldClass = (fieldName) => {
    let className = '';
    if (fieldName.includes('textarea')) {
      className = 'form-textarea';
    } else if (fieldName.includes('select')) {
      className = 'form-select';
    } else {
      className = 'form-input';
    }

    if (errors[fieldName] && touched[fieldName]) {
      className += ' error';
    } else if (!errors[fieldName] && touched[fieldName] && formData[fieldName]) {
      className += ' success';
    }

    return className;
  };

  return (
    <section className="job-post-section">
      <div className="job-post-container">
        {/* Header */}
        <div className="job-post-header">
          <h1 className="job-post-title">
            Post a New <span className="gradient-text">Job</span>
          </h1>
          <p className="job-post-subtitle">
            Share your opportunity with talented professionals and find the perfect candidate for your team.
          </p>
        </div>

        {/* Form Container */}
        <div className="job-post-form-container">
          {/* Progress Indicator */}
          <div className="form-progress">
            <div className="progress-step completed">
              Basic Information
            </div>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div className="success-message">
              Job posted successfully! Redirecting to your jobs dashboard...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="job-post-form" onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="form-section">
              <h3 className="form-section-title">Basic Information</h3>
              
              <div className="form-row form-row-2">
                <div className="form-group">
                  <label className="form-label required">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={getFieldClass('companyName')}
                    placeholder="Enter company name"
                    disabled={loading || isSubmitting}
                  />
                  {errors.companyName && touched.companyName && (
                    <div className="form-error">{errors.companyName}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label required">Job Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={getFieldClass('title')}
                    placeholder="Enter job title"
                    disabled={loading || isSubmitting}
                  />
                  {errors.title && touched.title && (
                    <div className="form-error">{errors.title}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label required">Job Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getFieldClass('description-textarea')}
                  placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting..."
                  disabled={loading || isSubmitting}
                />
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#6b7280', 
                  textAlign: 'right',
                  marginTop: '0.25rem'
                }}>
                  {formData.description.length}/500 characters
                </div>
                {errors.description && touched.description && (
                  <div className="form-error">{errors.description}</div>
                )}
              </div>

              <div className="form-row form-row-2">
                <div className="form-group">
                  <label className="form-label required">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={getFieldClass('category-select')}
                    disabled={loading || isSubmitting}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && touched.category && (
                    <div className="form-error">{errors.category}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Salary (Optional)</label>
                  <div className="salary-input-container">
                    <input
                      type="number"
                      name="fixedSalary"
                      value={formData.fixedSalary}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={getFieldClass('fixedSalary')}
                      placeholder="Annual salary in INR"
                      min="1000"
                      max="999999999"
                      disabled={loading || isSubmitting}
                    />
                  </div>
                  {errors.fixedSalary && touched.fixedSalary && (
                    <div className="form-error">{errors.fixedSalary}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="form-section">
              <h3 className="form-section-title">Location Details</h3>
              
              <div className="form-row form-row-2">
                <div className="form-group">
                  <label className="form-label required">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={getFieldClass('country')}
                    placeholder="Enter country"
                    disabled={loading || isSubmitting}
                  />
                  {errors.country && touched.country && (
                    <div className="form-error">{errors.country}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label required">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={getFieldClass('city')}
                    placeholder="Enter city"
                    disabled={loading || isSubmitting}
                  />
                  {errors.city && touched.city && (
                    <div className="form-error">{errors.city}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label required">Detailed Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getFieldClass('location')}
                  placeholder="Provide detailed address or location description (minimum 20 characters)"
                  disabled={loading || isSubmitting}
                />
                {errors.location && touched.location && (
                  <div className="form-error">{errors.location}</div>
                )}
              </div>
            </div>

            {/* Job Details Section */}
            <div className="form-section">
              <h3 className="form-section-title">Job Details</h3>
              
              <div className="form-row form-row-3">
                <div className="form-group">
                  <label className="form-label required">Job Type</label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={getFieldClass('jobType-select')}
                    disabled={loading || isSubmitting}
                  >
                    <option value="">Select job type</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.jobType && touched.jobType && (
                    <div className="form-error">{errors.jobType}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label required">Experience Level</label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={getFieldClass('experienceLevel-select')}
                    disabled={loading || isSubmitting}
                  >
                    <option value="">Select experience level</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  {errors.experienceLevel && touched.experienceLevel && (
                    <div className="form-error">{errors.experienceLevel}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label required">Work Mode</label>
                  <select
                    name="workMode"
                    value={formData.workMode}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={getFieldClass('workMode-select')}
                    disabled={loading || isSubmitting}
                  >
                    <option value="">Select work mode</option>
                    {workModes.map(mode => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                  {errors.workMode && touched.workMode && (
                    <div className="form-error">{errors.workMode}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={loading || isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading || isSubmitting}
              >
                {isSubmitting || loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Posting Job...
                  </>
                ) : (
                  <>
                    Post Job
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

export default JobPostForm;