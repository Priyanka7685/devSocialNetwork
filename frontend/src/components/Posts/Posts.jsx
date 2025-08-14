import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext";
import { Link } from "react-router-dom";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [ pagination, setPagination ] = useState({
    totalPosts: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 5
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [ commentText, setCommentText ] = useState({})
  

  
  const fetchPosts = async (page = 1) => {
      setLoading(true)
      try {
          const res = await axios.get(`http://localhost:8000/api/post?page=${page}&limit=${pagination.pageSize}`);
          setPosts(res.data.posts);
          setPagination(res.data.pagination);
        } catch (error) {
            console.error("Error fetching posts", error); 
        } finally {
            setLoading(false)
        }
    };
    
    useEffect(() => {
      fetchPosts(1);
    }, [user]);

    const token = localStorage.getItem('token')

    // toggle like
    const toggleLike = async (postId) => {
      try {
        const res = await axios.put(`http://localhost:8000/api/post/${postId}/like`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // update local state with new likes count and post data
        setPosts((prev) =>
        prev.map((p) =>
        p._id === postId ? { ...p, likes: res.data.post.likes } : p
        )
    );
      } catch (error) {
        console.error("Error toggling like:", err);
        console.log(error);
        

      }
    } 


    // add comments
    const addComments = async (postId) => {
  try {
    const res = await axios.put(`http://localhost:8000/api/post/${postId}/comment`, {
      text: commentText[postId]
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              comments: res.data.comments, // ✅ Use backend’s fully populated comments
            }
          : post
      )
    );

    // Clear input for that post
    setCommentText(prev => ({ ...prev, [postId]: "" }));

  } catch (err) {
    console.error(err);
  }
};




    // delete comment
    const deleteComments = async (postId, commentId) => {
      try {
        const res = await axios.delete(`http://localhost:8000/api/post/${postId}/comments/${commentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        // Update the state immediately after deletion
     setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              comments: res.data.comments, // ✅ Update with fresh backend comments
            }
          : post
      )
    );
      } catch (error) {
        console.error("Error deleting comment:", err);
      }
    }

  return (
       <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-200 p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">All Posts</h1>

      {loading && <p>Loading...</p>}

      {!loading && posts.length === 0 && <p>No posts found.</p>}

      {posts.map((post) => (
        <div key={post._id} className="bg-white shadow rounded-lg p-4 mb-4">
            
            <div className="flex items-center mb-3">

             {/* Username + Email */}
            <div>
              <Link
                to={`/user/${post.user?._id}`}
                className="font-semibold text-blue-600 hover:underline"
              >
                {post.user?.username || "Unknown"}
              </Link>
              <p className="text-sm text-gray-500">{post.user?.email}</p>
            </div>
            </div>

          <p className="text-gray-800">{post.text}</p>
          {post.image && (
            <div className="flex justify-center mb-2">
        <img
          src={post.image}
          alt="Post"
          className="max-h-55 object-cover rounded-lg mb-2"
        />
        </div>
      )}
          <p className="text-sm text-gray-500">
            
            {new Date(post.createdAt).toLocaleString()}
          </p>

          {/* Like button */}
        <div className="mt-3 flex gap-4 ">
          <div className="flex-shrink-0">
          <button
            onClick={() => toggleLike(post._id)}
            className="flex items-center gap-1 text-blue-500 hover:text-blue-700 border border-blue-500 hover:border-blue-700 rounded-full px-2 py-1 hover:bg-blue-200"
          >
            👍 {post.likes?.length || 0}
          </button>
          </div>

        {/* Add Comment + Comments Section */}
<div className="flex-1 flex flex-col ">
  
  {/* Input + Submit in the same row */}
  <div className="flex gap-2 ">
    <input
      type="text"
      value={commentText[post._id] || ""}
      onChange={(e) =>
        setCommentText((prev) => ({ ...prev, [post._id]: e.target.value }))
      }
      placeholder="Write a comment..."
      className="flex-1 border border-blue-500 rounded-full px-3 py-1 mb-5"
    />
    <button
      onClick={() => addComments(post._id)}
      className="px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-transform transform active:scale-95"
    >
      Submit
    </button>
  </div>

  {/* Comments list below */}
  <div className="flex flex-col gap-2">
    {post.comments?.map((c) => (
      <div
        key={c._id}
        className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
      >
        <p className="text-sm">
          <strong>{c.user.username}</strong>: {c.text}
        </p>
         {/* {c.user?._id === user?._id && ( */}
         {( c.user?._id === user?.id) && (
      <button
        onClick={() => deleteComments(post._id, c._id)}
        className="text-red-500 hover:text-red-700 ml-2"
      >
        🗑
      </button>
    )}
      </div>
    ))}
  </div>
</div>

        </div>
        </div>
      ))}


      

      {/* Pagination controls */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={() => fetchPosts(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="px-4 py-2 bg-white rounded-full disabled:opacity-70"
        >
          Prev
        </button>
        <span className="px-4 py-2 ">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={() => fetchPosts(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="px-4 py-2 bg-white rounded-full disabled:opacity-50 "
        >
          Next
        </button>
      </div>
    </div>
  );

}
