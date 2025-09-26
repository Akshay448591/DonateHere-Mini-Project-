import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SuperAdminPublishedFundraisers = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch all published fundraisers
  useEffect(() => {
    const fetchPublished = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/fundraisers/published", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFundraisers(res.data);
      } catch (err) {
        console.error("Failed to fetch published fundraisers:", err);
        toast.error("Failed to fetch published fundraisers");
      } finally {
        setLoading(false);
      }
    };

    fetchPublished();
  }, [token]);

  // Delete a fundraiser
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fundraiser?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/fundraisers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFundraisers((prev) => prev.filter((f) => f._id !== id));
      toast.success("Fundraiser deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to delete fundraiser");
    }
  };

  if (loading) {
    return (
      <div className="p-6 animate-pulse text-center">
        <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-60 bg-gray-200 rounded shadow animate-pulse"></div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-16 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Published Fundraisers</h2>

      {fundraisers.length === 0 && (
        <p className="text-gray-500">No published fundraisers available.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fundraisers.map((f) => (
          <div
            key={f._id}
            className="p-6 bg-white rounded-2xl shadow-xl transform transition-transform hover:scale-102 hover:shadow-2xl relative"
          >
            <h3 className="font-semibold text-xl mb-2">{f.basicDetails?.title}</h3>
            <p className="text-gray-600 mb-2">{f.basicDetails?.description}</p>
            <p className="text-sm mb-2">Category: {f.basicDetails?.category}</p>
            <p className="text-sm mb-4">Created by: {f.creator?.email || "Unknown"}</p>

            <div className="mb-4">
              <strong>Proofs:</strong>
              <div className="flex flex-col gap-2 mt-2">
                {f.proofs?.map((url, idx) => {
                  const isPdf = url.toLowerCase().endsWith(".pdf");
                  return isPdf ? (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm block"
                    >
                      View PDF {idx + 1}
                    </a>
                  ) : (
                    <img
                      key={idx}
                      src={url}
                      alt={`Proof ${idx + 1}`}
                      className="w-full h-40 object-cover rounded"
                    />
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => handleDelete(f._id)}
              className="w-full bg-red-500 text-white py-3 rounded-2xl font-semibold hover:bg-red-600 transition-all"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminPublishedFundraisers;
