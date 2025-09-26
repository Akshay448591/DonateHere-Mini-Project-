import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SectionBreaker from "../components/SectionBreaker";
import SmallGifts from "../components/SmallGifts";
import TrendingFundraisers from "../components/TrendingFundraisers";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import HowItWorks from "../components/HowitWorks";
import Categories from "../components/Categories";
import StepsToStart from "../components/Steps";

const LandingPage = ({ isLoggedIn }) => {
  return (
    <div className="w-full min-h-screen font-sans text-gray-900">
      <Navbar isLoggedIn={isLoggedIn} />
      <Hero isLoggedIn={isLoggedIn} />

      <SectionBreaker
        text="“Give a little change, a lot of impact.”"
        bgGradient="bg-gradient-to-r from-blue-800 via-purple-800 to-blue-900"
      />

      <SmallGifts />
      <SectionBreaker
        text="0% Platform Fee"
        bgGradient="bg-gradient-to-r from-purple-800 via-blue-800 to-purple-900"
      />
      <HowItWorks />
      <TrendingFundraisers />
      <Categories />
      <StepsToStart />
      <FAQ />
      <Footer />
    </div>
  );
};

export default LandingPage;
