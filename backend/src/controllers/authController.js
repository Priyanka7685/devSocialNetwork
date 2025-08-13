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

    const userExists = await User.findOne({
        $or:[
            { username },
            { email }
        ]
    })

    if(userExists) {
        return res.status(400).json({
            message: "User already exists"
        })
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

export {
    registerUser,
    loginUser,
}