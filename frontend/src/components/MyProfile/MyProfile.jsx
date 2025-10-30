import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext";

export default function MyProfile() {
  const { user } = useAuth();
  const { userId } = useParams();

  const [ profile, setProfile ] = useState(null);
  const [ loading, setLoading ] = useState(true);

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
        <h1 className="text-gray-600 text-lg tracking-wide">{user.email}</h1>
        {/* <h1 className="text-gray-600 text-lg tracking-wide break-all">{user.username}</h1> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black px-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl shadow-xl space-y-6 mt-4 mb-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-8 tracking-tight font-poppins">
          My Profile
        </h2>

        {/* Avatar & Name */}
        <div className="flex flex-col items-center text-center">
          {profile.profilePicture ? (
          <img
            src={profile.profilePicture }
            alt="My Profile Picture"
            className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-pink-400 object-cover shadow-2xl"
          />
          ) : (
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-pink-400 bg-pink-600 flex items-center justify-center shadow-2xl text-5xl md:text-6xl font-bold text-white">
          {user.username?.charAt(0).toUpperCase()}
        </div>
        )}

          {profile && (
            <h1 className="mt-5 text-2xl md:text-3xl font-semibold tracking-wide font-poppins text-pink-300">
              {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
            </h1>
          )}
          {profile && (
            <h1 className="mt-2 text-md md:text-lg text-gray-300 tracking-wides">
              {user.email}
            </h1>
          )}
          {profile.bio && (
            <p className="text-gray-300 mt-4 max-w-md text-base md:text-lg leading-relaxed font-light px-4">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="mt-8 border-t border-gray-700 pt-6">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 tracking-tight text-white">
              Skills & Languages
            </h3>
            <ul className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <li
                  key={index}
                  className="bg-pink-900 text-pink-200 px-4 py-1 rounded-full text-sm md:text-base font-medium tracking-wide"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Website */}
        {profile.website && (
          <div className="mt-8 border-t border-gray-700 pt-6">
            <h3 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight text-white">
              Website
            </h3>
            <a
              href={profile.website}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 font-medium tracking-wide transition"
            >
              {profile.website}
            </a>
          </div>
        )}

        {/* Social Links */}
        {profile.socialLinks && (
          <div className="mt-8 border-t border-gray-700 pt-6">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 tracking-tight text-white">
              Social Links
            </h3>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {profile.socialLinks.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 bg-gray-800 text-white rounded-full text-sm md:text-base font-medium hover:bg-gray-700 transition"
                >
                  GitHub
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 bg-blue-700 text-white rounded-full text-sm md:text-base font-medium hover:bg-blue-600 transition"
                >
                  LinkedIn
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 bg-sky-500 text-white rounded-full text-sm md:text-base font-medium hover:bg-sky-400 transition"
                >
                  Twitter
                </a>
              )}
            </div>

            <div className="flex justify-center mt-10">
              <Link
                to={`/editProfile/${userId}`}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full hover:opacity-90 transition font-semibold tracking-wide shadow-lg"
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
