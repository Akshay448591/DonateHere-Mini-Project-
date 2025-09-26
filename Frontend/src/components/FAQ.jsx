// components/FAQ.jsx
import React from "react";

const FAQ = () => {
  const faqs = [
    {
      q: "How do I start a fundraiser?",
      a: "Simply sign up, fill in your details, submit for verification, and once approved, your campaign goes live."
    },
    {
      q: "Is there any platform fee?",
      a: "No, we have 0% platform fee. Every rupee you donate goes directly to the cause."
    },
    {
      q: "How long does verification take?",
      a: "Our admin team usually verifies fundraisers within 24 hours for quick approval."
    },
    {
      q: "Can I withdraw funds anytime?",
      a: "Yes, once donations are received, you can withdraw securely to your bank account."
    },
    {
      q: "How do I share my fundraiser?",
      a: "You can easily share via social media, WhatsApp, or direct links from your dashboard."
    }
  ];

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">FAQs</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="border border-gray-300 rounded-lg p-4">
              <summary className="flex items-center cursor-pointer font-semibold">
                <span className="mr-2 text-xl">➕</span> {faq.q}
              </summary>
              <p className="mt-2 text-gray-700">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
