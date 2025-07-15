const express = require("express");
const {
    applyForJob,
    getJobApplications,
    getUserApplications,
    getApplicationById,
    updateApplicationStatus,
    withdrawApplication,
} = require("../controllers/applicationController");
const protect = require("../middleware/auth");

const router = express.Router();

// Get all applications submitted by the logged-in user (Job Seeker)
router.get("/user", protect, getUserApplications);

// Get all application for a given job
router.get("/job/:jobId", protect, getJobApplications);

// Get a specific application by ID
router.get("/:applicationId", protect, getApplicationById); 

// Apply for a job (Job Seeker)
router.post("/:jobId", protect, applyForJob);

// Update application status (Employer)
router.put("/:applicationId", protect, updateApplicationStatus);

// Withdraw application (Job Seeker - actually deletes it)
router.delete("/:applicationId", protect, withdrawApplication);

module.exports = router;
