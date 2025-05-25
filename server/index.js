const express = require("express");
const config = require("config");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const jobRoutes = require("./routes/jobs");
const applicationRoutes = require("./routes/applications");
const connectDB = require("./config/db");
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse json
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
    res.send("Server is running!");
})

// Mount Auth Routes (e.g. /register, /login and /me)
app.use("/", authRoutes);

// Mount User Routes 
app.use("/users", userRoutes);

// Mount Job Routes
app.use("/jobs", jobRoutes);

// Mount Application Routes
app.use("/applications", applicationRoutes);

// Optional: Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something broke!" });
});

const PORT = config.get('port') || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});