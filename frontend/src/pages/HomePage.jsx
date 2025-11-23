import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (location.state?.passwordChanged) {
      setShowAlert(true);
      setCountdown(5);
      // Clear the navigation state to prevent alert on reload
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (showAlert && countdown === 5) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 100);
      return () => clearTimeout(timer);
    } else if (showAlert && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showAlert && countdown === 0) {
      setShowAlert(false);
    }
  }, [showAlert, countdown]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Alert at top right corner */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 flex items-center space-x-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="font-medium">
                Password has been changed successfully!
              </span>
              <button
                onClick={() => setShowAlert(false)}
                className="ml-4 text-white hover:text-gray-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="w-full bg-green-500 h-1 overflow-hidden ">
              <div
                className="bg-green-600 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${((countdown - 1) / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Page content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to JetStay
        </h1>
        <p className="text-gray-600">Your home page content goes here...</p>
      </div>
    </div>
  );
}

export default HomePage;
