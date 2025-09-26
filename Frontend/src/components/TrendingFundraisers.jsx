import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TrendingFundraisers = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/fundraisers/published");
        const sorted = res.data
          .sort((a, b) => (b.amountRaised || 0) - (a.amountRaised || 0))
          .slice(0, 4);
        setFundraisers(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) return <p className="text-center mt-16">Loading trending fundraisers...</p>;

  return (
    <section
      className="w-full px-6 md:px-12 py-16 flex flex-col justify-center"
      style={{ backgroundColor: "#f9fafb" }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
          Trending Fundraisers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {fundraisers.map((item) => {
            const progress = Math.min((item.amountRaised / (item.basicDetails?.target || 1)) * 100, 100);
            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition cursor-pointer"
                onClick={() => navigate(`/fundraiser/${item._id}`)}
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.basicDetails?.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.basicDetails?.description?.slice(0, 60)}...</p>
                  <p className="text-sm text-gray-500 mb-2">Category: {item.basicDetails?.category}</p>

                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Raised: ₹{(item.amountRaised || 0).toLocaleString("en-IN")} / ₹{item.basicDetails?.target?.toLocaleString("en-IN")}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/fundraiser/${item._id}`);
                  }}
                  className="mt-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-full font-semibold text-black transition"
                >
                  Donate Now
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrendingFundraisers;
