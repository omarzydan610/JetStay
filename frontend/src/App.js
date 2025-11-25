import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import PartnershipRequistPage from "./pages/PartnershipRequestPage";
import AirlineProfile from "./pages/ProfilePages/AirlineProfile";
import HotelProfile from "./pages/ProfilePages/HotelProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/partnership-request" element={<PartnershipRequistPage />} />
        <Route path="/airline/profile" element={<AirlineProfile />} />
        <Route path="/hotel/profile" element={<HotelProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
