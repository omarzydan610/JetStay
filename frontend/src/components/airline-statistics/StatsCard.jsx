import React from "react";

const StatsCard = ({
  title,
  children,
  gradientColors = ["from-white", "to-gray-100"],
}) => {
  return (
    <div
      className={`p-6 rounded-2xl shadow-lg border border-gray-200 
      bg-gradient-to-br ${gradientColors[0]} ${gradientColors[1]} 
      text-gray-800 backdrop-blur-md transition-transform duration-300 
      hover:scale-[1.02] hover:shadow-2xl`}
    >
      {/* Header */}
      <h3 className="text-lg font-semibold mb-4 text-gray-900 tracking-wide border-b border-gray-200 pb-2">
        {title}
      </h3>

      {/* Content */}
      <div className="text-2xl font-bold text-blue-600">{children}</div>
    </div>
  );
};

export default StatsCard;
