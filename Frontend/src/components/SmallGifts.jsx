import React from "react";
import { useNavigate } from "react-router-dom";

const SmallGifts = () => {
  const navigate = useNavigate();

  const handleDonateClick = () => {
    // Navigate to the published fundraisers / donation page
    navigate("/fundraisers/published");
  };

  return (
    <section
      className="flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-24 pt-20"
      style={{ height: "100vh", backgroundColor: "#f9fafb" }}
    >
      {/* Headline */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-snug">
        Even Small Gifts Make a Difference
      </h2>

      {/* Donate Button */}
      <button
        onClick={handleDonateClick}
        className="mt-10 px-12 py-4 bg-yellow-400 rounded-full font-bold text-black text-lg hover:bg-yellow-500 transition"
      >
        Donate Here
      </button>

      {/* Platform Fee */}
      <p className="mt-4 text-sm text-gray-700 font-semibold">
        <span className="text-yellow-400">0% platform fee</span> – More money goes directly to causes that matter.
      </p>
    </section>
  );
};

export default SmallGifts;
