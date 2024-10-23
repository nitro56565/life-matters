import React, { useState } from "react";
import {
  IonButton,
  IonInput,
  IonItem,
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import "./ForgotPasswordPage.css";

const ForgotPassword: React.FC = () => {
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));

  const handleRequestOtp = () => {
    setIsOtpRequested(true);
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleButtonClick = () => {
    if (!isOtpRequested) {
      setIsOtpRequested(true);
    } else {
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="forgot-password-container">
          <div className="forgot-password-card">
            <div className="forgot-password-header">
              <h1>Forgot Password</h1>
            </div>
            <form>
              {!isOtpRequested ? (
                <IonItem className="forgot-password-item">
                  <IonInput
                    label="Enter your phone number"
                    labelPlacement="floating"
                    type="number"
                    className="forgot-password-input phone-input"
                    name="phone"
                    value={phone}
                    onIonChange={(e) => setPhone(e.detail.value!)}
                    required
                  ></IonInput>
                </IonItem>
              ) : (
                <IonGrid>
                  <IonRow>
                    {otp.map((value, index) => (
                      <IonCol key={index}>
                        <IonInput
                          type="number"
                          value={value}
                          onIonChange={(e) =>
                            handleOtpChange(index, e.detail.value!)
                          }
                          maxlength={1}
                          className="forgot-password-input phone-input"
                        />
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              )}
              <IonButton
                type="submit"
                expand="block"
                className="forgot-password-button"
                onClick={handleButtonClick}
              >
                {isOtpRequested ? "Validate OTP" : "Request OTP"}
              </IonButton>
              {isOtpRequested && (
                <div className="forgot-password">
                  Didn't receive any code?{" "}
                  <a href="/forgot-password">click here</a>
                </div>
              )}
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
