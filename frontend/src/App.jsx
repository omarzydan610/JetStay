import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import AuthPage from "./pages/AuthPages/AuthPage";
import PartnerShipRequestPage from "./pages/AuthPages/PartnerShipRequestPage";
import ForgotPasswordPage from "./pages/AuthPages/ForgotPasswordPage";
import VerifyOtpPage from "./pages/AuthPages/VerifyOtpPage";
import ResetPasswordPage from "./pages/AuthPages/ResetPasswordPage";
import BaseHomePage from "./pages/HomePage/BaseHomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import BaseProfile from "./pages/Profiles/BaseProfile";
import FlightManagementPage from "./pages/HomePage/Airline/FlightManagementPage";
import HotelManagementPage from "./pages/HomePage/Hotel/HotelManagementPage";
import BookingDetailsPage from "./pages/HomePage/Admin/BookingDetailsPage";
import StripePaymentPage from "./pages/payment/stripePaymentPage";
import TicketsDetailsPage from "./pages/HomePage/Admin/TicketsDetailsPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AppProvider>
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
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />
          <Route
            path="/partnership-request"
            element={
              <PublicRoute>
                <PartnerShipRequestPage />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <PublicRoute>
                <VerifyOtpPage />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <BaseProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/airline/manage-flights"
            element={
              <ProtectedRoute>
                <FlightManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotel/manage-rooms"
            element={
              <ProtectedRoute>
                <HotelManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/booking-details"
            element={
              <ProtectedRoute>
                <BookingDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tickets-details"
            element={
              <ProtectedRoute>
                <TicketsDetailsPage />
              </ProtectedRoute>
            }
          />
                    <Route
            path="/payment/flights"
            element={
              <ProtectedRoute>
                <StripePaymentPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={2500} />
    </AppProvider>
  );
}

export default App;
