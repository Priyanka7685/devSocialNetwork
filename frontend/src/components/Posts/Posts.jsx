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
        </div>
      ))}

      {/* Pagination controls */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={() => fetchPosts(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2 ">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={() => fetchPosts(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );

}
