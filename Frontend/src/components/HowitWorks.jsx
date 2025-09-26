import React from "react";

const HowItWorks = () => {
  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-24 bg-gray-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-16">

        {/* Left Column: Steps */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            ✅ How It Works — Start in Minutes
          </h2>
          <ol className="list-decimal list-inside text-gray-900 space-y-6 text-lg">
            <li>
              <strong>Create Your Campaign:</strong> Share your story or cause — who you’re raising funds for and why it matters.
            </li>
            <li>
              <strong>Get Verified by Our Admin Team:</strong> For safety and trust, we quickly verify your details before going live.
            </li>
            <li>
              <strong>Share Your Fundraiser:</strong> Spread the word on social media, WhatsApp, and with your community.
            </li>
            <li>
              <strong>Receive Donations Instantly:</strong> Watch as people from all over chip in to support your cause.
            </li>
            <li>
              <strong>Withdraw Funds Safely:</strong> Easily access your funds when you need them — fully secure and transparent.
            </li>
          </ol>
        </div>

        {/* Right Column: Achievements */}
        <div className="w-full md:w-1/2 bg-white shadow-md rounded-xl p-8 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            🌟 Look What We’ve Achieved Together
          </h2>
          <p className="text-gray-900 text-lg mb-2">
            Real Change, One Small Donation at a Time.
          </p>
          <p className="text-gray-900 text-lg mb-2">
            Thousands of kind-hearted people have come together to make a difference — proving that small amounts, when united, create powerful impact. From funding life-saving treatments to supporting education and local communities, our donors are changing lives every day.
          </p>
          <p className="text-gray-900 text-lg">
            Every coin counts. Every gesture matters. And your support keeps the chain of kindness going.
          </p>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
