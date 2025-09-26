import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardAnalytics from "../pages/DashboardAnalytics";

const DashboardPage = () => {
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "User";
  const role = localStorage.getItem("role") || "user";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    localStorage.removeItem("fundraiserId");
    navigate("/login");
  };

  const handleCreateFundraiser = () => {
    localStorage.removeItem("fundraiserId");
    navigate("/create-fundraiser/step1");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="w-full bg-white shadow px-4 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h1 className="text-lg sm:text-xl font-bold text-indigo-600 text-center sm:text-left w-full sm:w-auto">
          {role.toUpperCase()} Dashboard
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0">
          <span className="text-gray-700 font-medium text-sm sm:text-base text-center sm:text-left">
            👋 Welcome, <strong>{name}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition text-sm sm:text-base w-full sm:w-auto"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-6 sm:px-6 sm:py-10">
        <div className="w-full max-w-5xl space-y-6">
          {/* Role-specific panels */}
          {role === "admin" && (
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-xl transition w-full">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <span className="text-indigo-600 text-lg sm:text-xl">🛡️</span>
                <h3 className="text-md sm:text-lg font-semibold text-gray-800">
                  Admin Controls
                </h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage users and content from this panel.
              </p>
            </div>
          )}

          {role === "superadmin" && (
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-xl transition w-full">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <span className="text-purple-600 text-lg sm:text-xl">👑</span>
                <h3 className="text-md sm:text-lg font-semibold text-gray-800">
                  Superadmin Controls
                </h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                Full access to system settings and administrators.
              </p>
            </div>
          )}

          {role === "user" && (
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-xl transition w-full">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <span className="text-green-600 text-lg sm:text-xl">🙋</span>
                <h3 className="text-md sm:text-lg font-semibold text-gray-800">
                  User Panel
                </h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                View your dashboard and create new fundraisers.
              </p>
              <button
                onClick={handleCreateFundraiser}
                className="mt-3 sm:mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition text-sm sm:text-base w-full sm:w-auto"
              >
                ➕ Create Fundraiser
              </button>
            </div>
          )}

          {/* Analytics Section */}
          {(role === "admin" || role === "superadmin") && (
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 w-full overflow-x-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center sm:text-left">
                📊 Analytics Overview
              </h2>
              <div className="w-full overflow-x-auto">
                <DashboardAnalytics />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
