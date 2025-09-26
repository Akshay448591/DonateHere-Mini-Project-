import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const DashboardAnalytics = () => {
  const [stats, setStats] = useState(null);
  const role = localStorage.getItem("role") || "user";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // unified endpoint: user, admin, superadmin
        let endpoint = role === "user" 
          ? "/api/user/dashboard" 
          : "/api/admin/dashboard"; // admin and superadmin share the same route

        const res = await axios.get(`https://donatehere-mini-project.onrender.com${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats(res.data.stats);
      } catch (err) {
        console.error("Failed to fetch stats:", err.response || err.message);
      }
    };

    fetchStats();
  }, [role, token]);

  if (!stats) {
    return (
      <div className="p-6 animate-pulse">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {Array(2).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const pieData = {
    labels: ["Pending", "Verified", "Published", "Rejected"],
    datasets: [
      {
        label: "Fundraiser Status",
        data: [
          stats.pendingFundraisers || 0,
          stats.verifiedFundraisers || 0,
          stats.publishedFundraisers || 0,
          stats.rejectedFundraisers || 0,
        ],
        backgroundColor: ["#FBBF24", "#3B82F6", "#10B981", "#EF4444"],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const barData = {
    labels: stats.recentDonations?.map((d) => d.fundraiserTitle) || [],
    datasets: [
      {
        label: "Donation Amount ($)",
        data: stats.recentDonations?.map((d) => d.amount) || [],
        backgroundColor: "#6366F1",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">
      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition">
          <h3 className="text-gray-500 font-medium mb-1">Total Fundraisers</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalFundraisers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition">
          <h3 className="text-gray-500 font-medium mb-1">Total Donations</h3>
          <p className="text-3xl font-bold text-green-600">${stats.totalDonations || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition">
          <h3 className="text-gray-500 font-medium mb-1">Total Users</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalUsers || "-"}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-gray-800 font-semibold text-lg mb-4 flex items-center gap-2">
            📊 Fundraiser Status
          </h3>
          <Pie data={pieData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-gray-800 font-semibold text-lg mb-4 flex items-center gap-2">
            💰 Recent Donations
          </h3>
          <Bar data={barData} />
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
        <h3 className="text-gray-800 font-semibold text-lg mb-4">📝 Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 text-sm">
                <th className="p-3">Fundraiser</th>
                {role !== "user" && <th className="p-3">Donor</th>}
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentDonations?.slice(0, 5).map((d, idx) => (
                <tr
                  key={idx}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium text-gray-800">{d.fundraiserTitle}</td>
                  {role !== "user" && (
                    <td className="p-3 text-gray-600">{d.donorName || "Anonymous"}</td>
                  )}
                  <td className="p-3 text-green-600 font-semibold">${d.amount}</td>
                  <td className="p-3 text-gray-500 text-sm">
                    {new Date(d.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
