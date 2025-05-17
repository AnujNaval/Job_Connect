const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const {name, email, phone, role, password} = req.body;

        // Basic Validation
        if(!name || !email || !phone || !role || !password){
            return res.status(400).json({message: "Please enter all required fiels!"});
        }

        // Check if User Already Exists
        const existingUser = User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists with this email!"});
        }

        // Hash Password
        const salt = await bcrypt.getSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create New User
        const user = new User({
            name, 
            email, 
            password: hashedPassword,
            role, 
            phone,
        });

        await user.save();

        // Create JWT Token
        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

        // Send Response
        res.status(201).json({
            message: "User Successfully Registered!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
            }
        });
    } catch(error){
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const login = async(req, res) => {
    try {
        const {role, email, password} = req.body;

        // Basic Validation
        if(!email || !role || !password){
            return res.status(400).json({message: "Please enter Email, Password and Role!"});
        }

        // Check if User with Email Exists
        const user = User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid email or password!"});
        }

        // Compare Password with stored hashed password
        const isMatch = bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid email or passord!"});
        }

        // Check the Role Match
        if(user.role != role){
            return res.status(400).json({message: `Access denied for ${role}`});
        }

        // Generate Token 
        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: "1h"},
        );

        // Response 
        res.status(200).json({
            message: "Login Successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });
    } catch(error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getMe = async(req, res) => {

}

module.exports = {
    register,
    login,
    getMe,
};