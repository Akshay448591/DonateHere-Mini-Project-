import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PublishedFundraisers = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFundraiser, setSelectedFundraiser] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/fundraisers/published");
        setFundraisers(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch fundraisers");
      } finally {
        setLoading(false);
      }
    };

    fetchFundraisers();
  }, []);

  const openModal = (fundraiser) => {
    setSelectedFundraiser(fundraiser);
    setDonationAmount("");
    setDonorName("");
    setDonorEmail("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedFundraiser(null);
  };

  const handleDonate = async () => {
    const amount = parseFloat(donationAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error("Enter a valid donation amount");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(
        "http://localhost:5000/api/fundraisers/donate",
        {
          fundraiserId: selectedFundraiser._id,
          amount,
          donorName: donorName || "Anonymous",
          donorEmail: donorEmail || "Anonymous",
        },
        { headers }
      );

      toast.success(res.data.msg);

      setFundraisers(prev =>
        prev.map(f =>
          f._id === selectedFundraiser._id
            ? {
                ...f,
                amountRaised: f.amountRaised + amount,
                donations: [
                  ...(f.donations || []),
                  { amount, donor: donorName || "Anonymous", donatedAt: new Date().toISOString() },
                ],
              }
            : f
        )
      );

      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Donation failed");
    }
  };

  if (loading)
    return (
      <div className="p-6 mt-16 text-center animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-6"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded shadow p-4 h-64 bg-gray-100"></div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="p-6 mt-16 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Support Fundraisers</h2>

      {fundraisers.length === 0 && (
        <p className="text-center text-gray-600">No fundraisers available at the moment.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fundraisers.map(f => {
          const progress = Math.min((f.amountRaised / (f.basicDetails.target || 1)) * 100, 100);
          return (
            <div
              key={f._id}
              className="border rounded shadow p-4 hover:shadow-lg transition flex flex-col justify-between cursor-pointer bg-white"
              onClick={() => navigate(`/fundraiser/${f._id}`)}
            >
              <div>
                <h3 className="font-semibold text-lg mb-2">{f.basicDetails?.title}</h3>
                <p className="text-gray-600 mb-2 line-clamp-3">{f.basicDetails?.description}</p>
                <p className="text-sm mb-2 font-medium text-gray-700">Category: {f.basicDetails?.category}</p>
                <p className="text-sm mb-2 font-medium text-gray-700">
                  Raised: ${f.amountRaised} / ${f.basicDetails?.target}
                </p>

                <div className="w-full bg-gray-200 h-3 rounded-full mb-2 overflow-hidden">
                  <div className="bg-green-500 h-3 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                </div>

                {f.proofs?.length > 0 && (
                  <a
                    href={f.proofs[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm mb-2 inline-block"
                    onClick={e => e.stopPropagation()}
                  >
                    View Proof
                  </a>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(f);
                }}
                className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full transition font-medium"
              >
                Donate
              </button>

              {f.donations?.length > 0 && (
                <div className="mt-4 border-t pt-2 max-h-32 overflow-y-auto">
                  <h4 className="font-semibold mb-2 text-gray-700">Recent Donations</h4>
                  <ul className="text-sm space-y-1">
                    {f.donations.slice(-5).reverse().map((d, idx) => (
                      <li key={idx} className="text-gray-800">
                        <span className="font-medium">{d.donor}</span>: ${d.amount}{" "}
                        <span className="text-gray-400 text-xs">
                          ({new Date(d.donatedAt).toLocaleString()})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {modalOpen && selectedFundraiser && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Donate to: {selectedFundraiser.basicDetails.title}</h3>
            <input
              type="number"
              placeholder="Amount (USD)"
              value={donationAmount}
              onChange={e => setDonationAmount(e.target.value)}
              className="w-full border rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="Your Name (Optional)"
              value={donorName}
              onChange={e => setDonorName(e.target.value)}
              className="w-full border rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              placeholder="Your Email (Optional)"
              value={donorEmail}
              onChange={e => setDonorEmail(e.target.value)}
              className="w-full border rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleDonate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-medium transition"
              >
                Donate
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishedFundraisers;
