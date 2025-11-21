import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import passwordService from "../services/passwordService";

function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    if (!hasLetter || !hasDigit) {
      return "Password must contain both letters and digits.";
    }
    return null;
  };

  const validateOtp = (otpValue) => {
    if (otpValue.length !== 6) {
      return "OTP must be 6 digits.";
    }
    if (!/^\d{6}$/.test(otpValue)) {
      return "OTP must contain only digits.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate OTP
    const otpError = validateOtp(otp);
    if (otpError) {
      setError(otpError);
      return;
    }

    // Validate password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await passwordService.verifyOtpAndResetPassword(
        email,
        otp,
        newPassword
      );
      if (response.success) {
        setSuccess("Password reset successfully! Redirecting...");
        navigate("/", { state: { passwordChanged: true } });
      } else {
        setError(response.message || "Failed to reset password");
      }
    } catch (err) {
      if (err.response) {
        const message = err.response.data?.message || err.response.data?.error;
        if (err.response.status === 400) {
          setError(message || "Invalid OTP or request.");
        } else if (err.response.status === 404) {
          setError(
            message || "OTP not found or expired. Please request a new one."
          );
        } else if (err.response.status === 500) {
          setError(message || "Server error. Please try again later.");
        } else {
          setError(message || "An error occurred. Please try again later.");
        }
      } else if (err.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Invalid Access
          </h1>
          <p className="text-gray-600 mb-6">
            Please request a password reset from the forgot password page.
          </p>
          <a
            href="/forgot-password"
            className="text-blue-600 hover:text-blue-800"
          >
            Go to Forgot Password
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Reset Password
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Enter the OTP sent to <strong>{email}</strong> and your new password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="otp"
              className="block text-gray-700 font-medium mb-2"
            >
              OTP (6 digits)
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={handleOtpChange}
              required
              disabled={loading}
              maxLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-center text-2xl tracking-widest"
              placeholder="000000"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-gray-700 font-medium mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Enter new password"
            />
            <p className="text-xs text-gray-500 mt-1">
              At least 8 characters with letters and digits
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Confirm new password"
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/forgot-password"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Request New OTP
          </a>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
