import React from "react";

const StatsCard = ({ title, children, gradientColors = ["from-blue-400", "to-blue-600"] }) => {
  return (
    <div
      className={`p-6 shadow-2xl rounded-xl bg-gradient-to-r ${gradientColors[0]} ${gradientColors[1]} text-white animate-pulse-slow`}
    >
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default StatsCard;
