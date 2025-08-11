import mongoose, { Schema } from "mongoose";


const postModel = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        text: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]

}, {timestamps: true})

export const Post = mongoose.model("Post", postModel)