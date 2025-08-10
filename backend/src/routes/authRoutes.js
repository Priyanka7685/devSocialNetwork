import { Router } from 'express'
import {
    loginUser,
    registerUser,
} from '../controllers/authController.js'
import { verifyjwt } from '../middlewares/auth.middleware.js'

const router = Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

export default router