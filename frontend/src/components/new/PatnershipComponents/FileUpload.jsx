import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function FileUpload({
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  label,
  name,
  accept,
  fileName,
  limitText,
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
        <input
          id={name}
          type="file"
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          accept={accept}
          className={`hidden`}
        />
        <div
          className={`${inputBase} ${
            touched && error ? inputError : inputNormal
          } cursor-pointer flex items-center justify-between`}
          onClick={() => document.getElementById(name).click()}
        >
          <span className="text-gray-500">
            {fileName || placeholder || "Choose file..."}
          </span>
          <span className="text-sky-500 text-sm">Browse</span>
        </div>
      </div>
      {limitText && <p className="text-gray-500 text-xs mt-1">{limitText}</p>}
      <AnimatePresence>
        {touched && error && (
          <motion.p
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-red-600 text-xs"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FileUpload;
