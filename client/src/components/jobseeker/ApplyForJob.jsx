import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplications } from "../../context/ApplicationContext";
import { useJobs } from "../../context/JobContext";
import "../../styles/ApplyForJob.css";

const ApplyForJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const {
    applyForJob,
    loading: applicationLoading,
    error: applicationError,
    clearError,
  } = useApplications();
  const {
    selectedJob,
    fetchJobById,
    loading: jobLoading,
    error: jobError,
  } = useJobs();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    coverLetter: "",
    resume: "", // Changed from null to string
  });

  // Validation errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch job details when component mounts
  useEffect(() => {
    if (!jobId || jobLoading) return;

    const loadJob = async () => {
      try {
        await fetchJobById(jobId);
        clearError();
      } catch (error) {
        console.error("Error loading job:", error);
      }
    };

    loadJob();
  }, [jobId]);

  // Validation functions
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Please enter your Name!";
        } else if (value.length < 3) {
          newErrors.name = "Name must contain at least 3 Characters!";
        } else if (value.length > 30) {
          newErrors.name = "Name cannot exceed 30 Characters!";
        } else {
          delete newErrors.name;
        }
        break;

      case "email":
        if (!value.trim()) {
          newErrors.email = "Please enter your Email!";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Please enter a valid email address!";
        } else {
          delete newErrors.email;
        }
        break;

      case "phone":
        if (!value.trim()) {
          newErrors.phone = "Please enter your Phone Number!";
        } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(value)) {
          newErrors.phone = "Please enter a valid phone number!";
        } else {
          delete newErrors.phone;
        }
        break;

      case "address":
        if (!value.trim()) {
          newErrors.address = "Please enter your Address!";
        } else if (value.length < 10) {
          newErrors.address = "Address must contain at least 10 characters!";
        } else {
          delete newErrors.address;
        }
        break;

      case "coverLetter":
        if (!value.trim()) {
          newErrors.coverLetter = "Please provide a cover letter!";
        } else if (value.length < 50) {
          newErrors.coverLetter =
            "Cover letter must contain at least 50 characters!";
        } else if (value.length > 1000) {
          newErrors.coverLetter = "Cover letter cannot exceed 1000 characters!";
        } else {
          delete newErrors.coverLetter;
        }
        break;

      case "resume":
        if (!value.trim()) {
          newErrors.resume = "Please provide your resume details!";
        } else if (value.length < 20) {
          newErrors.resume = "Resume details must contain at least 20 characters!";
        } else {
          delete newErrors.resume;
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
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate field if it has been touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  // Handle input blur (when field loses focus)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  // Validate entire form
  const validateForm = () => {
    const requiredFields = [
      "name",
      "email",
      "phone",
      "address",
      "coverLetter",
      "resume",
    ];

    let isValid = true;
    requiredFields.forEach((field) => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate form
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Create application data (no FormData needed now)
      const applicationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        coverLetter: formData.coverLetter,
        resume: formData.resume, // Now a string instead of file
      };

      await applyForJob(jobId, applicationData);

      if (!applicationError) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate("/applications");
        }, 500);
      }
    } catch (err) {
      console.error("Application submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Get field class based on validation state
  const getFieldClass = (fieldName, isTextarea = false) => {
    let className = isTextarea ? "application-textarea" : "application-input";

    if (errors[fieldName] && touched[fieldName]) {
      className += " error";
    } else if (
      !errors[fieldName] &&
      touched[fieldName] &&
      formData[fieldName]
    ) {
      className += " success";
    }

    return className;
  };

  // Loading state for job fetch
  if (jobLoading) {
    return (
      <section className="apply-job-section">
        <div className="apply-job-container">
          <div className="apply-job-form-container">
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <div
                className="application-loading-spinner"
                style={{ margin: "0 auto 1rem" }}
              ></div>
              <p>Loading job details...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state for job fetch
  if (jobError || !selectedJob) {
    return (
      <section className="apply-job-section">
        <div className="apply-job-container">
          <div className="apply-job-form-container">
            <div className="application-error-message">
              {jobError || "Job not found"}
            </div>
            <div className="application-actions">
              <button
                type="button"
                className="btn-back"
                onClick={() => navigate("/jobs")}
              >
                Back to Jobs
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="apply-job-section">
      <div className="apply-job-container">
        {/* Header */}
        <div className="apply-job-header">
          <h1 className="apply-job-title">
            Apply for <span className="gradient-text">{selectedJob.title}</span>
          </h1>
          <p className="apply-job-subtitle">
            Submit your application and take the next step in your career journey.
          </p>
        </div>

        {/* Job Information Card - Blue Theme */}
        <div className="job-info-card blue-theme">
          <h2 className="job-info-title">{selectedJob.title}</h2>
          <p className="job-info-company">{selectedJob.companyName}</p>

          <div className="job-info-details">
            <div className="job-info-item">
              <span>{selectedJob.location}</span>
            </div>
            <div className="job-info-item">
              <span>{selectedJob.jobType}</span>
            </div>
            <div className="job-info-item">
              <span>{selectedJob.workMode}</span>
            </div>
            <div className="job-info-item">
              <span>{selectedJob.experienceLevel}</span>
            </div>
            {selectedJob.fixedSalary && (
              <div className="job-info-item">
                <span>₹{selectedJob.fixedSalary.toLocaleString()}/year</span>
              </div>
            )}
            <div className="job-info-item">
              <span>{selectedJob.category}</span>
            </div>
          </div>
        </div>

        {/* Application Form Container */}
        <div className="apply-job-form-container">
          {/* Success Message */}
          {submitSuccess && (
            <div className="application-success-message">
              Application submitted successfully! Redirecting to your applications...
            </div>
          )}

          {/* Error Message */}
          {applicationError && (
            <div className="application-error-message">{applicationError}</div>
          )}

          {/* Application Form */}
          <form className="apply-job-form" onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div className="application-section">
              <h3 className="application-section-title">
                Personal Information
              </h3>

              <div className="application-row application-row-2">
                <div className="application-group">
                  <label className="application-label required">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={getFieldClass("name")}
                    placeholder="Enter your full name"
                    disabled={applicationLoading || isSubmitting}
                  />
                  {errors.name && touched.name && (
                    <div className="application-error">{errors.name}</div>
                  )}
                </div>

                <div className="application-group">
                  <label className="application-label required">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={getFieldClass("email")}
                    placeholder="Enter your email address"
                    disabled={applicationLoading || isSubmitting}
                  />
                  {errors.email && touched.email && (
                    <div className="application-error">{errors.email}</div>
                  )}
                </div>
              </div>

              <div className="application-row application-row-2">
                <div className="application-group">
                  <label className="application-label required">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={getFieldClass("phone")}
                    placeholder="Enter your phone number"
                    disabled={applicationLoading || isSubmitting}
                  />
                  {errors.phone && touched.phone && (
                    <div className="application-error">{errors.phone}</div>
                  )}
                </div>

                <div className="application-group">
                  <label className="application-label required">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={getFieldClass("address")}
                    placeholder="Enter your complete address"
                    disabled={applicationLoading || isSubmitting}
                  />
                  {errors.address && touched.address && (
                    <div className="application-error">{errors.address}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Application Details Section */}
            <div className="application-section">
              <h3 className="application-section-title">Application Details</h3>

              <div className="application-group">
                <label className="application-label required">
                  Cover Letter
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getFieldClass("coverLetter", true)}
                  placeholder="Tell us about yourself, your experience, and why you're interested in this position..."
                  disabled={applicationLoading || isSubmitting}
                />
                <div className="character-counter">
                  {formData.coverLetter.length}/1000 characters
                </div>
                {errors.coverLetter && touched.coverLetter && (
                  <div className="application-error">{errors.coverLetter}</div>
                )}
              </div>

              <div className="application-group">
                <label className="application-label required">Resume Details</label>
                <textarea
                  name="resume"
                  value={formData.resume}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getFieldClass("resume", true)}
                  placeholder="Provide your resume details (skills, experience, education, etc.)"
                  disabled={applicationLoading || isSubmitting}
                />
                <div className="character-counter">
                  {formData.resume.length}/500 characters
                </div>
                {errors.resume && touched.resume && (
                  <div className="application-error">{errors.resume}</div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="application-actions">
              <button
                type="button"
                className="btn-back"
                onClick={handleBack}
                disabled={applicationLoading || isSubmitting}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn-apply"
                disabled={applicationLoading || isSubmitting}
              >
                {isSubmitting || applicationLoading ? (
                  <>
                    <div className="application-loading-spinner"></div>
                    Submitting Application...
                  </>
                ) : (
                  <>Submit Application</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ApplyForJob;