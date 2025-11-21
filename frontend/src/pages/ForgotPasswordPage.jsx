import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/axiosConfig";
import passwordService from "../services/passwordService";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await passwordService.sendOtpRequest(email);
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      if (err.response) {
        // Server responded with error
        if (err.response.status === 404) {
          setError("Email not found. Please check your email address.");
        } else if (err.response.status === 400) {
          setError(err.response.data.message || "Invalid email address.");
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else if (err.request) {
        // Network error
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Forgot Password
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Enter your email"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
