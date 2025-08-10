import mongoose, { Schema } from 'mongoose'


const profileSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bio: {
        type: String,
        maxlength: 300
    },
    location: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    profilePicture: {
        type: String,
        trim: true,
        default: ""
    },
    skills: {
        type: [String],
        default: []
    },
    // profilePicture: {
    //     type: String         // url to cloudinary or uploaded image
    // },
    socialLinks: {
        twitter: {
            type: String,
            trim: true
        },
        linkedin: {
            type: String,
            trim: true
        },
        github: {
            type: String,
            trim: true
        },
    },
},
        {
        timestamps: true
        }
)

export const Profile = mongoose.model("Profile", profileSchema)