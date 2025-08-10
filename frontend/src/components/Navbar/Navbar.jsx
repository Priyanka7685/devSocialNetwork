import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <nav className="bg-purple-50 shadow-md py-4 px-6 flex justify-between items-center relative">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        DevNet
      </Link>

      <div className="space-x-4 flex items-center">
        {user ? (
          <>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Profile
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Create Profile
                  </Link>
                  <Link
                    to={`/profile/${user.id}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to={`editProfile/${user.id}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Edit Profile
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                /* handle create post */
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Create Post
            </button>

            <button
              onClick={handleLogout}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
