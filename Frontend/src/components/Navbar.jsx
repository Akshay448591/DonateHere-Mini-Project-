import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Navbar = ({ isLoggedIn = false, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const role = localStorage.getItem("role") || "";

  // ------------------ Menu Items ------------------
  const menuItems = ["Home"];
  if (role === "superadmin") {
    menuItems.push(
      "Dashboard",
      "Accepted Requests",
      "Published Fundraisers",
      "Handle Admins" // <-- New menu item
    );
  } else if (role === "admin") {
    menuItems.push("Dashboard", "Fundraiser Requests");
  } else if (role === "user") {
    menuItems.push("Dashboard", "Create Fundraiser");
  }

  menuItems.push("Profile");
  if (!role) menuItems.push("Get Started");
  else menuItems.push("Logout");

  // ------------------ Menu Item Click ------------------
  const handleClick = (item) => {
    setMenuOpen(false);
    switch (item) {
      case "Home":
        navigate("/");
        break;
      case "Dashboard":
        navigate("/dashboard");
        break;
      case "Fundraiser Requests":
        navigate("/admin/fundraisers");
        break;
      case "Accepted Requests":
        navigate("/superadmin/fundraisers");
        break;
      case "Published Fundraisers":
        navigate("/superadmin/published-fundraisers");
        break;
      case "Handle Admins":
        navigate("/superadmin/handle-admins");
        break;
      case "Profile":
        navigate("/profile");
        break;
      case "Create Fundraiser":
        navigate("/create-fundraiser/step1");
        break;
      case "Get Started":
        navigate("/signup");
        break;
      case "Logout":
        localStorage.clear();
        if (setIsLoggedIn) setIsLoggedIn(false);
        navigate("/");
        break;
      default:
        break;
    }
  };

  // ------------------ Active Item ------------------
  const isActive = (item) => {
    switch (item) {
      case "Home":
        return location.pathname === "/";
      case "Dashboard":
        return location.pathname === "/dashboard";
      case "Fundraiser Requests":
        return location.pathname.startsWith("/admin/fundraisers");
      case "Accepted Requests":
        return location.pathname.startsWith("/superadmin/fundraisers");
      case "Published Fundraisers":
        return location.pathname.startsWith("/superadmin/published-fundraisers");
      case "Handle Admins":
        return location.pathname.startsWith("/superadmin/handle-admins");
      case "Create Fundraiser":
        return location.pathname.startsWith("/create-fundraiser");
      case "Profile":
        return location.pathname === "/profile";
      case "Get Started":
        return location.pathname === "/signup";
      default:
        return false;
    }
  };

  // ------------------ Search Logic ------------------
  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setSearchLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/fundraisers/search?query=${encodeURIComponent(
            searchQuery
          )}`
        );
        setSuggestions(res.data.fundraisers || []);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300); // debounce
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSuggestionClick = (fundraiser) => {
    navigate(`/fundraiser/${fundraiser._id}`); // redirect to unique fundraiser page
    setSearchQuery("");
    setSuggestions([]);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 shadow-md">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        {/* Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <span className="text-xl md:text-2xl font-bold text-white tracking-wide">
            DonateHere
          </span>
        </div>

        {/* Search */}
        <div className="relative flex-1 mx-6">
          <input
            type="text"
            placeholder="Search fundraisers..."
            value={searchQuery}
            ref={searchRef}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 px-4 rounded-full border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 backdrop-blur-md transition"
          />
          {searchQuery && (
            <div className="absolute top-full left-0 w-full bg-white rounded-b-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {searchLoading && <p className="p-2 text-gray-500">Loading...</p>}
              {!searchLoading && suggestions.length === 0 && (
                <p className="p-2 text-gray-500">No fundraisers found</p>
              )}
              {!searchLoading &&
                suggestions.map((f) => (
                  <div
                    key={f._id}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSuggestionClick(f)}
                  >
                    {f.basicDetails.title} - {f.basicDetails.category}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Hamburger Menu */}
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex flex-col space-y-1 p-2 rounded-md border border-white/40 hover:bg-white/10 transition"
          >
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-50">
              <ul className="flex flex-col text-gray-800 font-medium">
                {menuItems.map((item, idx) => (
                  <li
                    key={idx}
                    className={`px-4 py-3 hover:bg-gray-100 cursor-pointer ${
                      isActive(item) ? "bg-gray-100 font-semibold" : ""
                    }`}
                    onClick={() => handleClick(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
