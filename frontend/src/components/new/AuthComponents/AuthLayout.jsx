import React from "react";
import BackgroundDecorations from "./BackgroundDecorations";

function AuthLayout({
  logoSection,
  formContent,
  maxWidth = "max-w-md",
  showLogoSection = false,
}) {
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 flex flex-col">
      <BackgroundDecorations />

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-4">
        <div className={`w-full ${maxWidth}`}>{formContent}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
