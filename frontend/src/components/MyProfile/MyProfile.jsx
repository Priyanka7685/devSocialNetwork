import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../AuthContext/AuthContext"
import { Link } from "react-router-dom"


    export default function MyProfile() {

        const { user } = useAuth()
        const { userId } = useParams()

        const [ profile, setProfile ] = useState(null)
        const [loading, setLoading] = useState(true);
         console.log(profile);
         
         
        useEffect(() => {
            
            if(!userId) return
            const fetchProfile = async () => {
                setLoading(true)
                try {
                    const res = await axios.get(`http://localhost:8000/api/profile/${userId}`)
                    setProfile(res.data.profile)

                } catch (error) {
                    console.log(error);
                    toast.error("Failed to fetch profile");
                } finally {
                    setLoading(false);
                }
            }
            fetchProfile()

        }, [userId])

        if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <p className="text-gray-600 text-lg">Loading profile...</p>
            </div>
        );
    }

    if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">No profile found.</p>
      </div>
    );
  }

        return (
            <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-200 px-4 py-10  flex justify-center">
        <div className="bg-white shadow-lg rounded-lg max-w-2xl w-full p-6">

            <h2 className="text-3xl font-bold text-center text-blue-600 mb-7">
          My Profile
        </h2>
            {/* Avatar & Name */}
            <div className="flex flex-col items-center text-center">
            <img
                src={profile.profilePicture || "/default-avatar.png"}
                alt="User avatar"
                className="w-32 h-32 rounded-full border-4 border-indigo-500 object-cover"
            />

            {profile && (
            <h1 className="mt-4 text-2xl font-bold text-gray-800">
                {user.username}
                {/* {profile.user.username || "User"} */}
            </h1>
             )} 
            {profile.bio && (
                <p className="text-gray-800 mt-2 max-w-md">{profile.bio}</p>
            )}
            </div>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
            <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Skills/Languages
                </h3>
                <ul className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                    <li
                    key={index}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                    >
                    {skill}
                    </li>
                ))}
                </ul>
            </div>
            )}

            <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Website
                </h3>
            {profile.website && (
                <p className="text-gray-800 mt-2 max-w-md">{profile.website}</p>
            )}
            </div>

            {/* Social Links */}
            {profile.socialLinks && (
            <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Social Links
                </h3>
                <div className="flex flex-wrap gap-3">
                {profile.socialLinks.github && (
                    <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
                    >
                    GitHub
                    </a>
                )}
                {profile.socialLinks.linkedin && (
                    <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                    LinkedIn
                    </a>
                )}
                {profile.socialLinks.twitter && (
                    <a
                    href={profile.socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
                    >
                    Twitter
                    </a>
                )}
                </div>

                <div className="flex justify-center">
                    {/* <button className="bg-blue-500 text-white px-4 py-2 mt-25 rounded-lg hover:bg-blue-600"> */}
                    <button className=" bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 mt-20 rounded-lg hover:opacity-90 transition duration-200 font-semibold">
                     <Link
                    to={`/editProfile/${userId}`}
                    // className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Edit Profile
                  </Link>
                    </button>
                </div>
            </div>
            )}
        </div>
        </div>
    );
    }