const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSecret = config.get("jwtSecret");

const protect = async(req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: "Not authorized, token missing"});
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch(error){
        console.error("Token verification failed:", error);
        return res.status(401).json({ message: "Token is invalid or expired" });
    }
}

module.exports = protect;