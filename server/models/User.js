const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: [true, "Please enter your Name!"],
        minLength: [3, "Name must contain at least 3 Characters!"],
        maxLength: [30, "Name cannot exceed 30 Characters!"],
    },
    email: {
        type: String,
        required: [true, "Please enter your Email!"],
        unique: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: [true, "Please enter your Phone Number!"],
        unique: true,
    },
    role: {
        type: String,
        require: [true, "Please select a role"],
        enum: ["Job Seeker", "Employer"],
    },
    password: {
        type: String,
        required: [true, "Please provide a Password!"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;