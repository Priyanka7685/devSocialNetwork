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
        // for updating profile
         const { name, value } = e.target;

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
                "http://localhost:8000/api/profile",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-200 px-4 ">
            {/* <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700"> */}
            
            <form className="bg-white p-8 mt-7 mb-7 rounded-xl shadow-md w-full max-w-2xl space-y-6" onSubmit={handleSubmit}>
            <h2 className="text-3xl font-bold text-center text-blue-600">Create Profile</h2>
                 <div>
            <label className="block text-sm font-medium text-gray-800">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write something about yourself..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. New York, USA"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Website
            </label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="e.g. yourProfile.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Skills
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. JavaScript, React, Node.js"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* social links */}
          <div>
            <label className="block text-sm font-medium text-gray-800 ">
              Social Links
            </label>
            <input
              type="text"
              name="twitter"
              value={formData.socialLinks.twitter}
              onChange={handleChange}
              placeholder="twitter"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-1.5"
            />
            <input
              type="text"
              name="linkedin"
              value={formData.socialLinks.linkedin}
              onChange={handleChange}
              placeholder="linkedin"
              className="w-full px-4 py-3 mb-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="github"
              value={formData.socialLinks.github}
              onChange={handleChange}
              placeholder="github"
              className="w-full px-4 py-3 mb-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium text-gray-800">Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
                

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full  bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:opacity-90 transition duration-200 font-semibold"
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