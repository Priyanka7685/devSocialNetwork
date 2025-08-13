import { useState, useRef } from "react"
import { Toaster, toast } from "react-hot-toast"
import axios from "axios"


export default function CreatePosts() {
    const [ text, setText ] = useState("")
    const [ image, setImage ] = useState("")
    const [ loading, setLoading ] = useState(false)
    const fileInputRef = useRef(null);


    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append("text", text)
        if(image) formData.append("image", image)


        try {
            setLoading(true)

            const token = localStorage.getItem("token")
            const res = await axios.post("http://localhost:8000/api/post/create",formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            })

            toast.success("Post created successfully" || res.data.message)
            setText("")
            setImage(null)
            if (fileInputRef.current) fileInputRef.current.value = "";
        
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Error creating post");
        }finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-200 px-4 py-10 flex justify-center font-sans">
        <div className="bg-white shadow-lg rounded-xl max-w-2xl w-full p-8 h-100">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                <textarea 
                placeholder="What's on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
                rows="3"
                />

                <input 
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                file:text-sm file:font-semibold 
                file:bg-blue-50 file:text-blue-700 
                hover:file:bg-blue-100 cursor-pointer"
                />  

                <button 
                className={`w-full mt-25 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:opacity-90 transition duration-200 font-semibold
                ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} 
                transition-colors`}
                type="submit"
                disabled={loading}>
                {loading ? "Posting..." :"Publish"}
                </button>
            </form>
            {/* Toast container */}
                <Toaster position="top-right" autoClose={3000} />
        </div>
        </div>
    )
}