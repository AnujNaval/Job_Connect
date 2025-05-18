const User = require("../models/User");

const updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        delete updates.password;

        const user = await User.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true,
        }).select("-password");

        if(!user){
            return res.status(404).json({message: "User not found!"});
        }

        console.log("Updated User", user);
        res.status(200).json({message: "User Updated Successfully!"});
    } catch(error){
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }
        console.log("User Requested", user);
        res.status(200).json(user);
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);

        if(!user){
            return res.status(404).json({message: "User not found!"});
        }

        console.log("User Deleted: ", user);
        res.status(200).json({ message: "Account deleted successfully" });
    } catch(error){
        console.error("Error while deleting profile: " ,error);
        res.status(500).json({message: "Server Error"});
    }
};

module.exports = {
    updateProfile,
    getProfile,
    deleteProfile,
}