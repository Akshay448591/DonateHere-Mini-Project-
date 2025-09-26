import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  "Medical",
  "Education",
  "Community",
  "Emergency",
  "Animals",
  "Environment",
  "Sports",
  "Others"
];

const Categories = () => {
  const navigate = useNavigate();

  const handleClick = (cat) => {
    navigate(`/categories/${cat}`);
  };

  return (
    <section
      className="w-full px-6 md:px-12 lg:px-24 flex flex-col justify-center bg-gray-100"
      style={{ minHeight: "100vh" }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900">
          Explore Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 flex items-center justify-center shadow-md hover:shadow-lg transition cursor-pointer font-semibold text-gray-800 text-lg"
              onClick={() => handleClick(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
