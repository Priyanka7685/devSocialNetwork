import { Profile } from "../models/profileModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


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

         let profilePictureUrl = "";
    if (req.file && req.file.path) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (uploadResult) {
        profilePictureUrl = uploadResult.secure_url; // Use secure URL from Cloudinary
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
            const profile = await Profile.findOne({ user: req.params.userId}).populate("user", ["name", "email"])

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


export {
    createProfile,
    getUserProfile,
    getUserProfileById,
    editProfile
}


