import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// import { useAuth } from "../AuthContext/AuthContext";

export default function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
//   const { user } = useAuth()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/profile/${userId}`);
        setProfile(res.data.profile);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>User not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-200 flex justify-center items-start pt-10 px-4">
  <div className="bg-white shadow-lg rounded-xl max-w-xl w-full p-8">
    
    {/* Avatar */}
    <div className="flex flex-col items-center text-center">
      <img
        src={profile.profilePicture || "/default-avatar.png"}
        alt={profile.user.username}
        className="w-36 h-36 rounded-full border-4 border-indigo-500 object-cover shadow-md"
      />
      
      <h2 className="mt-5 text-3xl font-extrabold text-gray-900 tracking-tight">
        {profile.user.username}
      </h2>
      <p className="text-gray-600 mt-1">{profile.user.email}</p>
      
      {profile.bio && (
        <p className="text-gray-700 mt-3 max-w-md text-center text-base leading-relaxed font-light">
          {profile.bio}
        </p>
      )}
    </div>

    {/* Skills */}
    {profile.skills && profile.skills.length > 0 && (
      <div className="mt-8 border-t pt-6 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills & Languages</h3>
        <ul className="flex flex-wrap gap-2 justify-center">
          {profile.skills.map((skill, index) => (
            <li
              key={index}
              className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Website */}
    {profile.website && (
      <div className="mt-8 border-t pt-6 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Website</h3>
        <a
          href={profile.website}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {profile.website}
        </a>
      </div>
    )}

    {/* Social Links */}
    {profile.socialLinks && (
      <div className="mt-8 border-t pt-6 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Social Links</h3>
        <div className="flex justify-center gap-3 flex-wrap">
          {profile.socialLinks.github && (
            <a
              href={profile.socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:opacity-90 transition"
            >
              GitHub
            </a>
          )}
          {profile.socialLinks.linkedin && (
            <a
              href={profile.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 bg-blue-700 text-white rounded-full text-sm font-medium hover:opacity-90 transition"
            >
              LinkedIn
            </a>
          )}
          {profile.socialLinks.twitter && (
            <a
              href={profile.socialLinks.twitter}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 bg-sky-500 text-white rounded-full text-sm font-medium hover:opacity-90 transition"
            >
              Twitter
            </a>
          )}
        </div>
      </div>
    )}
    
  </div>
</div>

  );
}
