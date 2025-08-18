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
            `https://devsocialnetwork-production.up.railway.app/api/auth/login`,
            { username, email, password },
            { withCredentials: true }
        )

        toast.success("Login successful")
        localStorage.setItem("token", res.data.token);
        login(res.data.user)

        navigate("/")
    } catch (error) {
        toast.error("Login failed. Please check your credentials")
    }
}

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black px-4">
            <form className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl shadow-xl space-y-6 mt-4 mb-4" onSubmit={handleLogin}>
                <h2 className="text-4xl font-extrabold text-center text-white mb-6">
                    Login to <span className="text-pink-600">DevNet</span>
                </h2>

                <input 
                type="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="text-white w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                 />

                <input 
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-white"
                 />

                <input 
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
                 />

                 <button 
                 type="submit"

                 className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-all duration-200"
                 >Login</button>

                 <p className="text-center text-lg text-white ">
                     Don't have an account? <a 
                     href="/register"
                      className="text-pink-400 hover:underline font-bold text-lg"
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