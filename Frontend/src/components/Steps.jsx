import React from "react";

const steps = [
  {
    number: 1,
    title: "Login to Your Account",
    desc: "Access your dashboard securely to start your fundraiser."
  },
  {
    number: 2,
    title: "Fill Basic Details",
    desc: "Provide your name, email, and contact info for the fundraiser."
  },
  {
    number: 3,
    title: "Submit Proofs",
    desc: "Upload required documents or verification proofs for trust and safety."
  },
  {
    number: 4,
    title: "Enter Account Details",
    desc: "Provide bank or payment information to receive donations."
  },
  {
    number: 5,
    title: "Request Sent to Admin",
    desc: "Your fundraiser request is sent for verification by our admin team."
  },
  {
    number: 6,
    title: "Admin Accepts Request",
    desc: "Our team verifies the information and approves your fundraiser."
  },
  {
    number: 7,
    title: "Fundraiser is Live",
    desc: "Your campaign is now live and ready to receive donations!"
  }
];

const StepsToStart = () => {
  return (
    <section
      className="w-full px-6 md:px-12 lg:px-24 py-16 bg-gray-50 flex flex-col justify-center"
      style={{ minHeight: "100vh" }}
    >
      {/* Title */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Steps to Start a Fundraiser
        </h2>
        <p className="text-gray-700 mt-2 text-base md:text-lg">
          Follow these simple steps to launch your campaign and start making an impact today.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

        {/* Left Column: Steps */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          {steps.map((step) => (
            <div key={step.number} className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-yellow-400 text-black font-bold rounded-full text-lg">
                {step.number}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{step.title}</h4>
                <p className="text-gray-700 text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Motivational Text */}
        <div className="w-full md:w-1/2 flex flex-col justify-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
          <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
            Start Your Fundraiser Today
          </h3>
          <p className="text-gray-700 text-base mb-2">
            Raising funds is simple and transparent. Follow these steps and join thousands of people making a difference. Every campaign starts with a single click, and your efforts can change lives.
          </p>
          <p className="text-gray-700 text-base">
            From verifying your details to going live, the process is quick and secure. Your support helps you create impact instantly and safely.
          </p>
        </div>

      </div>
    </section>
  );
};

export default StepsToStart;
