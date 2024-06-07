import User from "../models/user.model.js";

export const getUsersForSidebar = async(req,res) => {
    try {
        const loggedInUserId = req.user._id; // we can access this user._id because we have used protectRoute

        const filteredUsers = await User.find({ _id : {$ne: loggedInUserId}}).select("-password"); // find every user in db that is not equal ($ne) to loggedInUserId
        
        res.status(200).json(filteredUsers);
    
    } catch (error) {
        console.log("Error in getUserForSidebar : ", error.message);
        res.status(500).json({error : "Internal Server Error"});
    }
}