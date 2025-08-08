import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../AuthContext/AuthContext"


export default function Navbar() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()


    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    const handlePost = () => {

    }


    return (
         <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        DevNet
      </Link>

      <div className="space-x-4">
        {user ? (
          <>
            <Link to="/profile" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Profile</Link>
            <button
              onClick={handlePost}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Create Post
            </button>


            <button
              onClick={handleLogout}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Login</Link>
            <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Register</Link>
          </>
        )}
      </div>
    </nav>
       
    )
}