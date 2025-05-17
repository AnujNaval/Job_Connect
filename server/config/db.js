const mongoose = require("mongoose");
const config = require("config");

const connectDB = async() => {
    const db = config.get("mongoURI")
    try{
        const conn = await mongoose.connect(db);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch(error){
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1); // Exit the process if DB connection fails
    }
};

module.exports = connectDB;