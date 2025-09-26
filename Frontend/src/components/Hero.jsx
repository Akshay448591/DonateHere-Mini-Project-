import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleCTA = () => {
    if (isLoggedIn) navigate("/dashboard");
    else navigate("/signup");
  };

  return (
    <section
      className="w-full flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-24"
      style={{ height: "100vh", backgroundColor: "#1f2937" }}
    >
      {/* Hero Content */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white text-center leading-tight">
        <span className="block">Big Impact</span>
        <span className="block text-yellow-400 mt-4">Starts Small</span>
      </h1>

      {/* CTA Button (existing) */}
      <button
        onClick={handleCTA}
        className="mt-10 px-12 py-4 bg-yellow-400 rounded-full font-bold text-black text-lg hover:bg-yellow-500 transition"
      >
        Get Started
      </button>

      {/* Platform Fee */}
      <p className="mt-4 text-sm text-white/80 font-semibold">
        <span className="text-yellow-400">0% platform fee</span> – More money goes directly to causes that matter.
      </p>
    </section>
  );
};

export default Hero;
