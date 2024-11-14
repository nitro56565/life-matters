import React, { useState } from "react";
import {
  IonButton,
  IonInput,
  IonItem,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import "./ForgotPasswordPage.css";

const ForgotPassword: React.FC = () => {
  const history = useHistory();
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d+$/;
    return phoneRegex.test(phone);
  };

  const handleRequestOtp = () => {
    if (validatePhone(phone)) {
      setPhoneError(null); 
      setIsOtpRequested(true);
    } else {
      setPhoneError("Please enter a valid 10-digit phone number.");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLIonButtonElement>) => {
    event.preventDefault();
    if (!isOtpRequested) {
      handleRequestOtp(); 
    } else {
      if (otp.length==6) {
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
                      name="phone"
                      value={phone}
                      maxlength={10}
                      onIonChange={(e) => setPhone(e.detail.value!)}
                      required
                    />
                  </IonItem>
                  {phoneError && <IonText color="danger">{phoneError}</IonText>}
                </>
              ) : (
                <IonGrid>
                  <IonRow className="otp-row">
                    {otp.map((value, index) => (
                      <IonCol key={index} className="otp-col">
                        <IonInput
                          type="tel"
                          value={value}
                          onIonChange={(e) => handleOtpChange(index, e.detail.value!)}
                          maxlength={1}
                          className="forgot-password-input otp-input"
                          inputMode="numeric"
                        />
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              )}
              <IonButton
                type="button"
                expand="block"
                className="forgot-password-button"
                onClick={handleButtonClick}
              >
                {isOtpRequested ? "Validate OTP" : "Request OTP"}
              </IonButton>
              {isOtpRequested && (
                <div className="forgot-password-text">
                  Didn't receive any code?{" "}
                  <a href="/forgot-password">click here</a>
                </div>
              )}
            </form>
          </div>
        </div>
    </IonPage>
  );
};

export default ForgotPassword;
