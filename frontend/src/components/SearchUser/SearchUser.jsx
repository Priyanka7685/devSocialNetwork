import axios from "axios"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SearchUser() {

    const token = localStorage.getItem("token")


    const [ users, setUsers ] = useState([]);
    const [ search, setSearch ] = useState("");
    const [ skill, setSkill ] = useState("");
    const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 5, 
  });


    const fetchUser = async(page = pagination.currentPage) => {
        try {
            const res = await axios.get(`https://devsocialnetwork-production.up.railway.app/api/profile?page=${page}&limit=${pagination.pageSize}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data.users);
            setPagination(
      res.data.pagination || {
        currentPage: page,
        totalPages: 1,
        pageSize: pagination.pageSize,
      }
    );
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    useEffect(() => {
        fetchUser()
    }, [token])



    const filteredUsers = users.filter((u) => {
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase());
    const matchSkill = skill
      ? u.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
      : true;
    return matchSearch && matchSkill;
  });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black px-4">
            <div className="bg-gradient-to-r from-gray-300 via-purple-300 to-blue-300 shadow-lg rounded-xl max-w-xl w-full p-8">
      <h2 className="text-2xl font-bold mb-6 text-pink-600 text-center ">Search Users</h2>

      {/* Search Bar */}
      <div className="flex gap-4 mb-6 ">
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none resize-none bg-blue-100 "
        />
        <input
          type="text"
          placeholder="Filter by skill..."
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none resize-none bg-pink-100 "
        />
      </div>

      {/* User List */}
      <div className="grid gap-4 ">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <div
              key={u._id}
              className="flex justify-between items-center border p-4 rounded shadow-sm  "
            >
              <Link
                to={`/user/${u._id}`}
                className="text-lg font-semibold text-pink-600 hover:underline "
              >
                {u.username}
              </Link>
              <div>
                <p className="text-sm text-gray-600">
                  Skills: {u.skills?.join(", ") || "N/A"}
                </p>
                
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No users found</p>
        )}
      </div>


      {/* Pagination controls */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={() => fetchUser((pagination?.currentPage || 1) - 1)}
          disabled={!pagination || pagination.currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded-full disabled:opacity-70 " 
        >
          Prev
        </button>
        <span className="px-4 py-2 ">
          Page {pagination?.currentPage || 1} of {pagination?.totalPages || 1}
        </span>
        <button
          onClick={() => fetchUser((pagination?.currentPage || 1) + 1)}
          disabled={!pagination || pagination.currentPage === pagination.totalPages}
          className="px-4 py-2 bg-gray-200 rounded-full disabled:opacity-50 "
        >
          Next
        </button>
      </div>
    </div>
    </div>
  );
}