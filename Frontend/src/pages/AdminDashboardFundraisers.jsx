import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboardFundraisers = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get("https://donatehere-mini-project.onrender.com/api/fundraisers/pending", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFundraisers(res.data || []); 
      } catch (err) {
        console.error("Error fetching pending fundraisers:", err);
        setFundraisers([]);
        toast.error("Failed to fetch fundraisers");
      }
    };

    fetchPending();
  }, [token]);

  const handleAction = async (id, action) => {
    const confirmMsg =
      action === "verify"
        ? "Are you sure you want to verify this fundraiser?"
        : "Are you sure you want to reject this fundraiser?";

    if (!window.confirm(confirmMsg)) return;

    try {
      const endpoint =
        action === "verify"
          ? "https://donatehere-mini-project.onrender.com/api/fundraisers/verify"
          : "https://donatehere-mini-project.onrender.com/api/fundraisers/reject";

      await axios.post(
        endpoint,
        { fundraiserId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFundraisers((prev) => prev.filter((f) => f._id !== id));
      toast.success(action === "verify" ? "Fundraiser verified!" : "Fundraiser rejected!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Action failed");
    }
  };

  const renderProof = (url, idx) => {
    const extension = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      return (
        <img
          key={idx}
          src={url}
          alt={`Proof ${idx + 1}`}
          className="w-full h-40 object-cover rounded-md shadow-sm"
        />
      );
    } else {
      return (
        <a
          key={idx}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="text-blue-600 underline text-sm block"
        >
          View / Download Proof {idx + 1}
        </a>
      );
    }
  };

  const getProgress = (status) => {
    switch (status) {
      case "pending":
        return 33;
      case "verified":
        return 100;
      case "rejected":
        return 0;
      default:
        return 0;
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-400";
      case "verified":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 p-6 pt-24">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-6 text-indigo-600">Fundraiser Requests</h2>
      {fundraisers.length === 0 && (
        <p className="text-gray-600 text-lg">No pending fundraisers.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fundraisers.map((f) => (
          <div
            key={f._id}
            className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transform transition-transform hover:scale-102 relative"
          >
            <h3 className="font-semibold text-xl text-indigo-700 mb-2">
              {f.basicDetails?.title}
            </h3>
            <p className="text-gray-600 mb-2">{f.basicDetails?.description}</p>
            <p className="text-sm mb-3 font-medium">Category: {f.basicDetails?.category}</p>

            <div className="mb-4">
              <strong className="text-gray-700">Proofs:</strong>
              <div className="flex flex-col gap-2 mt-2">{f.proofs?.map((url, idx) => renderProof(url, idx))}</div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`${getProgressColor(f.status)} h-3`}
                  style={{ width: `${getProgress(f.status)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{f.status.toUpperCase()}</p>
            </div>

            {f.status === "pending" && (
              <div className="flex gap-3 mt-4">
                <button
                  className="flex-1 bg-green-500 text-white py-2 rounded-2xl font-medium hover:bg-green-600 transition-all"
                  onClick={() => handleAction(f._id, "verify")}
                >
                  Verify / Accept
                </button>
                <button
                  className="flex-1 bg-red-500 text-white py-2 rounded-2xl font-medium hover:bg-red-600 transition-all"
                  onClick={() => handleAction(f._id, "reject")}
                >
                  Reject
                </button>
              </div>
            )}

            {f.status === "rejected" && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-2xl">
                Rejected
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardFundraisers;
