import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function PhoneInput({
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder = "1234567890",
  label = "Phone Number",
  name,
  countryCodeName,
  countryCodeValue,
  countryCodeOnChange,
  countryCodeOnBlur,
  countryCodeTouched,
  countryCodeError,
  defaultCountryCode = "+20",
  icon: Icon,
  maxLength = "10",
  countryCodeMaxLength = "5",
}) {
  const inputBase =
    "h-9 px-3 py-1 border rounded-md text-sm outline-none transition-all duration-200 bg-transparent shadow-sm placeholder:text-gray-400";
  const inputNormal =
    "border-gray-300 focus:border-sky-500 focus:ring-sky-500/50 focus:ring-2 hover:border-gray-400";
  const inputError =
    "border-red-500 focus:border-red-500 focus:ring-red-500/20 focus:ring-2";

  const countryCodeInputBase =
    "w-24 h-9 px-3 py-1 border rounded-md text-sm outline-none transition-all duration-200 text-center font-semibold bg-transparent shadow-sm placeholder:text-gray-400";
  const countryCodeNormal =
    "border-gray-300 focus:border-sky-500 focus:ring-sky-500/50 focus:ring-2 hover:border-gray-400";
  const countryCodeErrorClass =
    "border-red-500 focus:border-red-500 focus:ring-red-500/20 focus:ring-2";

  const hasError =
    (touched && error) || (countryCodeTouched && countryCodeError);
  const errorMessage = error || countryCodeError;

  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-900">
        {label}
      </label>
      <div className="flex gap-3">
        <div className="relative">
          {Icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none">
              <Icon />
            </span>
          )}
          <input
            type="text"
            name={countryCodeName}
            value={countryCodeValue || defaultCountryCode}
            onChange={countryCodeOnChange}
            onBlur={countryCodeOnBlur}
            className={`${countryCodeInputBase} ${
              countryCodeTouched && countryCodeError
                ? countryCodeErrorClass
                : countryCodeNormal
            } ${Icon ? "pl-10" : ""} transition-all duration-200`}
            placeholder="+20"
            maxLength={countryCodeMaxLength}
          />
        </div>
        <input
          type="text"
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`flex-1 ${inputBase} ${
            touched && error ? inputError : inputNormal
          } transition-all duration-200`}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      </div>
      <AnimatePresence>
        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-red-600 text-xs overflow-hidden"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PhoneInput;
