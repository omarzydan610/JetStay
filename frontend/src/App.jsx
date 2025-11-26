import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/new/AuthPages/AuthPage";
import PartnerShipRequestPage from "./pages/new/AuthPages/PartnerShipRequestPage";
import ForgotPasswordPage from "./pages/new/AuthPages/ForgotPasswordPage";
import VerifyOtpPage from "./pages/new/AuthPages/VerifyOtpPage";
import ResetPasswordPage from "./pages/new/AuthPages/ResetPasswordPage";
import BaseHomePage from "./pages/new/HomePage/BaseHomePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <BaseHomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/partnership-request"
          element={<PartnerShipRequestPage />}
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
