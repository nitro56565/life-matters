import React from "react";
import SignIn from "../../components/SignIn";

const AmbulanceSignIn = () => {
  return (
    <SignIn
      apiEndpoint="/api/ambulance/signin"  // API endpoint for ambulance login
      redirectUrl="/ambulance-home"        // Redirect to ambulance home page
      signupLink="/ambulancesignup"       // Link to ambulance sign-up page
    />
  );
};

export default AmbulanceSignIn;