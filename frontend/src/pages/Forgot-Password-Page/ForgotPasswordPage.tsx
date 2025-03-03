import React, { useRef, useState } from "react";
import {
  IonButton,
  IonInput,
  IonItem,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  InputInputEventDetail,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import "./ForgotPasswordPage.css";
import { IonInputCustomEvent } from "@ionic/core";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../Forgot-Password-Page/ForgotPasswordPage.css"

interface ForgotPasswordProps {
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
}

// Utility function for phone validation
const validatePhone = (phone: string) => /^\d{10}$/.test(phone);

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ phone, setPhone }) => {
  const history = useHistory();
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLIonInputElement | null)[]>([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get("redirectUrl") || "/default-path"; // Default if not provided

console.log("Redirect URL:", redirectUrl);

  // Function to request OTP from backend
  const handleRequestOtp = async () => {
    if (validatePhone(phone)) {
      setPhoneError(null);
      setIsOtpRequested(true);
    } else {
      setPhoneError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/otp/sendotp`, {
        phone,
      });

      if (data.success) {
        setIsOtpRequested(true);
      } else {
        setPhoneError(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      setPhoneError("Server error. Try again later.");
    }
  };

  // Function to verify OTP
  const handleVerifyOtp = async () => {
    if (otp.some((digit) => digit.trim() === "")) {
      setOtpError("Please enter the complete OTP.");
      return;
    }
    setOtpError(null);

    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/otp/verifyotp`, {
        phone,
        otp: otp.join(""),
      });

      if (data.success) {
        history.push("/set-new-password");
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setOtpError("Server error. Try again later.");
    }
  };

  // Handle OTP input change
  const handleOtpInput = (
    e: IonInputCustomEvent<InputInputEventDetail>,
    index: number
  ) => {
    const value = e.detail.value || "";

    if (!/^\d?$/.test(value)) return; // Allow only single-digit numbers

    const newOtp = [...otp];
    newOtp[index] = value; // Update the current digit
    setOtp(newOtp);

    // Move focus forward if a value is entered
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.setFocus();
    }
    // Move focus backward if backspace is pressed and the current input is empty
    else if (!value && index > 0) {
      inputRefs.current[index - 1]?.setFocus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLIonInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("").slice(0, otp.length); // Fill as much as the OTP length
      setOtp(newOtp);

      // Automatically focus the last filled input
      const lastIndex = newOtp.length - 1;
      inputRefs.current[lastIndex]?.setFocus();
    }
  };

  // Handle button click for OTP validation
  const handleButtonClick = (event: React.MouseEvent<HTMLIonButtonElement>) => {
    event.preventDefault();
    if (!isOtpRequested) {
      handleRequestOtp();
    } else {
      if (otp.every((digit) => digit.trim() !== "")) {
        history.push("/set-new-password");
      }
    }
  };

  return (
    <IonPage>
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <h1>Forgot Password</h1>
          </div>
          <form>
            {!isOtpRequested ? (
              <>
                <IonItem className="forgot-password-item">
                  <IonInput
                    label="Enter your phone number"
                    labelPlacement="floating"
                    type="tel"
                    className="forgot-password-input phone-input"
                    inputMode="numeric"
                    maxlength={10}
                    value={phone}
                    onIonInput={(e) =>
                      setPhone(e.detail.value!.replace(/\D/g, ""))
                    }
                    required
                  />
                </IonItem>
                {phoneError && <IonText color="danger">{phoneError}</IonText>}
              </>
            ) : (
              <IonGrid>
                <IonRow className="otp-row">
                  {otp.map((digit, index) => (
                    <IonCol key={index} className="otp-col">
                      <IonInput
                        type="tel"
                        value={digit}
                        maxlength={1}
                        inputMode="numeric"
                        className="forgot-password-input otp-input"
                        onIonInput={(e) => handleOtpInput(e, index)}
                        onPaste={(e) => handleOtpPaste(e)}
                        ref={(el) => (inputRefs.current[index] = el)} // Ref for focusing
                      />
                    </IonCol>
                  ))}
                </IonRow>
                {otpError && <IonText color="danger">{otpError}</IonText>}
              </IonGrid>
            )}
            <IonButton
              type="button"
              expand="block"
              className="forgot-password-button"
              onClick={isOtpRequested ? handleVerifyOtp : handleRequestOtp}
            >
              {isOtpRequested ? "Validate OTP" : "Request OTP"}
            </IonButton>
            {isOtpRequested && (
              <div className="forgot-password-text">
                Didn't receive any code?{" "}
                <a href="/forgot-password">Click here</a>
              </div>
            )}
          </form>
        </div>
      </div>
    </IonPage>
  );
};

export default ForgotPassword;
