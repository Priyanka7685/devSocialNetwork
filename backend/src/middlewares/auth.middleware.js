import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js'

export const verifyjwt = async (req, res, next) => {

    // get cookie from cookie or authorization header
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if(!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password")

        if(!user) {
            console.log("User not found");
            
            return res.status(401).json({ message: "Unauthorized" })
        }

        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid access token" })
    }
}