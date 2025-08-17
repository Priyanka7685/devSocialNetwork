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
       <div className="min-h-screen bg-gradient-to-r from-gray-300 via-purple-300 to-blue-300 p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">All Posts</h1>

      {loading && <p className="text-center text-gray-600">Loading...</p>}

      {!loading && posts.length === 0 && <p>No posts found.</p>}

      {posts.map((post) => (
        <div key={post._id} className="bg-purple-100 shadow-lg rounded-2xl p-6 mb-6 border border-gray-200 transition-transform hover:scale-[1.02]">
            
            <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center font-bold text-purple-700">
            {post.user?.username?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <Link
              to={`/user/${post.user?._id}`}
              className="font-semibold text-purple-800 hover:underline"
            >
              {/* {post.user?.username || "Unknown"} */}
              {post.user?.username || "Unknown"}
            </Link>
            <Link 
            to={`/user/${post.user?._id}`}
            className="font-semibold text-blue-600 hover:underline"
            >
            <p className="text-sm text-gray-500">{post.user?.email}</p>
            </Link>
          </div>
        </div>

          <p className="text-gray-800 mb-3">{post.text}</p>
          {post.image && (
            <div className="flex justify-center mb-4">
        <img
          src={post.image}
          alt="Post"
          className="max-h-72 rounded-xl shadow-md object-cover"
        />
        </div>
      )}
          <p className="text-sm text-gray-500 mb-3">
            
            {new Date(post.createdAt).toLocaleString()}
          </p>

          {/* Like button */}
        <div className="mt-3 flex gap-4 ">
          <div className="flex flex-col gap-4">
          <button
            onClick={() => toggleLike(post._id)}
            className="flex items-center gap-2 w-fit text-blue-600 font-medium border border-blue-500 rounded-full px-3 py-1 hover:bg-blue-100 transition"
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
      className="flex-1 border border-gray-400 rounded-full px-4 py-2 focus:ring focus:ring-purple-300 focus:outline-none text-black"
    />
    <button
      onClick={() => addComments(post._id)}
      className="px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition active:scale-95"
    >
      Submit
    </button>
  </div>

  {/* Comments list below */}
  <div className="flex flex-col gap-2">
    {post.comments?.map((c) => (
      <div
        key={c._id}
        className="flex justify-between items-center bg-gray-100 p-2 rounded-lg mt-2 border border-gray-300"
      >
        <p className="text-sm text-black ">
          <strong className="text-purple-700">{c.user.username}</strong>: {c.text}
        </p>
         {/* {c.user?._id === user?._id && ( */}
         {( c.user?._id === user?.id) && (
      <button
        onClick={() => deleteComments(post._id, c._id)}
        className="text-red-500 hover:text-red-700 text-sm"
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
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => fetchPosts(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-black border rounded-full shadow hover:bg-gray-500 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-gray-700 font-medium">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={() => fetchPosts(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="px-4 py-2 bg-gray-300 text-black border rounded-full shadow hover:bg-gray-500 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );

}
