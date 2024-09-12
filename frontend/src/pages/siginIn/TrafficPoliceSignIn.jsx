import React from "react";
import SignIn from "../../components/SignIn";

const TrafficPoliceSignIn = () => {
  return (
    <SignIn
      apiEndpoint="/api/trafficpolice/signin"  // API endpoint for traffic police login
      redirectUrl="/trafficpolice-home"        // Redirect to traffic police home page
      signupLink="/trafficpolicesignup"       // Link to traffic police sign-up page
    />
  );
};

export default TrafficPoliceSignIn;