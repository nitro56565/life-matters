import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonPage,
  IonText,
} from "@ionic/react";
import "./SignIn.css";
interface SignInProps {
  apiEndpoint: string;
  redirectUrl: string;
  signupLink: string;
}

const SignIn: React.FC<SignInProps> = ({
  apiEndpoint,
  redirectUrl,
  signupLink,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const history = useHistory();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Check if user is already logged in on component mount
  useEffect(() => {
    // const token = localStorage.getItem("authToken");
    // const userType = localStorage.getItem("userType");

    // if (token && userType) {
    //   if (userType === "ambulance") {
    //     history.push("/ambulance-home");
    //   } else if (userType === "traffic-police") {
    //     history.push("/trafficpolice-home");
    //   }
    // }
  }, [history]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const attemptSignIn = async () => {
    console.log("Form Data:", formData);

    const apiUrl = `${BACKEND_URL}${apiEndpoint}`;

    try {
      const response = await axios.post(apiUrl, formData);

      if (response.status === 200) {
        const { token, userType } = response.data;

        // Store the token and user type in localStorage
        // localStorage.setItem("authToken", token);
        // localStorage.setItem("userType", userType);

        setSuccessMessage("Sign-in successful! Redirecting...");
        setTimeout(() => {
          // Redirect to the appropriate dashboard
          if (userType === "ambulance") {
            history.push("/ambulance-home");
          } else if (userType === "traffic-police") {
            history.push("/trafficpolice-home");
          }
        }, 2000);
        return true;
      } else {
        setErrorMessage(
          response.data.message || "Sign-in failed. Please try again."
        );
        return false;
      }
    } catch (err) {
      console.error("Error during sign-in:", err);
      setErrorMessage("An error occurred during sign-in. Please try again.");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Capture the latest state of formData before sign-in attempt
    const { phone, password } = formData;
    console.log("Form Data before sending:", { phone, password });

    // Attempt sign-in
    const signInSuccessful = await attemptSignIn();

    if (!signInSuccessful) {
      setErrorMessage("Sign-in failed. Please try again.");
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="signin-container">
          <div className="signin-card">
            <div className="signin-header">
              <h1>Sign In</h1>
            </div>
            {errorMessage && <IonText color="danger">{errorMessage}</IonText>}
            {successMessage && (
              <IonText color="success">{successMessage}</IonText>
            )}
            <form onSubmit={handleSubmit}>
              <IonItem className="signin-item">
                <IonInput
                  label="Enter your phone number"
                  labelPlacement="floating"
                  type="number"
                  class="signin-input phone-input"
                  name="phone"
                  value={formData.phone}
                  onIonChange={handleChange}
                  required
                ></IonInput>
              </IonItem>
              <IonItem className="signin-item">
                <IonInput
                  label="Enter your password"
                  labelPlacement="floating"
                  class="signin-input password-input"
                  // type={showPassword ? "text" : "password"}
                  type="password"
                  name="password"
                  value={formData.password}
                  onIonChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FiEye /> : <FiEyeOff />}
                </button>
              </IonItem>
              <div className="forgot-password">
                <a href="/forgot-password">Forgot password?</a>
              </div>
              <IonButton type="submit" expand="block" className="signin-button">
                Sign In
              </IonButton>
              <p className="signup-link">
                Don’t have an account? <a href={signupLink}>Sign up</a>
              </p>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
