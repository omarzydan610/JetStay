import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import AuthPage from "./pages/new/AuthPages/AuthPage";
import PartnerShipRequestPage from "./pages/new/AuthPages/PartnerShipRequestPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/partnership-request" element={<PartnerShipRequestPage  />} />
      </Routes>
    </Router>
  );
}

export default App;
