import { Router } from "express";
import { verifyjwt } from "../middlewares/auth.middleware.js";
import { 
    createProfile, 
    getUserProfile,
    getUserProfileById,
    editProfile,
    fetchUsers
} from "../controllers/profileController.js";
import parser from "../middlewares/multer.middlewares.js";
import upload from "../middlewares/multer.middlewares.js";


const router = Router()

router.route("/").post(verifyjwt,parser.single('profilePicture'), createProfile,)
router.route("/me").get(verifyjwt, getUserProfile)
router.route("/:userId").get(getUserProfileById)
router.route("/editProfile/:userId", upload.single("profilePicture")).put(editProfile)
router.route("/").get(verifyjwt,fetchUsers)

export default router