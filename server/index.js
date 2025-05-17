const express = require("express");
const config = require("config");
const connectDB = require("./config/db");
const app = express();

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running!");
})

const PORT = config.get('port') || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);