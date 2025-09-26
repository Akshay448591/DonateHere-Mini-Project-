import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "react-toastify/dist/ReactToastify.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
console.log("Stripe Key:", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// ------------------ Card Payment Form ------------------
const CheckoutForm = ({ fundraiser, onDonationSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [donationAmount, setDonationAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting donation...");

    const amount = parseFloat(donationAmount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid donation amount");
      return;
    }
    if (!stripe || !elements) {
      console.log("Stripe or Elements not loaded yet");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create PaymentIntent on server
      console.log("Creating PaymentIntent...");
      const { data } = await axios.post(
        "http://localhost:5000/api/fundraisers/create-payment-intent",
        {
          amount,
          fundraiserId: fundraiser._id,
          donorName,
          donorEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      console.log("PaymentIntent response:", data);
      const clientSecret = data.clientSecret;

      // 2️⃣ Confirm Card Payment
      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: donorName || "Anonymous",
            email: donorEmail || "Anonymous",
          },
        },
      });

      console.log("PaymentResult:", paymentResult);

      if (paymentResult.error) {
        toast.error(paymentResult.error.message);
        setLoading(false);
        return;
      }

      if (paymentResult.paymentIntent.status === "succeeded") {
        toast.success("Donation successful!");
        console.log("Donation succeeded, updating DB...");

        // Update fundraiser donations in DB
        await axios.post(
          "http://localhost:5000/api/fundraisers/donate",
          {
            fundraiserId: fundraiser._id,
            amount,
            donorName: donorName || "Anonymous",
            donorEmail: donorEmail || "Anonymous",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );

        onDonationSuccess(amount, donorName || "Anonymous");
        setDonationAmount("");
        setDonorName("");
        setDonorEmail("");
      }
    } catch (err) {
      console.error("Error during payment:", err);
      toast.error(err.response?.data?.msg || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="number"
        placeholder="Amount (USD)"
        value={donationAmount}
        onChange={(e) => setDonationAmount(e.target.value)}
        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <input
        type="text"
        placeholder="Your Name (Optional)"
        value={donorName}
        onChange={(e) => setDonorName(e.target.value)}
        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <input
        type="email"
        placeholder="Your Email (Optional)"
        value={donorEmail}
        onChange={(e) => setDonorEmail(e.target.value)}
        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <div className="border p-3 rounded-lg">
        <CardElement />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 text-white px-5 py-3 rounded-lg hover:bg-green-600 w-full font-medium transition"
      >
        {loading ? "Processing..." : "Pay with Card"}
      </button>
    </form>
  );
};

// ------------------ Fundraiser Page ------------------
const FundraiserPage = () => {
  const { id } = useParams();
  const [fundraiser, setFundraiser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching fundraiser with id:", id);
    const fetchFundraiser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/fundraisers/published/${id}`
        );
        console.log("Fetched fundraiser:", res.data);
        setFundraiser(res.data);
      } catch (err) {
        console.error("Fetch fundraiser error:", err);
        toast.error("Failed to fetch fundraiser");
      } finally {
        setLoading(false);
      }
    };
    fetchFundraiser();
  }, [id]);

  const handleDonationSuccess = (amount, donor) => {
    console.log("Donation success:", amount, donor);
    setFundraiser((prev) => ({
      ...prev,
      amountRaised: prev.amountRaised + amount,
      donations: [
        ...(prev.donations || []),
        { amount, donor, donatedAt: new Date().toISOString() },
      ],
    }));
  };

  if (loading)
    return (
      <div className="p-6 mt-16 text-center animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
        <div className="h-64 bg-gray-100 rounded shadow mx-auto max-w-3xl"></div>
      </div>
    );

  if (!fundraiser) return <p className="text-center mt-16">Fundraiser not found.</p>;

  const progress = Math.min(
    (fundraiser.amountRaised / (fundraiser.basicDetails.target || 1)) * 100,
    100
  );

  return (
    <div className="p-6 mt-16 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-extrabold mb-4 text-gray-800">
        {fundraiser.basicDetails.title}
      </h2>
      <p className="text-gray-600 mb-2">{fundraiser.basicDetails.description}</p>
      <p className="text-sm mb-2 text-gray-500 font-medium">
        Category: {fundraiser.basicDetails.category}
      </p>
      <p className="text-sm mb-4 text-gray-500 font-medium">
        Raised: <span className="text-green-600 font-semibold">${fundraiser.amountRaised}</span> / $
        {fundraiser.basicDetails.target}
      </p>

      <div className="w-full bg-gray-200 h-4 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {fundraiser.proofs?.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-gray-700">Proofs</h4>
          <div className="flex flex-wrap gap-3">
            {fundraiser.proofs.map((proof, idx) => {
              const isPdf = proof.toLowerCase().endsWith(".pdf");
              return isPdf ? (
                <a
                  key={idx}
                  href={proof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  View PDF {idx + 1}
                </a>
              ) : (
                <img
                  key={idx}
                  src={proof}
                  alt={`Proof ${idx + 1}`}
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-6 border-t pt-5">
        <h3 className="text-xl font-bold mb-3 text-gray-800">Donate Now</h3>
        <Elements stripe={stripePromise}>
          <CheckoutForm fundraiser={fundraiser} onDonationSuccess={handleDonationSuccess} />
        </Elements>
      </div>

      {fundraiser.donations?.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold mb-3 text-gray-700">Recent Donations</h4>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {fundraiser.donations.slice(-10).reverse().map((d, idx) => (
              <li key={idx} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition">
                <span className="font-medium text-gray-800">{d.donor}</span>
                <span className="text-gray-600">${d.amount}</span>
                <span className="text-gray-400 text-xs">
                  {new Date(d.donatedAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FundraiserPage;
