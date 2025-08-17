import { User } from "../models/userModel.js";



// register user

const registerUser = async(req, res) => {
    const { username, email, fullname, password } = req.body

    if(
        !username || !email || !fullname || !password
    ) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }


     const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = await User.create({
        username, 
        email,
        fullname,
        password
    })

    const token = newUser.generateAccessToken()

    return res.status(200).json({
            message: "User registered successfully",
            token,
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            fullname: newUser.fullname,
    },
    })
}

// login

const loginUser = async(req, res) => {
    const { email, password, username } = req.body

    if(!email && !username) {
        return res.status(400).json({
            message: "email and password are required"
        })
    }

     if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({
        $or: [
            {
                username
            },
            {
                email
            }
        ]
    })

    if(!user) {
        return res.status(400).json({
            message: "User not found"
        })
    }

    // from bcrypt method we created in userModel to compare password
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid password"
        })
    }

    // generate access token
    const token = user.generateAccessToken()

    res.cookie('token', token, {
        httpOnly: true,
        secure: false,           // Set to true if using HTTPS
        sameSite: 'Lax',         // 'None' if using HTTPS
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
})

    return res.status(200).json({
    message: "User logged in successfully",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
    },
    })
}


// get user's profile
// const userProfile = async(req, res) => {
//     try {
//         return res.status(200).json({
//             message: "Current user details",
//             success: true,
//             user: req.user
//         })
//     } catch (error) {
//         return res.status(400).json({
//             message: "Unable to fetch current user details"
//         })
//     }
// }



// followers
 const followUser = async (req, res) => {
    try {
        const userId = req.params.id      // user to follow
        const currentUserId = req.user.id // current user


        if(userId === currentUserId) {
            return res.status(400).json({ message: "You cannot follow yourself"})
        }

        const user = await User.findById(userId)
        const currentUser = await User.findById(currentUserId)

        if (!user) {
            return res.status(404).json({ message: "User to follow not found" });
        }
        if (!currentUser) {
            return res.status(404).json({ message: "Current user not found" });
        }


        if(!user.followers.some(f => f.toString() === currentUserId)) {
            user.followers.push(currentUserId)
            currentUser.following.push(userId)


            await user.save()
            await currentUser.save()

            res.status(200).json({
                message: "User followed successfully"
            })
        }

    } catch (error) {
        res.status(400).json({
            message: "Unable to follow user"
        })
        console.log(error)
    }
}

// unfollow 

const unfollowUser = async (req, res) => {
    try {
        const userId = req.params.id
        const currentUserId = req.user.id

        const user = await User.findById(userId)
        const currentUser = await User.findById(currentUserId)

        if(user.followers.some(id => id.toString() ===currentUserId)) {
            user.followers = user.followers.filter(id => id.toString() !== currentUserId)
            currentUser.following = currentUser.following.filter(id => id.toString() !== userId)


            await user.save()
            await currentUser.save()

            res.status(200).json({
                message: "User unfollowed successfully"
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Unable to unfollow user"
        })
    }
}


// get followers 
const getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('followers',  'username')

        res.status(200).json(user.followers)
    } catch (error) {
       res.status(500).json({ message: error.message });
    }
}


// get following

const getFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('following',  'username')

        res.status(200).json(user.following)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



export {
    registerUser,
    loginUser,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
}