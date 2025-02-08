import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import LandingPage from "./pages/Landing/LandingPage";
import CrimeReport from "./pages/main/citizen/CrimeReport";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Main from "./pages/main/policeman/Main";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route path="/report" element={<CrimeReport />} />
        <Route path="/main/*" element={<Main />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
