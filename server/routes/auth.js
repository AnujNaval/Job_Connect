const express = require("express");
const {register, login, getMe} = require("../controllers/authController");
const protect = require("../middleware/auth");
const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Routes
router.get("/me", protect, getMe);

module.exports = router;