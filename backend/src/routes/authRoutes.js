import { Router } from 'express'
import {
    loginUser,
    registerUser,
    userProfile
} from '../controllers/authController.js'
import { verifyjwt } from '../middlewares/auth.middleware.js'

const router = Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/profile').get(verifyjwt,userProfile)

export default router