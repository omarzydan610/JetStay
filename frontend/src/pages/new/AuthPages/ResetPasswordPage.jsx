import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import passwordService from "../../../services/AuthServices/passwordService";
import AuthLayout from "../../../components/new/AuthComponents/AuthLayout";
import PasswordInput from "../../../components/new/AuthComponents/PasswordInput";
import ErrorAlert from "../../../components/new/AuthComponents/ErrorAlert";
import SubmitButton from "../../../components/new/AuthComponents/SubmitButton";

function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const resetToken = location.state?.resetToken || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const validatePassword = (passwordValue) => {
    if (passwordValue.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordValue)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
    }
    return null;
  };

  const validateConfirmPassword = (confirmPasswordValue) => {
    if (confirmPasswordValue !== password) {
      return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate passwords
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);

    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (confirmPasswordError) {
      setError(confirmPasswordError);
      return;
    }

    setLoading(true);

    try {
      const response = await passwordService.resetPassword(
        email,
        resetToken,
        password
      );
      setSuccess(response.data?.message || response.message || "Password reset successfully!");

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/auth");
      }, 500);
    } catch (err) {
      if (err.response) {
        const message = err.response.data?.message || err.response.data?.error;
        if (err.response.status === 400) {
          setError(message || "Invalid or expired reset token.");
        } else if (err.response.status === 404) {
          setError(message || "Reset token not found.");
        } else {
          setError(message || "Failed to reset password. Please try again.");
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

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  if (!email || !resetToken) {
    return (
      <AuthLayout
        formContent={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative p-8 text-center"
          >
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Invalid Access
            </h1>
            <p className="text-gray-600 mb-6">
              Please verify your OTP first to reset your password.
            </p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-sky-600 hover:text-sky-700 font-medium hover:underline focus:outline-none focus:underline"
            >
              Go to Forgot Password
            </button>
          </motion.div>
        }
        maxWidth="max-w-md"
        showLogoSection={false}
      />
    );
  }

  const formContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative"
      style={{
        perspective: "1200px",
        boxShadow: "0 20px 60px -10px rgba(8, 145, 178, 0.3)",
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-cyan-500/5 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <div className="relative p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 text-sm">
            Enter your new password for <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <PasswordInput
            label="New Password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => handleBlur("password")}
            error={error}
            touched={touched.password}
            placeholder="Enter new password"
          />

          <PasswordInput
            label="Confirm New Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onBlur={() => handleBlur("confirmPassword")}
            error={error}
            touched={touched.confirmPassword}
            placeholder="Confirm new password"
          />

          <ErrorAlert message={error} />

          <SubmitButton
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Resetting..."
            text="Reset Password"
          />

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="text-sm text-sky-600 hover:text-sky-700 font-medium hover:underline focus:outline-none focus:underline"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );

  return (
    <AuthLayout
      formContent={formContent}
      maxWidth="max-w-md"
      showLogoSection={false}
    />
  );
}

export default ResetPasswordPage;