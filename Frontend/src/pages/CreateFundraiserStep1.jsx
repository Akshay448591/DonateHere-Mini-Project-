import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toast styles

const categories = [
  "Medical", "Education", "Community", "Emergency",
  "Animals", "Environment", "Sports", "Others"
];

const CreateFundraiserStep1 = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [target, setTarget] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleNext = async () => {
    if (!title || !description || !category) {
      return toast.error("Title, description, and category are required", {
        position: "top-right", autoClose: 3000, theme: "colored", icon: "⚠️"
      });
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        "https://donatehere-mini-project.onrender.com/api/fundraisers/step1",
        { title, description, category, target: target || undefined },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      localStorage.setItem("fundraiserId", res.data.fundraiser._id);

      toast.success("Step 1 submitted successfully!", {
        position: "top-right", autoClose: 2000, theme: "colored", icon: "✅"
      });

      setTimeout(() => navigate("/create-fundraiser/step2"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error submitting step 1", {
        position: "top-right", autoClose: 3000, theme: "colored", icon: "❌"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Progress calculation (simple)
  const filledFields = [title, description, category, target].filter(Boolean).length;
  const progressWidth = (filledFields / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 flex justify-center items-start py-20 px-4">
      <ToastContainer />
      <div className="w-full max-w-3xl bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-2xl p-10 transform transition-transform hover:scale-102">
        <h2 className="text-3xl font-extrabold text-indigo-600 mb-6 text-center">
          Step 1: Basic Details
        </h2>

        <input
          type="text" placeholder="Title" value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-6 py-4 rounded-2xl border-2 border-indigo-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 mb-4 transition-all shadow-sm"
        />

        <textarea
          placeholder="Description" value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-6 py-4 rounded-2xl border-2 border-indigo-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 mb-4 transition-all shadow-sm resize-none"
          rows={5}
        />

        <div className="mb-4">
          <p className="mb-2 font-medium text-gray-700">Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full transition-all border-2 ${
                  category === cat
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <input
          type="number" placeholder="Target amount (optional)"
          value={target} onChange={(e) => setTarget(e.target.value)}
          className="w-full px-6 py-4 rounded-2xl border-2 border-indigo-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 mb-6 transition-all shadow-sm"
          min="0"
        />

        {/* Progress Bar */}
        <div className="w-full bg-indigo-100 h-3 rounded-full mb-6 overflow-hidden">
          <div
            className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>

        <button
          onClick={handleNext} disabled={submitting}
          className={`w-full py-3 rounded-2xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transform transition-all ${
            submitting ? "opacity-50 cursor-not-allowed scale-100" : "scale-100"
          }`}
        >
          {submitting ? "Submitting..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default CreateFundraiserStep1;
