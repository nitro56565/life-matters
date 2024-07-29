import React from "react";
import SignIn from "../../components/SignIn";

const AmbulanceSignIn = () => {
  const signInRedirectUrl = "/ambulancesignup";
  return <SignIn redirectUrl={signInRedirectUrl} />;
};

export default AmbulanceSignIn;
