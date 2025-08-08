import { useState } from "react"
import axios from "axios"
import { toast, Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../AuthContext/AuthContext"

export default function Login() {
    const [ username, setUsername ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const navigate = useNavigate()
    const { login } = useAuth()

const handleLogin = async (e) => {

    e.preventDefault()

    try {
        const res = await axios.post(
            "http://localhost:8000/api/auth/login",
            { username, email, password },
            { withCredentials: true }
        )

        toast.success("Login successful")
        login(res.data.user)

        navigate("/")
    } catch (error) {
        toast.error("Login failed. Please check your credentials")
    }
}

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-200 px-4">
            <form className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6" onSubmit={handleLogin}>
                <h2 className="text-3xl font-bold text-center text-blue-600">
                    Login to <span className="text-purple-600">DevNet</span>
                </h2>

                <input 
                type="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                 />

                <input 
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                 />

                <input 
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                 />

                 <button 
                 type="submit"

                 className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:opacity-90 transition duration-200 font-semibold"
                 >Login</button>

                 <p className="text-center text-sm text-gray-600">
                     Don't have an account? <a 
                     href="/register"
                      className="text-blue-500 hover:underline font-medium"
                      >
                     Register
                     </a>
                 </p>

                 
            </form>

             {/* Toast container */}
                <Toaster position="top-right" autoClose={3000} />

        </div>
    )
}