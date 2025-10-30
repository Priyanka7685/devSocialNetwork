import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom'
import axios from "axios"
import { FaTrash } from "react-icons/fa6"


export default function MyPosts() {

    const { userId} = useParams()
    const [ posts, setPosts ]  = useState([])
    const [ loading, setLoading ] = useState(false)


    const fetchUserPosts = async () => {
        setLoading(true)

        try {
            const res = await axios.get(`http://localhost:8000/api/post/${userId}`)
            setPosts(res.data.posts)

        } catch (error) {
            console.error("Error fetching user posts:", error);
            console.log(error);
            
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        fetchUserPosts()
    },[userId])

    const token = localStorage.getItem("token"); 
    const handleDelete = async (postId) => {
        try {
            await axios.delete(`http://localhost:8000/api/post/${postId}/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            
            })
            setPosts(posts.filter(post => post.id !== postId))
            fetchUserPosts()
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black px-4">
            <div className="bg-gradient-to-r from-gray-300 via-purple-300 to-blue-300 shadow-lg rounded-xl max-w-xl w-full p-8 mt-3 mb-3">
            <h1 className="text-2xl font-bold mb-6 text-pink-600 text-center ">My Posts</h1>

            {loading && <p>Loading...</p>}
            {!loading && posts.length == 0 && <p>No posts found</p>}

            {posts.map((post) => (
                <div key={post._id} className="bg-white shadow rounded-lg p-4 mb-4">
          <p className="text-gray-800">{post.text}</p>
          {post.image && (
            <div className="flex flex-col items-center text-center">
              <img
                src={post.image}
                alt="Post"
                className="w-36 h-36 md:w-44 md:h-44 mt-3 mb-3 border-4 border-pink-400 object-cover shadow-2xl"
              />
            </div>
          )}

          <p className="text-sm text-gray-500">
            Posted by {post.user?.name || post.user?.username} ({post.user?.email}) on{" "}
            {new Date(post.createdAt).toLocaleString()}
          </p>

          {/* Delete button */}
          <div className="flex justify-end mt-4">
            <button
                onClick={() => handleDelete(post._id)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded shadow-md transition duration-300 ease-in-out "
            >
      <FaTrash/>
    </button>
    </div>
        </div>
            ))}
        </div>
        </div>
    )
}