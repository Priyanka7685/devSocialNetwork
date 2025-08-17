import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext";

export default function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const token = localStorage.getItem("token");

   const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.profile || res.data;

      // Ensure followers/following arrays exist
      const followers = data.followers || [];
      const following = data.following || [];

      setProfile({ ...data, followers, following });
      // setFollowersCount(followers.length);
      //  setIsFollowing(user ? followers.some(f => f._id === user.id || f.toString() === user.id) : false);

       // Check follow state
      const followersRes = await axios.get(`http://localhost:8000/api/auth/${userId}/followers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowersCount(followersRes.data.length);

      
      setIsFollowing(
  user ? followersRes.data.some(f => f._id === user.id || f.toString() === user.id) : false
);

      const followingRes = await axios.get(`http://localhost:8000/api/auth/${userId}/following`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowingCount(followingRes.data.length);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchProfile();
  }, [userId, token]);

  
  if (loading) return <p>Loading...</p>;
  // if (!profile) return <p>User not found</p>;
  if (!profile || !profile.user) {
  return <p>Loading profile...</p>;
}


  // const followingCount = profile.following?.length || 0;


  const handleFollow = async () => {
    if (!profile?.user?._id) return; // prevent undefined error
    try {
      await axios.post(
        `http://localhost:8000/api/auth/${profile.user._id}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
      setProfile(prev => ({
        ...prev,
        followers: [...prev.followers, { _id: user.id }],
      }));

      // await fetchProfile();
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  };

  const handleUnfollow = async () => {
  if (!profile?.user?._id) return; // prevent undefined error
    try {
      await axios.post(
        `http://localhost:8000/api/auth/${profile.user._id}/unfollow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
     setIsFollowing(false);
      setFollowersCount(prev => prev - 1);
      setProfile(prev => ({
        ...prev,
        followers: prev.followers.filter(f => f._id !== user.id && f.toString() !== user.id),
      }));

      // await fetchProfile();
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black px-4">
  <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl shadow-xl space-y-6 mt-4 mb-4">
    
    {/* Avatar */}
    <div className="flex flex-col items-center text-center">
      <img
        src={profile.profilePicture || "/default-avatar.png"}
        alt={profile.user.username}
        className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-pink-400 object-cover shadow-2xl"
      />
      
      <h2 className="mt-5 text-2xl md:text-3xl font-semibold tracking-wide font-poppins text-pink-300">
        {profile.user.username.charAt(0).toUpperCase() + user.username.slice(1)}
      </h2>
      <p className="mt-2 text-md md:text-lg text-gray-300 tracking-wides">{profile.user.email}</p>
      
      {profile.bio && (
        <p  className="text-gray-300 mt-4 max-w-md text-base md:text-lg leading-relaxed font-light px-4">
          {profile.bio}
        </p>
      )}

    </div>
      {/* Followers / Following */}
          <div className="mt-4 flex gap-6 text-white font-medium">
            <span>Followers: {followersCount}</span>
            <span>Following: {followingCount}</span>
          </div>

          {/* Follow / Unfollow Button */}
          {user && (user._id || user.id) !== profile?.user?._id && (
            <button
              onClick={isFollowing ? handleUnfollow : handleFollow}
              className={`mt-4 px-6 py-2 rounded-full text-white font-semibold ${
                isFollowing ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}

     


    {/* Skills */}
    {profile.skills && profile.skills.length > 0 && (
      <div className="mt-8 border-t pt-6 text-center">
        <h3 className="text-xl md:text-2xl font-semibold mb-4 tracking-tight text-white">Skills & Languages</h3>
        <ul className="flex flex-wrap gap-2 justify-center">
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
      <div className="mt-8 border-t pt-6 text-center">
        <h3 className="text-xl font-semibold text-white mb-3">Website</h3>
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
        <h3 className="text-xl font-semibold text-white mb-4">Social Links</h3>
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
