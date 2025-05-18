const express = require("express");
const {updateProfile, getProfile, deleteProfile} = require("../controllers/userController");
const protect = require("../middleware/auth");
const router = express.Router();

// Public route to view any user profile by ID
router.get("/:id", getProfile);

// Protected routes for the authenticated user's own data
router.put("/me", protect, updateProfile);
router.delete("/me", protect, deleteProfile);

module.exports = router;