const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your Name!"],
        minLength: [3, "Name must contain at least 3 Characters!"],
        maxLength: [30, "Name cannot exceed 30 Characters!"],
    },
    email: {
        type: String,
        required: [true, "Please enter your Email!"],
    },
    phone: {
        type: String,
        required: [true, "Please enter your Phone Number!"],
    },
    address: {
        type: String,
        required: [true, "Please enter your Address!"],
    },
    coverLetter: {
        type: String,
        required: [true, "Please provide a cover letter!"],
    },
    resume: {
        type: String,
        required: true,
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    applicationStatus: {
        type: String,
        enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
        default: "Pending",
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true });

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;