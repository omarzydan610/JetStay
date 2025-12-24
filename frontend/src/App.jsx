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
import TicketsDetailsPage from "./pages/HomePage/Admin/TicketsDetailsPage";
import StripePaymentPage from "./pages/payment/stripePaymentPage";
import RoomBookingPage from "./pages/BookingPage/RoomBookingPage";
import PaymentPage from "./pages/PaymentPage/PaymentPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const protectedRoutes = [
    { path: "/", element: <BaseHomePage /> },
    { path: "/profile", element: <BaseProfile /> },
    { path: "/airline/manage-flights", element: <FlightManagementPage /> },
    { path: "/hotel/manage-rooms", element: <HotelManagementPage /> },
    { path: "/admin/booking-details", element: <BookingDetailsPage /> },
    { path: "/admin/tickets-details", element: <TicketsDetailsPage /> },
    { path: "/payment", element: <StripePaymentPage /> },
    { path: "/payment/:bookingTransactionId", element: <PaymentPage /> },
    { path: "/booking", element: <RoomBookingPage /> },
  ];

  const publicRoutes = [
    { path: "/auth", element: <AuthPage /> },
    { path: "/partnership-request", element: <PartnerShipRequestPage /> },
    { path: "/forgot-password", element: <ForgotPasswordPage /> },
    { path: "/verify-otp", element: <VerifyOtpPage /> },
    { path: "/reset-password", element: <ResetPasswordPage /> },
  ];

  return (
    <AppProvider>
      <Router>
        <Routes>
          {protectedRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<ProtectedRoute>{element}</ProtectedRoute>}
            />
          ))}

          {publicRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<PublicRoute>{element}</PublicRoute>}
            />
          ))}
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={2500} />
    </AppProvider>
  );
}

export default App;