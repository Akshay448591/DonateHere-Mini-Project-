import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SuperAdminHandleAdmins = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update user role
  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to set this user as ${newRole}?`)) return;

    try {
      setUpdatingUserId(userId);
      await axios.patch(
        `http://localhost:5000/api/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to update role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading)
    return (
      <div className="p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-64 bg-gray-200 rounded shadow"></div>
      </div>
    );

  return (
    <div className="p-6 mt-16 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Handle Admins</h2>
      <p className="mb-6 text-gray-600">
        Promote users to admin or demote admins back to regular users.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border-b text-left text-gray-700">Name</th>
              <th className="px-4 py-3 border-b text-left text-gray-700">Email</th>
              <th className="px-4 py-3 border-b text-left text-gray-700">Role</th>
              <th className="px-4 py-3 border-b text-left text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 border-b">{user.name}</td>
                <td className="px-4 py-3 border-b">{user.email}</td>
                <td className="px-4 py-3 border-b capitalize">{user.role}</td>
                <td className="px-4 py-3 border-b">
                  {user.role === "admin" ? (
                    <button
                      disabled={updatingUserId === user._id}
                      onClick={() => handleRoleChange(user._id, "user")}
                      className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition font-medium ${
                        updatingUserId === user._id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {updatingUserId === user._id ? "Updating..." : "Demote to User"}
                    </button>
                  ) : (
                    <button
                      disabled={updatingUserId === user._id}
                      onClick={() => handleRoleChange(user._id, "admin")}
                      className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition font-medium ${
                        updatingUserId === user._id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {updatingUserId === user._id ? "Updating..." : "Promote to Admin"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminHandleAdmins;
