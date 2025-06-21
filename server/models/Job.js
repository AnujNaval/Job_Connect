const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true, "Please provide company name!"],
        minLength: [3, "Company Name must contain at least 3 Characters!"],
        maxLength: [30, "Company Name cannot exceed 30 Characters!"],
    },
    title: {
        type: String,
        required: [true, "Please provide a title."],
        minLength: [3, "Title must contain at least 3 Characters!"],
        maxLength: [30, "Title cannot exceed 30 Characters!"],
    },
    description: {
        type: String,
        required: [true, "Please provide description."],
        minLength: [30, "Description must contain at least 30 Characters!"],
        maxLength: [500, "Description cannot exceed 500 Characters!"],
    },
    category: {
        type: String,
        required: [true, "Please provide a category."],
        enum: {
            values: ["Technology", "Healthcare", "Finance", "Education", "Marketing", "Design", "Engineering", "Sales", "Other"],
            message: "Category must be Technology, Healthcare, Finance, Education, Marketing, Design, Engineering, Sales, or Other"
        }
    },
    country: {
        type: String,
        required: [true, "Please provide a country name."],
    },
    city: {
        type: String,
        required: [true, "Please provide a city name."],
    },
    location: {
        type: String,
        required: [true, "Please provide location."],
        minLength: [20, "Location must contain at least 20 characters!"],
    },
    fixedSalary: {
        type: Number,
        minLength: [4, "Salary must contain at least 4 digits"],
        maxLength: [9, "Salary cannot exceed 9 digits"],
    },
    jobType: {
        type: String,
        required: [true, "Please provide job type."],
        enum: {
            values: ["Full-Time", "Internship", "Part-Time"],
            message: "Job type must be Full-Time, Internship, or Part-Time"
        }
    },
    experienceLevel: {
        type: String,
        required: [true, "Please provide experience level."],
        enum: {
            values: ["Entry Level", "Mid Level", "Senior Level", "Executive Level"],
            message: "Experience level must be Entry Level, Mid Level, Senior Level, or Executive Level"
        }
    },
    workMode: {
        type: String,
        required: [true, "Please provide work mode."],
        enum: {
            values: ["Remote", "On-site", "Hybrid"],
            message: "Work mode must be Remote, On-site, or Hybrid"
        }
    },
    expired: {
        type: Boolean,
        default: false,
    },
    jobPostedOn: {
        type: Date,
        default: Date.now,
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;