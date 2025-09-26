import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateFundraiserStep2 = () => {
  const navigate = useNavigate();
  const [proofs, setProofs] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fundraiserId = localStorage.getItem("fundraiserId");
    if (!fundraiserId) navigate("/create-fundraiser/step1");
  }, [navigate]);

  const handleFileChange = (e) => setProofs([...e.target.files]);

  const handleNext = async () => {
    if (proofs.length === 0) {
      toast.error("Select at least one proof");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    const fundraiserId = localStorage.getItem("fundraiserId");
    proofs.forEach((file) => formData.append("proofs", file));
    formData.append("fundraiserId", fundraiserId);

    try {
      await axios.post("https://donatehere-mini-project.onrender.com/api/fundraisers/step2", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Proofs uploaded successfully!");
      setTimeout(() => navigate("/create-fundraiser/step3"), 1200);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Error uploading proofs");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 flex items-center justify-center px-4 py-20">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10 transform transition-transform hover:scale-102">
        <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          Step 2: Upload Proofs
        </h2>

        <div className="space-y-4">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full px-6 py-4 border-2 border-indigo-200 rounded-2xl focus:ring-2 focus:ring-indigo-400 transition-all"
          />

          {proofs.length > 0 && (
            <div className="text-gray-600 text-sm">
              Selected files: {proofs.map((file) => file.name).join(", ")}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-6 mb-4">
          <div
            className={`bg-blue-500 h-2 rounded-full transition-all`}
            style={{ width: "66%" }} // Step 2 of 3
          ></div>
        </div>

        <button
          onClick={handleNext}
          disabled={uploading}
          className={`w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50`}
        >
          {uploading ? "Uploading..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default CreateFundraiserStep2;
