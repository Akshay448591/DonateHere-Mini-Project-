import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateFundraiserStep3 = () => {
  const navigate = useNavigate();
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fundraiserId = localStorage.getItem("fundraiserId");
    if (!fundraiserId) navigate("/create-fundraiser/step1");
  }, [navigate]);

  const handleSubmit = async () => {
    if (!bankName || !accountNumber || !ifsc) {
      toast.error("All fields are required");
      return;
    }

    setSubmitting(true);
    const fundraiserId = localStorage.getItem("fundraiserId");

    try {
      await axios.post(
        "http://localhost:5000/api/fundraisers/step3",
        { fundraiserId, bankName, accountNumber, ifsc },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      toast.success("Fundraiser request submitted!");
      localStorage.removeItem("fundraiserId");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Error submitting account details");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 flex items-center justify-center px-4 py-20">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10 transform transition-transform hover:scale-102">
        <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          Step 3: Account Details
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full px-6 py-4 border-2 border-indigo-200 rounded-2xl focus:ring-2 focus:ring-indigo-400 transition-all"
          />

          <input
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full px-6 py-4 border-2 border-indigo-200 rounded-2xl focus:ring-2 focus:ring-indigo-400 transition-all"
          />

          <input
            type="text"
            placeholder="IFSC"
            value={ifsc}
            onChange={(e) => setIfsc(e.target.value)}
            className="w-full px-6 py-4 border-2 border-indigo-200 rounded-2xl focus:ring-2 focus:ring-indigo-400 transition-all"
          />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-6 mb-4">
          <div
            className={`bg-green-500 h-2 rounded-full transition-all`}
            style={{ width: "100%" }} // Step 3 of 3
          ></div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`w-full bg-green-600 text-white py-3 rounded-2xl font-semibold hover:bg-green-700 transition-all disabled:opacity-50`}
        >
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </div>
  );
};

export default CreateFundraiserStep3;
