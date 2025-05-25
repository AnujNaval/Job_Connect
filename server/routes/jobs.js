const express = require("express");
const {
    createJob, 
    getAllJobs, 
    getJobById,
    getEmployerJobs,
    updateJob,
    deleteJob
} = require("../controllers/jobController");
const protect = require("../middleware/auth");
const router = express.Router();

router.post("/", protect, createJob);
router.get("/", protect, getAllJobs);
router.get("/employer", protect, getEmployerJobs);
router.get("/:jobId", protect, getJobById);
router.put("/:jobId", protect, updateJob);
router.delete("/:jobId", protect, deleteJob);

module.exports = router;