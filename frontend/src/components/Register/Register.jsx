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
                "https://devsocialnetwork-production.up.railway.app/api/auth/register",
                { username, fullname, email, password },
                { withCredentials: true }
            )   

            toast.success("Registration successful")
            localStorage.setItem("user", JSON.stringify(res.data.user))
            
        } catch (error) {
            const errMsg = error.response?.data?.message || "Registration failed. Please check your credentials" || error.message;
            toast.error(errMsg);
        }
    }


    return (
         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black px-4">
            <form className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl shadow-xl space-y-6 mt-4 mb-4" onSubmit={handleRegister}>
                <h2 className="text-4xl font-extrabold text-center text-white mb-6">
                    Register yourself on <span className="text-pink-600">DevNet</span>
                </h2>

                {/* username */}
                <input 
                type="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="text-white w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                 />

                {/* fullname */}
                <input 
                type="fullname"
                placeholder="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
                className="text-white w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                 />

                {/* email */}
                <input 
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-white w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                 />

                {/* password */}
                <input 
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-white w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                 />

                 <button 
                 type="submit"
                 className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-all duration-200"
                 >
                    Register
                    
                    
                    </button>

                 <p className="text-center text-lg text-white ">
                     Already have an account? <a href="/login" className="text-pink-500 text-lg hover:underline font-medium">
                     Login
                     </a>
                 </p>

                 
            </form>

             {/* Toast container */}
                <Toaster position="top-right" autoClose={3000} />

        </div>
    )
}