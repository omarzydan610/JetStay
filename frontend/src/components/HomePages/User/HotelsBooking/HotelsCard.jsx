import { Hotel } from "lucide-react";

export default function HotelsCard({ isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`h-1/2 w-full flex flex-col items-center justify-center transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-br from-sky-600 to-cyan-600"
          : "bg-gradient-to-br from-cyan-50 to-sky-50 hover:from-cyan-100 hover:to-sky-100"
      }`}
    >
      <Hotel
        size={64}
        className={`mb-6 transition-colors ${
          isActive ? "text-white" : "text-cyan-600"
        }`}
      />
      <h2
        className={`text-4xl font-bold text-center mb-4 transition-colors ${
          isActive ? "text-white" : "text-gray-800"
        }`}
      >
        Hotels
      </h2>
      <p
        className={`text-lg text-center max-w-xs transition-colors ${
          isActive ? "text-sky-100" : "text-gray-600"
        }`}
      >
        Discover accommodations at unbeatable rates
      </p>
    </button>
  );
}
