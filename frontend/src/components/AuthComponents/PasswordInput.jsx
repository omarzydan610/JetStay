import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function PasswordInput({
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder = "Enter your password",
  label = "Password",
  name = "password",
  icon: Icon,
  showIcon: ShowIcon,
  hideIcon: HideIcon,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputBase =
    "w-full h-9 px-3 py-1 border rounded-md text-sm outline-none transition-all duration-200 bg-transparent shadow-sm placeholder:text-gray-400";
  const inputNormal =
    "border-gray-300 focus:border-sky-500 focus:ring-sky-500/50 focus:ring-2 hover:border-gray-400";
  const inputError =
    "border-red-500 focus:border-red-500 focus:ring-red-500/20 focus:ring-2";

  const inputId = name || "password";
  const autoCompleteValue =
    name === "confirmPassword"
      ? "new-password"
      : name === "password"
      ? "new-password"
      : "current-password";

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-900">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none">
            <Icon />
          </span>
        )}
        <input
          id={inputId}
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`${inputBase} ${Icon ? "pl-10" : ""} pr-10 ${
            touched && error ? inputError : inputNormal
          } transition-all duration-200`}
          placeholder={placeholder}
          autoComplete={autoCompleteValue}
          maxLength={150}
        />
        {(ShowIcon || HideIcon) && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 rounded"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword
              ? ShowIcon && <ShowIcon className="w-4 h-4" />
              : HideIcon && <HideIcon className="w-4 h-4" />}
          </button>
        )}
      </div>
      <AnimatePresence>
        {touched && error && (
          <motion.p
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-red-600 text-xs overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PasswordInput;
