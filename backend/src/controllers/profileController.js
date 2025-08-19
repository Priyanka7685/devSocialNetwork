import { Profile } from "../models/profileModel.js";
import { uploadOnCloudinary} from "../utils/cloudinary.js";
import { User } from "../models/userModel.js";


const createProfile = async(req, res) => {
    let { bio, location, website, skills, socialLinks } = req.body

    // Parse socialLinks if it is a string
  if (socialLinks && typeof socialLinks === "string") {
    try {
      socialLinks = JSON.parse(socialLinks);
    } catch {
      socialLinks = {};
    }
  }

    try {

         let profilePictureUrl = null;

     if (req.file) {
      try {
        const uploadResult = await uploadOnCloudinary(req.file.buffer);
        if (uploadResult?.secure_url) {
          profilePictureUrl = uploadResult.secure_url;
        }
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
      }
    }
        const profile = await Profile.findOne({ user: req.user._id})


        // if profile exists update it
        if(profile) {
            return res.status(201).json({profile, message: "Profile already created"})

        }

        let skillsArray = [];
    if (Array.isArray(skills)) {
      skillsArray = skills;
    } else if (skills) {
      skillsArray = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

        // if no profile exists then create it
        const newProfile = await Profile.create({
            user: req.user.id,
            bio,
            location,
            website,
            profilePicture: profilePictureUrl,
            skills: skillsArray,
            socialLinks,
        })

        await newProfile.save()
        return res.status(200).json({newProfile, message: "Profile created successfully"})

    } catch (error) {
        //  console.error(error);
        if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message });
    }
        return res.status(500).json({ message: "Internal server error" })
    }
}

     // get user profile
    const getUserProfile = async(req, res) => {
        try {
            const profile = await Profile.findOne({ user: req.user._id}).populate("user", ["name", "email"])

            if(!profile) {
                return res.status(404).json({ message: "Profile not found" })
            }

            return res.status(200).json(profile, "User profile fetched successfully")
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" })
        }
    }
    
    // get user profile by id
    const getUserProfileById = async(req, res) => {
        try {
            const profile = await Profile.findOne({ user: req.params.userId}).populate("user", ["username", "email"])

            if(!profile) {
                return res.status(404).json({ message: "Profile not found" })
            }    

            return res.status(200).json({profile, message: "User profile fetched successfully"})    
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" })
        }
            }

    const editProfile = async(req, res) => {
        try {
            const userId = req.params.userId;  // Get userId from URL params
            const updatedData = req.body;   

            const updateProfile = await Profile.findOneAndUpdate( 
                { user: userId }, // assuming userId stored in profile.user
                updatedData,
                { new: true } // return updated doc
            )
    
            // await updateProfile.save()
    
            if (!updateProfile) {
          return res.status(404).json({ message: 'Profile not found' });
        }
    
            return res.status(200).json({updateProfile, message: "Profile updated successfully"})
        }
         catch (error) {
            console.error("Edit profile error:", error);
            return res.status(500).json({ message: "Internal server error" })   
        }
    }

    

// fetch all users with profiles (for Discover)
 const fetchUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

     // pagination params
    const page = parseInt(req.query.page) || 1; // default page = 1
    const limit = parseInt(req.query.limit) || 10; // default limit = 10
    const skip = (page - 1) * limit;

    // total profiles count (excluding logged in user)
    const totalProfiles = await Profile.countDocuments({ user: { $ne: loggedInUserId } });

    // find all profiles except logged in user
    const profiles = await Profile.find({ user: { $ne: loggedInUserId } })
      .populate("user", ["username", "email"]) // populate basic user info
      .select("skills user")
       .skip(skip)
      .limit(limit);
      

    // get logged-in user's following list
    const loggedInUser = await User.findById(loggedInUserId).select("following");

    // map profiles into a neat JSON response
    const usersWithFollowStatus = profiles.map((p) => ({
      _id: p.user._id,
      username: p.user.username,
      email: p.user.email,
      skills: p.skills,
      isFollowed: loggedInUser.following.includes(p.user._id),
    }));

     res.status(200).json({
      users: usersWithFollowStatus,
      totalProfiles,
      currentPage: page,
      totalPages: Math.ceil(totalProfiles / limit),
    });
  } catch (error) {
    console.error("Error in fetchUsers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export {
    createProfile,
    getUserProfile,
    getUserProfileById,
    editProfile,
    fetchUsers
}


