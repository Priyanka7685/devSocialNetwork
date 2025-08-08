import { useState } from "react"
import { toast,Toaster } from "react-hot-toast"
import axios from "axios"


export default function Register() {
    const [ username, setUsername ] = useState("")
    const [ fullname, setFullname ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    const handleRegister = async (e) => {
        e.preventDefault()

        try {
            const res = await axios.post(
                "http://localhost:8000/api/auth/register",
                { username, fullname, email, password },
                { withCredentials: true }
            )   

            toast.success("Registration successful")
            localStorage.setItem("user", JSON.stringify(res.data.user))
            
        } catch (error) {
            const errMsg = error.response?.data?.message || "Registration failed. Please check your credentials";
            toast.error(errMsg);
        }
    }


    return (
         <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-200 px-4">
            <form className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6" onSubmit={handleRegister}>
                <h2 className="text-3xl font-bold text-center text-blue-600">
                    Register yourself on <span className="text-purple-600">DevNet</span>
                </h2>

                {/* username */}
                <input 
                type="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                 />

                {/* fullname */}
                <input 
                type="fullname"
                placeholder="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                 />

                {/* email */}
                <input 
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                 />

                {/* password */}
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
                 >Register</button>

                 <p className="text-center text-sm text-gray-600">
                     Already have an account? <a href="/register" className="text-blue-500 hover:underline font-medium">
                     Login
                     </a>
                 </p>

                 
            </form>

             {/* Toast container */}
                <Toaster position="top-right" autoClose={3000} />

        </div>
    )
}