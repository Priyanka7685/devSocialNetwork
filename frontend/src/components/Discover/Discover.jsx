import axios from "axios"
import { useAuth } from "../AuthContext/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Discover() {

    const [ followers, setFollowers ] = useState(0);
    const [ following, setFollowing ] = useState(0);

    const token = localStorage.getItem("token");
    const { user } = useAuth()


    const fetchData = async() => {
        try {
            const followerRes = await axios.get(`http://localhost:8000/api/auth/${user.id}/followers`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setFollowers(followerRes.data || []);

            const followingRes = await axios.get(`http://localhost:8000/api/auth/${user.id}/following`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setFollowing(followingRes.data || []);
        } catch (error) {
            console.error("Error fetching followers:", error);
            
        }
    }

    useEffect(() => {
        if(!user?.id || !token) return
        fetchData();
    },[ user, token ]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-200 px-4 py-10 flex justify-center font-sans">
        <div className="bg-white shadow-lg rounded-xl max-w-2xl w-full p-8 ">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">My followers and followings</h1>
 
      {/* Counts */}
      <div className="grid grid-cols-2 gap-4 mb-8 text-center">
        <div className="bg-blue-100 p-4 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold">Followers</h2>
          <p className="text-2xl font-bold">{followers.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold">Following</h2>
          <p className="text-2xl font-bold">{following.length}</p>
        </div>
      </div>

      {/* Followers List */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Followers</h2>
        {followers.length > 0 ? (
          <div className="space-y-3">
            {followers.map((f) => (
              <div
                key={f._id}
                className="bg-white border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                    <Link  
                    to={`/user/${f._id}`} 
                    className="text-lg font-medium text-gray-700 hover:text-blue-500">
                  <p className="font-semibold">{f.username}</p>
                  </Link>
                </div>
                <span className="text-blue-500 text-sm">Follower</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No followers yet.</p>
        )}
      </div>

      {/* Following List */}
      <div>
        <h2 className="text-xl font-bold mb-4">Following</h2>
        {following.length > 0 ? (
          <div className="space-y-3">
            {following.map((f) => (
              <div
                key={f._id}
                className="bg-white border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                    <Link  
                    to={`/user/${f._id}`}>
                  <p className="font-semibold">{f.username}</p>
                  </Link>
                  {/* <p className="text-sm text-gray-500">{f.email}</p> */}
                </div>
                <span className="text-green-500 text-sm">Following</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Not following anyone yet.</p>
        )}
      </div>
    </div>
    </div>

  );
}