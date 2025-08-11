import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext";

export default function MyProfile() {
  const { user } = useAuth();
  const { userId } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/profile/${userId}`);
        setProfile(res.data.profile);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 font-sans">
        <p className="text-gray-600 text-lg tracking-wide">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 font-sans">
        <p className="text-gray-600 text-lg tracking-wide">No profile found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-200 px-4 py-10 flex justify-center font-sans">
      <div className="bg-white shadow-lg rounded-xl max-w-2xl w-full p-8 ">
        <h2 className="text-4xl font-extrabold text-center text-blue-600 mb-8 tracking-tight font-poppins">
          My Profile
        </h2>

        {/* Avatar & Name */}
        <div className="flex flex-col items-center text-center">
          <img
            src={profile.profilePicture || "/default-avatar.png"}
            alt="My Profile Picture"
            className="w-36 h-36 rounded-full border-4 border-indigo-500 object-cover shadow-md"
          />

          {profile && (
            <h1 className="mt-5 text-2xl font-semibold text-gray-900 tracking-wide font-poppins">
              {user.username}
            </h1>
          )}
          {profile.bio && (
            <p className="text-gray-700 mt-3 max-w-md text-base leading-relaxed font-light">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 tracking-tight">
              Skills & Languages
            </h3>
            <ul className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <li
                  key={index}
                  className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium tracking-wide"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Website */}
        {profile.website && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 tracking-tight">
              Website
            </h3>
            <a
              href={profile.website}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium tracking-wide transition"
            >
              {profile.website}
            </a>
          </div>
        )}

        {/* Social Links */}
        {profile.socialLinks && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 tracking-tight">
              Social Links
            </h3>
            <div className="flex flex-wrap gap-3">
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

            <div className="flex justify-center">
              <Link
                to={`/editProfile/${userId}`}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 mt-10 rounded-full hover:opacity-90 transition font-semibold tracking-wide shadow-md"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
