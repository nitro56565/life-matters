import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonPage,
  IonText,
} from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import TrafficZoneCluster from "../../components/TrafficZoneCluster/TrafficZoneCluster";
import "./TrafficPoliceSignUp.css";
import axios from "axios";

const TrafficPoliceSignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [trafficSignal, setTrafficSignal] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useIonRouter();
  const [clusters, setClusters] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/traffic-clusters`);
        const formattedClusters = response.data.map((cluster: any) => ({
          id: cluster.id,
          lat: Number(cluster.data.lat),
          lng: Number(cluster.data.lon),
        }));
        setClusters(formattedClusters);
      } catch (error) {
        console.error("Error fetching traffic zone clusters:", error);
        setMessage({
          text: "Failed to fetch traffic zone clusters.",
          type: "error",
        });
      }
    };

    fetchClusters();
  }, []);

  const validatePhone = (phone: string) => /^\d{10}$/.test(phone);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (!name || !phone || !password || !trafficSignal) {
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
        phone,
        password,
        cluster: trafficSignal,
      };
      console.log(data);

      const response = await axios.post(
        `${BACKEND_URL}/api/trafficpolice/signup`,
        data
      );

      if (response.data && response.data.message) {
        setMessage({
          text: "Sign-up successful! Redirecting...",
          type: "success",
        });
        setTimeout(() => {
          router.push("/trafficpolice-signin", "root", "replace");
        }, 2000);
      } else {
        throw new Error("Failed to sign up.");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      setMessage({
        text: error.response.data.message,
        type: "error",
      });
    }
  };

  const handleTrafficSignalClick = () => {
    setIsModalOpen(true);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="signup-container">
          <div className="signup-card">
            <div className="signup-header">
              <h1>Sign Up</h1>
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
                  className="signup-input"
                  value={name}
                  onIonInput={(e) =>
                    setName((e.target as unknown as HTMLInputElement).value)
                  }
                  required
                />
              </IonItem>

              <IonItem className="signup-item">
                <IonInput
                  label="Phone Number"
                  labelPlacement="floating"
                  type="number"
                  className="signup-input phone-input"
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

              <IonItem className="signup-item">
                <IonInput
                  label="Password"
                  labelPlacement="floating"
                  type="password"
                  className="signup-input password-input"
                  value={password}
                  onIonInput={(e) =>
                    setPassword((e.target as unknown as HTMLInputElement).value)
                  }
                  required
                />
              </IonItem>

              <IonItem className="signup-item">
                <IonButton
                  className="traffic-signal-button"
                  expand="block"
                  onClick={handleTrafficSignalClick}
                >
                  {trafficSignal
                    ? `Selected Cluster ID: ${trafficSignal}`
                    : "Select Traffic Signal"}
                </IonButton>
              </IonItem>

              <IonButton type="submit" expand="block" className="signup-button">
                Sign Up
              </IonButton>
            </form>
          </div>
        </div>

        <TrafficZoneCluster
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(signal) => setTrafficSignal(signal)}
          trafficZones={clusters}
        />
      </IonContent>
    </IonPage>
  );
};

export default TrafficPoliceSignUp;