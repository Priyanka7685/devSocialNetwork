import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../AuthContext/AuthContext"
import { useState, useEffect } from "react"
import axios from "axios"
import { toast,Toaster } from "react-hot-toast"


export const EditProfile = () => {
    const { user }  = useAuth()
    const navigate = useNavigate()
    const { userId } = useParams()


    const [originalProfile, setOriginalProfile] = useState(null);

    const [form, setForm] = useState({
        bio: "",
        skills: "",
        github: "",
        website: "",
        linkedin: "",
        twitter: "",

    })

    useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(`http://localhost:8000/api/profile/${userId}`);
        const profile = res.data.profile || res.data;

        setOriginalProfile(profile);

        setForm({
          bio: profile.bio || "",
          skills: profile.skills ? profile.skills.join(", ") : "",
          github: profile.socialLinks?.github || "",
          website: profile.website || "",
          linkedin: profile.socialLinks?.linkedin || "",
          twitter: profile.socialLinks?.twitter || "",
        });
      } catch (error) {
        toast.error("Failed to fetch profile");
      }
    }

    if (userId) fetchProfile();
  }, [userId]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

   const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare skills as array
     const mergedProfile = {
      ...originalProfile,
      bio: form.bio.trim() === "" ? originalProfile?.bio : form.bio,
      website: form.website.trim() === "" ? originalProfile?.website : form.website,
      skills:
        form.skills.trim() === ""
          ? originalProfile?.skills || []
          : form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      socialLinks: {
        github:
          form.github.trim() === ""
            ? originalProfile?.socialLinks?.github || ""
            : form.github,
        linkedin:
          form.linkedin.trim() === ""
            ? originalProfile?.socialLinks?.linkedin || ""
            : form.linkedin,
        twitter:
          form.twitter.trim() === ""
            ? originalProfile?.socialLinks?.twitter || ""
            : form.twitter,
      },
    };

    try {
      await axios.put(`http://localhost:8000/api/profile/editProfile/${userId}`, mergedProfile);
      toast.success("Profile updated successfully!");
      navigate(`/profile/${userId}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };
    return (
         <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-200 px-4 py-10  flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 max-w-2xl w-full"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Edit Profile
        </h2>


        <label className="block  text-gray-800 font-medium" htmlFor="bio">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></textarea>

        <label className="block  text-gray-800 font-medium" htmlFor="skills">
          Skills (comma separated)
        </label>
        <input
          type="text"
          id="skills"
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="e.g. React, Node.js, Tailwind CSS"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <h3 className="font-semibold mt-6 mb-3">Social Links</h3>

        <label className="block  text-gray-800 font-medium" htmlFor="github">
          Website URL
        </label>
        <input
          type="url"
          id="website"
          name="website"
          value={form.website}
          onChange={handleChange}
          placeholder="https:yourProfile.com"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block  text-gray-800 font-medium" htmlFor="github">
          GitHub URL
        </label>
        <input
          type="url"
          id="github"
          name="github"
          value={form.github}
          onChange={handleChange}
          placeholder="https://github.com/username"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block  text-gray-800 font-medium" htmlFor="linkedin">
          LinkedIn URL
        </label>
        <input
          type="url"
          id="linkedin"
          name="linkedin"
          value={form.linkedin}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/username"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block  text-gray-800 font-medium" htmlFor="twitter">
          Twitter URL
        </label>
        <input
          type="url"
          id="twitter"
          name="twitter"
          value={form.twitter}
          onChange={handleChange}
          placeholder="https://twitter.com/username"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full mt-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:opacity-90 transition duration-200 font-semibold"
        >
          Save Changes
        </button>
      </form>
      {/* Toast container */}
                <Toaster position="top-right" autoClose={3000} />

    </div>
  );
}