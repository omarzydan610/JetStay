import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import passwordService from "../../services/AuthServices/passwordService";
import AuthLayout from "../../components/AuthComponents/AuthLayout";
import EmailInput from "../../components/AuthComponents/EmailInput";
import SuccessAlert from "../../components/AuthComponents/SuccessAlert";
import ErrorAlert from "../../components/AuthComponents/ErrorAlert";
import SubmitButton from "../../components/AuthComponents/SubmitButton";
import EmailIcon from "../../Icons/EmailIcon";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await passwordService.sendOtpRequest(email);
      if (response.success) {
        navigate("/verify-otp", { state: { email } });
      } else {
        setError(response.message || "Failed to send OTP");
      }
    } catch (err) {
      if (err.response) {
        // Server responded with error
        const message = err.response.data?.message || err.response.data?.error;
        if (err.response.status === 404) {
          setError(
            message || "Email not found. Please check your email address."
          );
        } else if (err.response.status === 400) {
          setError(message || "Invalid email address.");
        } else if (err.response.status === 500) {
          setError(message || "Server error. Please try again later.");
        } else {
          setError(message || "An error occurred. Please try again later.");
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

  const handleBlur = () => {
    setTouched({ ...touched, email: true });
  };

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
            Forgot Password
          </h1>
          <p className="text-gray-600 text-sm">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <EmailInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleBlur}
            error={error}
            touched={touched.email}
            icon={EmailIcon}
            placeholder="your.email@example.com"
            label="Email Address"
          />

          <ErrorAlert message={error} />
          <SuccessAlert message={success} />

          <SubmitButton
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Sending..."
            text="Send Reset Link"
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
