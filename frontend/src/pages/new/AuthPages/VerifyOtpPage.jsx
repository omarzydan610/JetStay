import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import passwordService from "../../../services/AuthServices/passwordService";
import AuthLayout from "../../../components/new/AuthComponents/AuthLayout";
import OtpInput from "../../../components/new/AuthComponents/OtpInput";
import ErrorAlert from "../../../components/new/AuthComponents/ErrorAlert";
import SubmitButton from "../../../components/new/AuthComponents/SubmitButton";

function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

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

    // Validate OTP
    const otpError = validateOtp(otp);
    if (otpError) {
      setError(otpError);
      return;
    }

    setLoading(true);

    try {
      const response = await passwordService.verifyOtp(email, otp);
      if (response.data?.resetToken) {
        // Navigate to password change page with the reset token
        navigate("/reset-password", {
          state: {
            email,
            resetToken: response.data.resetToken,
          },
        });
      } else {
        setError(
          response.data?.message || response.message || "Failed to verify OTP"
        );
      }
    } catch (err) {
      if (err.response) {
        const message = err.response.data?.message || err.response.data?.error;
        if (err.response.status === 400) {
          setError(message || "Invalid OTP.");
        } else if (err.response.status === 404) {
          setError(
            message || "OTP not found or expired. Please request a new one."
          );
        } else {
          setError(message || "An error occurred. Please try again.");
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

  const handleBlur = () => {
    setTouched({ ...touched, otp: true });
  };

  if (!email) {
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
              Please request a password reset from the forgot password page.
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
            Verify OTP
          </h1>
          <p className="text-gray-600 text-sm">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <OtpInput
            label="OTP Code"
            value={otp}
            onChange={setOtp}
            onBlur={handleBlur}
            error={error}
            touched={touched.otp}
          />

          <ErrorAlert message={error} />

          <SubmitButton
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Verifying..."
            text="Verify OTP"
          />

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-sky-600 hover:text-sky-700 font-medium hover:underline focus:outline-none focus:underline"
            >
              Request New OTP
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

export default VerifyOtpPage;
