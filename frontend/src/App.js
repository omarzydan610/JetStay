import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import AirlineStatisticsPage from "./pages/AirlineStatisticsPage";
import AirlineDashboardPage from "./pages/AirlineDashboardPage";
import FlightsPage from "./pages/FlightsPage";
import PartnershipRequistPage from "./pages/PartnershipRequestPage";
import AirlineProfile from "./pages/ProfilePages/AirlineProfile";
import HotelProfile from "./pages/ProfilePages/HotelProfile";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp"
import RoomTypePage from "./pages/RoomTypePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/air-line" element={<AirlineStatisticsPage />} />
        <Route path="/air-line/:name" element={<AirlineStatisticsPage />} />
        <Route path="/air-line/data" element={<AirlineDashboardPage />} />
        <Route path="/air-line/flights" element={<FlightsPage />} />
        <Route path="/partnership-request" element={<PartnershipRequistPage />} />
        <Route path="/airline/profile" element={<AirlineProfile />} />
        <Route path="/hotel/profile" element={<HotelProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/room-types" element={<RoomTypePage />} />
      </Routes>
    </Router>
  );
}

export default App;
