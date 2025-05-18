const express = require("express");
const config = require("config");
const authRoutes = require("./routes/auth");
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

// Mount Auth Routes
app.use("/auth", authRoutes);

const PORT = config.get('port') || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);