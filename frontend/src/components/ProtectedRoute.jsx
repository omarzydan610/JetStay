import React from "react";
import { Navigate } from "react-router-dom";
import authService from "../services/AuthServices/authService";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;