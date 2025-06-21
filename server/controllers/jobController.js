const Job = require("../models/Job");
const mongoose = require("mongoose");

const createJob = async (req, res) => {
    try{
        if (req.user.role !== "Employer") {
            return res.status(403).json({ message: "Only employers can create jobs" });
        }

        const {
            companyName, 
            title, 
            description, 
            category, 
            country, 
            city, 
            location, 
            fixedSalary,
            jobType,
            experienceLevel,
            workMode
        } = req.body;

        // Basic Validation - Updated to include new required fields
        if(!companyName || !title || !description || !category || !country || !city || !location || !fixedSalary || !jobType || !experienceLevel || !workMode){
            return res.status(400).json({message: "Please enter all the required fields!"});
        }

        // Create New Job - Updated to include new fields
        const job = new Job({
            companyName,
            title,
            description,
            category,
            country,
            city,
            location,
            fixedSalary,
            jobType,
            experienceLevel,
            workMode,
            expired: false,
            postedBy: req.user.id,
        });

        await job.save();

        // Send Response
        console.log("Created Job ", job);
        res.status(201).json({
            message: "Job created successfully",
            job: {
                id: job._id,
                companyName: job.companyName,
                title: job.title,
                jobType: job.jobType,
                experienceLevel: job.experienceLevel,
                workMode: job.workMode,
            }
        })
    } catch(error){
        console.log("Error while creating Job", error);
        
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({message: errorMessages.join(', ')});
        }
        
        res.status(500).json({message: "Server Error"});
    }
};

const getAllJobs = async (req, res) => {
    try{
        const {
            companyName,
            title,
            category,
            country,
            city,
            expired,
            jobType,
            experienceLevel,
            workMode
        } = req.query;

        let query = {};

        if (companyName) query.companyName = { $regex: companyName, $options: 'i' };
        if (title) query.title = { $regex: title, $options: 'i' };
        if (category) query.category = category;
        if (country) query.country = country;
        if (city) query.city = city;
        if (expired !== undefined) query.expired = expired === 'true';
        
        // Add filters for new fields
        if (jobType) query.jobType = jobType;
        if (experienceLevel) query.experienceLevel = experienceLevel;
        if (workMode) query.workMode = workMode;

        const jobs = await Job.find(query).populate('postedBy', 'name email');
        console.log("Fetched Jobs successfully", jobs);
        res.status(200).json(jobs);
    } catch(error){
        console.log("Error while fetching Jobs", error);
        res.status(500).json({message: "Server Error"});
    }
};

const getJobById = async (req, res) => {
    try {
        const { jobId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: "Invalid Job ID" });
        }

        const job = await Job.findById(jobId).populate('postedBy', 'name email');

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        console.log("Job fetched successfully", job);
        res.status(200).json(job);
    } catch (error) {
        console.error("Error while fetching the job", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getEmployerJobs = async (req, res) => {
    try{
        // Check for role
        if(req.user.role != "Employer"){
            return res.status(403).json({message: "Only Employer are allowed to view their job postings"});
        }
        const employerId = req.user.id;
        
        const jobs = await Job.find({ postedBy: employerId }).sort({ jobPostedOn: -1 });
        
        console.log("Jobs fetched successfully", jobs);
        res.status(200).json(jobs);
    } catch(error){
        console.log("Error fetching employer's jobs", error);
        res.status(500).json({message: "Server Error"});
    }
};

const updateJob = async (req, res) => {
    try{
        const updates = req.body;
        const jobId = req.params.jobId;

        // Check if Job is present
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({message: "Job not found"});
        }

        // Check for role and ownership
        if(req.user.role !== "Employer" || job.postedBy.toString() !== req.user.id){
            return res.status(403).json({message: "You are not authorized to update this job"});
        }

        const updatedJob = await Job.findByIdAndUpdate(jobId, updates, {new: true});

        console.log("Job updated successfully", updatedJob);
        res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob,
        });
    } catch(error){
        console.log("Error while updating the job", error);
        
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({message: errorMessages.join(', ')});
        }
        
        res.status(500).json({message: "Server Error"});
    }
};

const deleteJob = async(req, res) => {
    try{
        const jobId = req.params.jobId;

        // Check if job exists
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({message: "Job not found"});
        }

        // Check for user role and ownership
        if(req.user.role !== "Employer" || req.user.id !== job.postedBy.toString()){
            return res.status(403).json({message: "You are not authorized to delete this job"});
        }

        const deletedJob = await Job.findByIdAndDelete(jobId);
        console.log("Job deleted successfully", deletedJob);
        res.status(200).json({
            message: "Job deleted successfully",
            job: deletedJob,
        });
    } catch(error){
        console.log("Error while deleting the job", error);
        res.status(500).json({message: "Server Error"});
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    getEmployerJobs,
    updateJob,
    deleteJob,
}