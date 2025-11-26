import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const OtpInput = ({
  value,
  onChange,
  onBlur,
  error,
  touched,
  label = "OTP Code",
  placeholder = "000000",
  maxLength = 6,
  className = "",
}) => {
  const [otp, setOtp] = useState(value || "");
  const inputRefs = useRef([]);

  useEffect(() => {
    setOtp(value || "");
  }, [value]);

  const handleChange = (e, index) => {
    const inputValue = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (inputValue.length > 1) return; // Only allow one digit per input

    const newOtp = otp.split("");
    newOtp[index] = inputValue;
    const updatedOtp = newOtp.join("").slice(0, maxLength);
    setOtp(updatedOtp);
    onChange(updatedOtp);

    // Auto-focus next input
    if (inputValue && index < maxLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, maxLength);
    setOtp(pasteData);
    onChange(pasteData);

    // Focus the next empty input or the last input
    const nextIndex =
      pasteData.length < maxLength ? pasteData.length : maxLength - 1;
    inputRefs.current[nextIndex]?.focus();
  };

  const handleFocus = (index) => {
    // Select all text when focusing
    setTimeout(() => {
      inputRefs.current[index]?.select();
    }, 0);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="flex justify-center space-x-2">
        {Array.from({ length: maxLength }, (_, index) => (
          <motion.input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={otp[index] || ""}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            onBlur={onBlur}
            className={`
              w-12 h-14 text-center text-2xl font-bold
              border-2 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
              transition-all duration-200
              ${
                error && touched
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }
              ${className}
            `}
            maxLength={1}
          />
        ))}
      </div>

      {error && touched && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default OtpInput;
