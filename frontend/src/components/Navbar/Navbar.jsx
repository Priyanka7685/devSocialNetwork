import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import { FaUser, FaSignOutAlt, FaHome, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDiscoverMenu, setShowDiscoverMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/login");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
        setShowDiscoverMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
   <nav className="bg-gradient-to-r from-gray-800 via-purple-500 to-gray-300 shadow-lg text-white px-6 py-4 flex justify-between items-center relative z-50">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
      >
        DevNet
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4 items-center" ref={dropdownRef}>
        {user ? (
          <>
            {/* Home */}
            <button
              onClick={() => navigate("/")}
              className="bg-purple-800 hover:bg-purple-700 px-4 py-2 rounded-full transition flex items-center gap-2"
            >
              <FaHome /> Home
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="bg-purple-800 hover:bg-blue-700 px-4 py-2 rounded-full transition flex items-center gap-2"
              >
                <FaUser /> Profile
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-900/90 border border-gray-700 backdrop-blur-lg rounded-lg shadow-xl overflow-hidden">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-purple-700"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Create Profile
                  </Link>

                  <Link
                    to={`/profile/${user.id}`}
                    className="block px-4 py-2 hover:bg-purple-700"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    My Profile
                  </Link>

                  <Link
                    to={`editProfile/${user.id}`}
                    className="block px-4 py-2 hover:bg-purple-700"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Edit Profile
                  </Link>

                  <Link
                    to={`myPosts/${user.id}`}
                    className="block px-4 py-2 hover:bg-purple-700"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    My Posts
                  </Link>
                </div>
              )}
            </div>

            {/* Discover Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDiscoverMenu(!showDiscoverMenu)}
                className="bg-purple-800 hover:bg-indigo-700 px-4 py-2 rounded-full transition"
              >
                Discover
              </button>

              {showDiscoverMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-900/90 border border-gray-700 backdrop-blur-lg rounded-lg shadow-xl overflow-hidden">
                  <Link
                    to="/discover"
                    className="block px-4 py-2 hover:bg-purple-700"
                    onClick={() => setShowDiscoverMenu(false)}
                  >
                    My Followers & Followings
                  </Link>
                  <Link
                    to="/searchUser"
                    className="block px-4 py-2 hover:bg-purple-700"
                    onClick={() => setShowDiscoverMenu(false)}
                  >
                    Search Users
                  </Link>
                </div>
              )}
            </div>

            {/* Create Post */}
            <button
              onClick={() => navigate("/createPosts")}
              className="bg-purple-800 hover:bg-green-700 px-4 py-2 rounded-full transition"
            >
              Create Post
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full transition flex items-center gap-2"
            >
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenu && (
        <div className="absolute top-full left-0 w-full bg-gray-900 text-white flex flex-col items-start p-4 space-y-3 md:hidden shadow-xl z-40">
          {user ? (
            <>
              <Link
                to="/"
                className="block w-full px-4 py-2 hover:bg-purple-700 rounded-lg"
                onClick={() => setMobileMenu(false)}
              >
                <FaHome className="inline mr-2" /> Home
              </Link>

              <Link
                to="/profile"
                className="block w-full px-4 py-2 hover:bg-purple-700 rounded-lg"
                onClick={() => setMobileMenu(false)}
              >
                Create Profile
              </Link>

              <Link
                to={`/profile/${user.id}`}
                className="block w-full px-4 py-2 hover:bg-purple-700 rounded-lg"
                onClick={() => setMobileMenu(false)}
              >
                My Profile
              </Link>

              <Link
                to={`editProfile/${user.id}`}
                className="block w-full px-4 py-2 hover:bg-purple-700 rounded-lg"
                onClick={() => setMobileMenu(false)}
              >
                Edit Profile
              </Link>

              <Link
                to={`myPosts/${user.id}`}
                className="block w-full px-4 py-2 hover:bg-purple-700 rounded-lg"
                onClick={() => setMobileMenu(false)}
              >
                My Posts
              </Link>

              <Link
                to="/discover"
                className="block w-full px-4 py-2 hover:bg-purple-700 rounded-lg"
                onClick={() => setMobileMenu(false)}
              >
                Discover
              </Link>

              <Link
                to="/searchUser"
                className="block w-full px-4 py-2 hover:bg-purple-700 rounded-lg"
                onClick={() => setMobileMenu(false)}
              >
                Search Users
              </Link>

              <Link
                to="/createPosts"
                className="block w-full px-4 py-2 hover:bg-purple-700 rounded-lg"
                onClick={() => setMobileMenu(false)}
              >
                Create Post
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenu(false);
                }}
                className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition text-left"
              >
                <FaSignOutAlt className="inline mr-2" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                onClick={() => setMobileMenu(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
                onClick={() => setMobileMenu(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
