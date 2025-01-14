import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { useIonRouter } from "@ionic/react";
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
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);
  const [isFormValid, setIsFormValid] = useState(true); // Track form validation
  const router = useIonRouter();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!BACKEND_URL) {
      console.error("BACKEND_URL is not defined in the environment variables.");
      return;
    }

    const token = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType");
    const userName = localStorage.getItem("name");

    if (token && userType && userName) {
      router.push(redirectUrl, "root", "replace");
    }
  }, [router, redirectUrl]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validatePhone = (phone: string) => {
    // Validate phone: Should be exactly 10 digits and contain only numbers
    return /^\d{10}$/.test(phone);
  };

  const attemptSignIn = async () => {
    if (!BACKEND_URL) return;

    try {
      const apiUrl = `${BACKEND_URL}${apiEndpoint}`;
      const response = await axios.post(apiUrl, { phone, password });

      if (response.status === 200) {
        const { token, userType, name } = response.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("userType", userType);
        localStorage.setItem("name", name);

        setMessage({
          text: "Sign-in successful! Redirecting...",
          type: "success",
        });
        setTimeout(() => {
          router.push(redirectUrl, "root", "replace");
        }, 2000);
      } else {
        setMessage({
          text: response.data.message || "Sign-in failed. Please try again.",
          type: "error",
        });
      }
    } catch {
      setMessage({
        text: "An error occurred during sign-in. Please try again.",
        type: "error",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    // console.log(phone, password);

    // Validate phone number and password
    if (!validatePhone(phone)) {
      setIsFormValid(false);
      setMessage({
        text: "Please enter a valid 10-digit phone number.",
        type: "error",
      });
      return;
    }

    if (!password) {
      setIsFormValid(false);
      setMessage({
        text: "Password is required.",
        type: "error",
      });
      return;
    }

    setIsFormValid(true);
    await attemptSignIn();
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="signin-container">
          <div className="signin-card">
            <div className="signin-header">
              <h1>Sign In</h1>
            </div>
            {message && (
              <IonText
                color={message.type === "success" ? "success" : "danger"}
              >
                {message.text}
              </IonText>
            )}
            <form onSubmit={handleSubmit}>
              <IonItem className="signin-item">
                <IonInput
                  label="Phone Number"
                  labelPlacement="floating"
                  type="number"
                  className="signin-input phone-input"
                  name="phone"
                  value={phone}
                  onIonInput={(e) => {
                    const newPhone = (
                      e.target as unknown as HTMLInputElement
                    ).value.replace(/\D/g, "");
                    if (newPhone.length <= 10) setPhone(newPhone);
                  }}
                  required
                />
              </IonItem>
              <IonItem className="signin-item">
                <IonInput
                  label="Password"
                  labelPlacement="floating"
                  type={showPassword ? "text" : "password"}
                  className="signin-input"
                  value={password}
                  onIonInput={(e) =>
                    setPassword((e.target as unknown as HTMLInputElement).value)
                  }
                  required
                />
                <IonButton
                  fill="clear"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                  slot="end"
                >
                  {showPassword ? <FiEye /> : <FiEyeOff />}
                </IonButton>
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
