import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function TextInput({
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  label,
  name,
  icon: Icon,
  type = "text",
}) {
  const inputBase =
    "w-full h-9 px-3 py-1 border rounded-md text-sm outline-none transition-all duration-200 bg-transparent shadow-sm placeholder:text-gray-400";
  const inputNormal =
    "border-gray-300 focus:border-sky-500 focus:ring-sky-500/50 focus:ring-2 hover:border-gray-400";
  const inputError =
    "border-red-500 focus:border-red-500 focus:ring-red-500/20 focus:ring-2";

  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-900">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none">
            <Icon />
          </span>
        )}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`${inputBase} ${Icon ? "pl-10" : ""} ${
            touched && error ? inputError : inputNormal
          } transition-all duration-200`}
          placeholder={placeholder}
          maxLength={150}
        />
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

export default TextInput;
