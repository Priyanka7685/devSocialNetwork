import { Post } from "../models/postModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


// create post
const createPost = async(req, res) => {
    try {
        const userId = req.user.id             // from auth.middlewares.js

        let imageUrl = ""

        if(req.file) {
            const uploadeResult = await uploadOnCloudinary(req.file.path)

            if(!uploadeResult) {
                return res.status(400).json({
                    message: "Error uploading image"
                })
            }

            imageUrl = uploadeResult.secure_url

        }


        const newPost = new Post({
            user: userId,
            text: req.body.text,
            image: imageUrl
        })

        await newPost.save()

        return res.status(201).json({
            message: "Post created successfully",
            post: newPost
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
        
    }
}


// get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
        
            res.status(200).json(posts)
        
    } catch (error) {
        console.error("Get all posts error:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

// edit post
const editPosts = async(req, res) => {
    try {
        const userId = req.user.id
        const postId = req.params.postId
        const { text } = req.body

        const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check ownership
    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }


    // Prepare update data
    let updatedData = {};
    if (text) updatedData.text = text;

    if (req.file) {
      // Upload new image if provided
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (!uploadResult) {
        return res.status(500).json({ message: "Error uploading new image" });
      }
      updatedData.image = uploadResult.secure_url;
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updatedData, { new: true });

    return res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (error) {
        console.error("Edit post error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// delete post
const deletePosts = async(req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only owner can delete
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Server error" });
    }
}


// get posts by id
const getPostsById = async(req, res) => {
    try {
        const posts =  await Post.find({ user: req.params.userId }).populate("user", ["name", "email"]);

        if(!posts) {
            return res.status(404).json({ message: "Posts not found" })
        }

        return res.status(200).json({posts, message: "Posts fetched successfully"})
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
        
    }
}


// likes
const toggleLike = async(req, res) => {
    try {
        const { postId } = req.params
        const userId = req.user.id

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const alreadyLiked = post.likes.includes(userId)

        if(alreadyLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId)
            await post.save()
            return res.status(200).json({post, message: "Post unliked successfully", likes: post.likes.length})
        } else {
            post.likes.push(userId)
            await post.save()
            return res.status(200).json({post, message: "Post liked successfully", likes: post.likes.length})
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}


// comments
const addComments = async(req, res) => {
    try {
        const { text } = req.body

        if(!text) {
            return res.status(400).json({ message: "Text is required" })
        }

        const post = await Post.findById(req.params.postId)

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = {
            user: req.user.id,
            text,
            createdAt: new Date()
        }

        post.comments.push(comment)

        await post.save()


    await post.populate("comments.user", ["name", "email"])

    return res.status(200).json({
            message: "Comment added successfully",
            comments: post.comments
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}

//  get all comments
const getComments = async(req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
            .populate("comments.user", ["name", "email"])

            if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      comments: post.comments,
      message: "Comments fetched successfully"
    });

    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}

// delete comment
const deleteComments = async(req, res) => {
    try {
        const post = await Post.findById(req.params.postId)

        
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // find comment by id
    const comment = post.comments.find(comment => comment._id.toString() === req.params.commentId)

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

     // Check if user is comment owner or post owner
    if (
      comment.user.toString() !== req.user.id &&
      post.user.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    // Remove comment
    post.comments = post.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );

    await post.save();

    return res.status(200).json({
      message: "Comment deleted successfully",
      comments: post.comments
    });


    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export {
    createPost,
    getAllPosts,
    getPostsById,
    toggleLike,
    addComments,
    getComments,
    deleteComments,
    deletePosts,
    editPosts
}