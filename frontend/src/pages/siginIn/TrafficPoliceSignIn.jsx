import React from "react";
import SignIn from "../../components/SignIn";

const TrafficPoliceSignIn = () => {
  const signInRedirect = "/trafficpolicesignup";
  return <SignIn redirectUrl={signInRedirect} />;
};

export default TrafficPoliceSignIn
