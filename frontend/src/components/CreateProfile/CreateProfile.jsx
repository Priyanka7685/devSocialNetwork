import axios from "axios"
import { toast, Toaster } from "react-hot-toast"
import { useState } from "react"

export const CreateProfile = () => {

    const [ formData, setFormData ] = useState({
        bio: '',
        location: '',
        website: '',
        skills: "",
        socialLinks: {
            twitter: '',
            github: '',
            linkedin: ''
        },
        profilePicture: null
        
    })
    const [ loading, setLoading ] = useState(false)


    const handleChange = (e) => {
         const { name, value, files } = e.target;

         // Handle file input separately
    if (name === "profilePicture") {
      setFormData({
        ...formData,
        profilePicture: files[0] || null,
      });
      return;
    }

        if (["twitter", "github", "linkedin"].includes(name)) {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [name]: value
      }
    });
  } else {
    setFormData({
      ...formData,
      [name]: value
    });
  }         
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // for creating profile
        try {
            const token = localStorage.getItem("token")
            // console.log(token);
            

            if (!token) {
        toast.error("No token found. Please log in.");
        setLoading(false);
        return;
            }

             // Create FormData to send file + text fields
      const data = new FormData()
      data.append("bio", formData.bio)
      data.append("location", formData.location)
      data.append("website", formData.website)
      data.append("skills", formData.skills)
      data.append("socialLinks", JSON.stringify(formData.socialLinks))
      if (formData.profilePicture) {
        data.append("profilePicture", formData.profilePicture)
      }

            const res = await axios.post(
                `http://localhost:8000/api/profile`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )

            toast.success(res.data?.message || "Profile created successfully")
        } catch (error) {
            toast.error(error.response?.data?.message || "Error creating profile");
            console.error(error);
            
        }finally {
            setLoading(false)
        }
    }

    return (
        // <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black px-4">
            {/* <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700"> */}
            
            <form className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl shadow-xl space-y-6 mt-4 mb-4" onSubmit={handleSubmit}>
            <h2 className="text-4xl font-extrabold text-center text-white mb-6">Create Profile</h2>
                 <div>
            <label className="block text-sm font-medium text-gray-200">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write something about yourself..."
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. New York, USA"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Website
            </label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="e.g. yourProfile.com"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Skills
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. JavaScript, React, Node.js"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* social links */}
          <div>
            <label className="block text-sm font-medium text-white ">
              Social Links
            </label>
            <input
              type="text"
              name="twitter"
              value={formData.socialLinks.twitter}
              onChange={handleChange}
              placeholder="twitter"
              className="w-full px-4 py-3 mb-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="text"
              name="linkedin"
              value={formData.socialLinks.linkedin}
              onChange={handleChange}
              placeholder="linkedin"
              className="w-full px-4 py-3 mb-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="text"
              name="github"
              value={formData.socialLinks.github}
              onChange={handleChange}
              placeholder="github"
              className="w-full px-4 py-3 mb-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium text-white">Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white file:bg-purple-600 file:text-white file:px-3 file:py-1 file:rounded-lg file:border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
                

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-all duration-200"
          >
                    {loading ? "Creating..." : "Create Profile"}
          </button>
            </form>

            {/* Toast container */}
                <Toaster position="top-right" autoClose={3000} />
            {/* </div> */}
        </div>
    )
}