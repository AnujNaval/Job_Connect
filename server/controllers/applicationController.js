const Application = require("../models/Application");
const Job = require("../models/Job");

const applyForJob = async (req, res) => {
    try {
        if (req.user.role !== "Job Seeker") {
            return res.status(403).json({ message: "Only Job Seekers can apply for jobs" });
        }

        const {
            name,
            email,
            phone,
            address,
            coverLetter,
            resume
        } = req.body;

        const jobId = req.params.jobId;

        // Basic Validation
        if (!name || !email || !phone || !address || !coverLetter || !resume) {
            return res.status(400).json({ message: "Please enter all the required fields!" });
        }

        // Check if Job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user.id,
        });

        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job." });
        }

        // Create a new Application
        const application = new Application({
            name,
            email,
            phone,
            address,
            coverLetter,
            resume,
            job: jobId,
            applicant: req.user.id,
        });

        await application.save();

        // Send response
        console.log("Application submitted successfully", application);
        res.status(200).json({ message: "Application submitted successfully", application });
    } catch (error) {
        console.log("Error while submitting application", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getJobApplications = async (req, res) => {
    try{
        if(req.user.role !== "Employer"){
            return res.status(403).json({message: "Only a employer can view the applications"});
        }

        const jobId = req.params.jobId;

        // Check if Job exists
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({message: "Job not found"});
        }

        // Check for ownership
        if(req.user.id !== job.postedBy.toString()){
            return res.status(403).json({message: "You are not authorized to view the applications for this job"});
        }

        const applications = await Application
        .find({ job: jobId })
        .sort({ createdAt: -1 }) // newest first
        .populate("applicant", "name email")
        .populate("job");


        // Send Response
        console.log(`Applications for job ${jobId} fetched successfully`, applications);
        res.status(200).json({message: "Applications fetched sucessfully", applications});
    } catch(error){
        console.log("Error while fetching application", error);
        res.status(500).json({message: "Server Error"});
    }
};

const getUserApplications = async (req, res) => {
    try{
        if(req.user.role !== "Job Seeker"){
            return res.status(403).json({message: "Only Job Seekers can see their applications"});
        }

        const applications = await Application
        .find({ applicant: req.user.id })
        .sort({ createdAt: -1 }) // Optional, for latest-first ordering
        .populate("job", "title companyName jobPostedOn city fixedSalary");

        console.log("Application fetched sucessfully", applications);
        res.status(200).json({message: "Applications fetched sucessfully", applications});
    } catch(error){
        console.log("Error fetching your applications", error);
        res.status(500).json({message: "Server Error"});
    }
};

const getApplicationById = async (req, res) => {
    try {
        const applicationId = req.params.applicationId;
        
        // Find the application and populate both job and applicant details
        const application = await Application.findById(applicationId)
            .populate("job")
            .populate("applicant", "name email");

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Check authorization based on user role
        if (req.user.role === "Employer") {
            // For employers: check if they own the job
            if (application.job.postedBy.toString() !== req.user.id) {
                return res.status(403).json({ 
                    message: "You are not authorized to view this application" 
                });
            }
        } else if (req.user.role === "Job Seeker") {
            // For job seekers: check if they are the applicant
            if (application.applicant.toString() !== req.user.id) {
                return res.status(403).json({ 
                    message: "You are not authorized to view this application" 
                });
            }
        } else {
            return res.status(403).json({ 
                message: "Unauthorized access" 
            });
        }

        console.log(`Application ${applicationId} fetched successfully`);
        res.status(200).json({ 
            message: "Application fetched successfully", 
            application 
        });
    } catch (error) {
        console.log("Error fetching application", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        if (req.user.role !== "Employer") {
            return res.status(403).json({ message: "Only Employers can update application status" });
        }

        const applicationId = req.params.applicationId;
        const { status } = req.body;

        // Disallow "Withdrawn" status by Employer
        const allowedStatuses = ["Pending", "Reviewed", "Accepted", "Rejected"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: `"${status}" is not a valid status for an Employer to set.` });
        }

        // Find application and populate job info
        const application = await Application.findById(applicationId).populate("job");
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Ensure employer owns the job
        if (application.job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this application's status" });
        }

        // Update status
        application.applicationStatus = status;
        await application.save();

        console.log(`Application status updated to '${status}'`, application);
        res.status(200).json({
            message: "Application status updated successfully",
            application,
        });

    } catch (error) {
        console.error("Error updating application status", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const withdrawApplication = async (req, res) => {
    try {
        if (req.user.role !== "Job Seeker") {
            return res.status(403).json({ message: "Only Job Seekers can withdraw applications" });
        }

        const applicationId = req.params.applicationId;
        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Check ownership
        if (application.applicant.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to withdraw this application" });
        }

        await Application.findByIdAndDelete(applicationId);

        console.log("Application withdrawn and deleted successfully");
        res.status(200).json({ message: "Application withdrawn and deleted successfully" });

    } catch (error) {
        console.log("Error withdrawing application", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    applyForJob,
    getJobApplications,
    getUserApplications,
    getApplicationById,
    updateApplicationStatus,
    withdrawApplication,
}