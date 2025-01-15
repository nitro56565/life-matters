import React, { useState } from "react";
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonPage,
  IonText,
} from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import axios from "axios";
import "./AmbulanceSignUp.css";

const AmbulanceSignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);
  const router = useIonRouter();

  const validatePhone = (phone: string) => /^\d{10}$/.test(phone);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (!name || !hospitalName || !vehicleNumber || !phone || !password) {
      setMessage({ text: "All fields are required.", type: "error" });
      return;
    }

    if (!validatePhone(phone)) {
      setMessage({
        text: "Please enter a valid 10-digit phone number.",
        type: "error",
      });
      return;
    }

    try {
      const data = {
        name,
        hospitalName,
        vehicleNumber,
        phone,
        password,
      };

      const response = await axios.post("/api/ambulance/signup", data);

      if (response.data && response.data.token) {
        setMessage({
          text: "Sign-up successful! Redirecting...",
          type: "success",
        });
        setTimeout(() => {
          router.push("/ambulance-signin", "root", "replace");
        }, 2000);
      } else {
        throw new Error("Failed to sign up.");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      setMessage({
        text: error.response?.data?.message || "Sign-up failed.",
        type: "error",
      });
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="signup-container">
          <div className="signup-card">
            <div className="signup-header">
              <h1>Ambulance Sign Up</h1>
            </div>
            {message && (
              <IonText
                color={message.type === "success" ? "success" : "danger"}
              >
                {message.text}
              </IonText>
            )}
            <form onSubmit={handleSignUp}>
              <IonItem className="signup-item">
                <IonInput
                  label="Name"
                  labelPlacement="floating"
                  type="text"
                  value={name}
                  onIonInput={(e) =>
                    setName((e.target as unknown as HTMLInputElement).value)
                  }
                  required
                />
              </IonItem>

              <IonItem className="signup-item">
                <IonInput
                  label="Hospital Name"
                  labelPlacement="floating"
                  type="text"
                  value={hospitalName}
                  onIonInput={(e) =>
                    setHospitalName(
                      (e.target as unknown as HTMLInputElement).value
                    )
                  }
                  required
                />
              </IonItem>

              <IonItem className="signup-item">
                <IonInput
                  label="Vehicle Number"
                  labelPlacement="floating"
                  type="text"
                  value={vehicleNumber}
                  inputMode="text"
                  onIonInput={(e) => {
                    const input = (e.target as unknown as HTMLInputElement)
                      .value;
                    if (input.length <= 10) setVehicleNumber(input);
                  }}
                  onKeyDown={(e) => {
                    if (
                      vehicleNumber.length >= 10 &&
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      e.key !== "Tab" &&
                      !/^[a-zA-Z0-9]$/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  required
                />
              </IonItem>

              <IonItem className="signup-item">
                <IonInput
                  label="Phone Number"
                  labelPlacement="floating"
                  type="text"
                  inputMode="numeric"
                  value={phone}
                  onIonInput={(e) => {
                    const input = (
                      e.target as unknown as HTMLInputElement
                    ).value.replace(/\D/g, "");
                    if (input.length <= 10) setPhone(input);
                  }}
                  onKeyDown={(e) => {
                    if (
                      (e.key >= "0" && e.key <= "9" && phone.length >= 10) ||
                      (e.key !== "Backspace" &&
                        e.key !== "Delete" &&
                        e.key !== "Tab" &&
                        (e.key < "0" || e.key > "9"))
                    ) {
                      e.preventDefault();
                    }
                  }}
                  required
                />
              </IonItem>
              <IonItem className="signup-item">
                <IonInput
                  label="Password"
                  labelPlacement="floating"
                  type="password"
                  value={password}
                  onIonInput={(e) =>
                    setPassword((e.target as unknown as HTMLInputElement).value)
                  }
                  required
                />
              </IonItem>

              <IonButton type="submit" expand="block" className="signup-button">
                Sign Up
              </IonButton>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AmbulanceSignUp;
