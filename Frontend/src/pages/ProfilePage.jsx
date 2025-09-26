import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "user";

  const [profile, setProfile] = useState({
    name: localStorage.getItem("name") || "User",
    email: localStorage.getItem("email") || "example@email.com",
    role,
  });

  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const handleUpdatePassword = async () => {
    if (!showPassword || !password) return alert("Please enter new password");

    setUpdating(true);
    setMessage(null);
    try {
      const endpoint = "/api/user/change-password";

      const payload = { newPassword: password };

      const res = await axios.post(`http://localhost:5000${endpoint}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ type: "success", text: res.data.msg || "Password updated!" });
      setPassword("");
      setShowPassword(false);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.msg || "Update failed!" });
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-xl p-10 transform transition-transform hover:scale-102">
        <div className="w-24 h-24 bg-indigo-500 text-white text-3xl font-bold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          {initials}
        </div>

        <h1 className="text-4xl font-extrabold text-indigo-600 text-center mb-6">
          {profile.role.toUpperCase()} Profile
        </h1>

        {message && (
          <div
            className={`mb-6 p-3 rounded-xl text-center font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Name"
            className="w-full px-6 py-4 border-2 border-indigo-200 rounded-2xl focus:ring-2 focus:ring-indigo-400 transition-all"
            disabled
          />
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="Email"
            className="w-full px-6 py-4 border-2 border-indigo-200 rounded-2xl focus:ring-2 focus:ring-indigo-400 transition-all"
            disabled
          />
          {showPassword && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="w-full px-6 py-4 border-2 border-indigo-200 rounded-2xl focus:ring-2 focus:ring-indigo-400 transition-all"
            />
          )}
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="w-full text-indigo-600 font-medium mb-2 hover:underline"
          >
            {showPassword ? "Cancel Password Change" : "Update Password"}
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {showPassword && (
            <button
              onClick={handleUpdatePassword}
              disabled={updating}
              className="w-full bg-green-600 text-white py-3 rounded-2xl font-semibold hover:bg-green-700 transition-all disabled:opacity-50"
            >
              {updating ? "Updating..." : "Update Password"}
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-3 rounded-2xl font-semibold hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
