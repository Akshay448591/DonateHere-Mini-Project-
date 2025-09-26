import React, { useEffect, useState } from "react";
import axios from "axios";

const FundraiserDashboard = () => {
  const [fundraisers, setFundraisers] = useState([]);

  useEffect(() => {
    const fetchFundraisers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("/api/fundraisers/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFundraisers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFundraisers();
  }, []);

  return (
    <div className="p-6 mt-16">
      <h2 className="text-2xl font-bold mb-4">My Fundraisers</h2>
      {fundraisers.length === 0 && <p>No fundraisers created yet.</p>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fundraisers.map((f) => (
          <div key={f._id} className="p-4 border rounded shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg">{f.title}</h3>
            <p className="text-gray-600">{f.description}</p>
            <p className="mt-2 text-sm text-gray-500">Status: {f.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FundraiserDashboard;
