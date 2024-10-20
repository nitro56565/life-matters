import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import TrafficPoliceSignUp from "./pages/signUp/TrafficPoliceSignUp";
import AmbulanceSignIn from "./pages/siginIn/AmbulanceSignIn";
import TrafficPoliceSignIn from "./pages/siginIn/TrafficPoliceSignIn";
import AmbulanceSignUp from "./pages/signUp/AmbulanceSignUp";
import AmbulanceMainPage from "./pages/ambulance-main-page/AmbulanceMainPage";
import TrafficPoliceMainPage from "./pages/trafficPolice-main-page/TrafficPoliceMainPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./components/ForgotPassword";

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/ambulancesignin" element={<AmbulanceSignIn />} />
      <Route path="/ambulancesignup" element={<AmbulanceSignUp />} />
      <Route path="/trafficpolicesignin" element={<TrafficPoliceSignIn />} />
      <Route path="/trafficpolicesignup" element={<TrafficPoliceSignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route
        path="/ambulance-home"
        element={
          <ProtectedRoute redirectPath="/ambulancesignin">
            <AmbulanceMainPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trafficpolice-home"
        element={
          <ProtectedRoute redirectPath="/trafficpolicesignin">
            <TrafficPoliceMainPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default Routing;