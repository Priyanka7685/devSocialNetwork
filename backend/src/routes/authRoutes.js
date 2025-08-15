import { Router } from 'express'
import {
    followUser,
    getFollowers,
    getFollowing,
    loginUser,
    registerUser,
    unfollowUser,
} from '../controllers/authController.js'
import { verifyjwt } from '../middlewares/auth.middleware.js'

const router = Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/:id/follow').post(verifyjwt, followUser)
router.route('/:id/unfollow').post(verifyjwt, unfollowUser)
router.route('/:id/followers').get(verifyjwt, getFollowers)
router.route('/:id/following').get(verifyjwt, getFollowing)

export default router