import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CategoryPage = () => {
  const { category } = useParams();
  const [fundraisers, setFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/fundraisers/search?query=${category}`);
        setFundraisers(res.data.fundraisers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFundraisers();
  }, [category]);

  if (loading) return <p className="text-center mt-16">Loading fundraisers...</p>;
  if (fundraisers.length === 0) return <p className="text-center mt-16">No fundraisers in this category.</p>;

  return (
    <div className="p-6 mt-16 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">{category} Fundraisers</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fundraisers.map(f => (
          <div
            key={f._id}
            className="border rounded shadow p-4 hover:shadow-lg transition flex flex-col justify-between cursor-pointer"
            onClick={() => navigate(`/fundraiser/${f._id}`)}
          >
            <h3 className="font-semibold text-lg mb-2">{f.basicDetails?.title}</h3>
            <p className="text-gray-600 mb-2">{f.basicDetails?.description?.slice(0, 60)}...</p>
            <p className="text-sm mb-2">Raised: ₹{f.amountRaised} / ₹{f.basicDetails?.target}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
