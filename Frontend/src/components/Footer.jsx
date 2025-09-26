// components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-3 text-white">DonateHere</h3>
          <p className="text-sm">Making a difference one small donation at a time.</p>
        </div>
        <div>
          <h3 className="font-bold mb-3 text-white">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li>Trending</li>
            <li>Categories</li>
            <li>Start a Fundraiser</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-3 text-white">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>Help Center</li>
            <li>FAQs</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-3 text-white">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} DonateHere. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
