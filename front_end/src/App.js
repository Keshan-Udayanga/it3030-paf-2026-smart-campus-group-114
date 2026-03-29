import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./userManagement/pages/LoginPage";
import UserDashboard from "./userManagement/pages/UserDashboard";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
