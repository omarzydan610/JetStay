import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import AirlineStatisticsPage from "./pages/AirlineStatisticsPage";
import AirlineDashboardPage from "./pages/AirlineDashboardPage";
import FlightsPage from "./pages/FlightsPage";

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
      </Routes>
    </Router>
  );
}

export default App;
