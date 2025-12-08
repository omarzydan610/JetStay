import React from "react";

function FormHeader({
  text = "Create your account to start your journey",
  className = "",
}) {
  return (
    <h2 className={`text-xl font-semibold text-slate-900 mb-3 ${className}`}>
      {text}
    </h2>
  );
}

export default FormHeader;

