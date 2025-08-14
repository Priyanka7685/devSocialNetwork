import { Router } from 'express'
import { verifyjwt } from '../middlewares/auth.middleware.js'
import { 
    addComments,
    createPost,
    deleteComments,
    deletePosts,
    editPosts, 
    getAllPosts,
    getComments,
    getPostsById, 
    toggleLike 
} from '../controllers/postController.js'
import upload from '../middlewares/multer.middlewares.js'

const router = Router()

router.route('/create').post(verifyjwt, upload.single("image"), createPost)
router.route('/').get(getAllPosts)
router.route('/:userId').get(getPostsById)
router.route('/:postId/edit').put(verifyjwt, upload.single("image"),editPosts)
router.route('/:postId/delete').delete(verifyjwt, deletePosts)
router.route('/:postId/like').put( verifyjwt,toggleLike)
router.route('/:postId/comment').put( verifyjwt,addComments)
router.route('/:postId/getComments').get( verifyjwt,getComments)
router.route('/:postId/comments/:commentId').delete( verifyjwt,deleteComments)



export default router