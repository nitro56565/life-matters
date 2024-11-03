import React, { useEffect, useState } from "react";
import { GoogleMap } from "@react-google-maps/api";
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  useIonRouter,
} from "@ionic/react";
import { locate, location } from "ionicons/icons";
import "./Ambulancemainpage.css";

const containerStyle = {
  width: "100%",
  height: "370px",
};

const center = {
  lat: 18.516726,
  lng: 73.856255,
};

const AmbulanceMainPage = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [error, setError] = useState<string | null>(null); // Added error state
  const router = useIonRouter();

  useEffect(() => {
    if (!window.google) {
      setError("Google Maps JavaScript API not loaded");
      console.error(error);
    }
  }, [error]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType");

    if (!token && !userType) {
      router.push("/", "root", "replace");
    }
  }, [router]);

  const logout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    router.push("/ambulance-signin", "root", "replace");
  };

  return (
    <IonPage>
      <IonContent>
        <div className="container">
          <h1 className="title">Ambulance Portal</h1>

          {/* Source - Destination Inputs */}
          <div className="input-container">
            <IonList className="input-list" style={{ background: "white" }}>
              <IonItem lines="none" className="input-box">
                <IonInput
                  labelPlacement="stacked"
                  label="Source"
                  className="input-label"
                >
                  <IonIcon
                    style={{ color: "black", scale: "1.5" }}
                    slot="start"
                    icon={location}
                    aria-hidden="true"
                  />
                </IonInput>
              </IonItem>
            </IonList>
            <IonList className="input-list" style={{ background: "white" }}>
              <IonItem lines="none" className="input-box">
                <IonInput
                  labelPlacement="stacked"
                  label="Destination"
                  className="input-label"
                >
                  <IonIcon
                    style={{ color: "black", scale: "1.5" }}
                    slot="start"
                    icon={location}
                    aria-hidden="true"
                  />
                </IonInput>
              </IonItem>
            </IonList>
          </div>

          <div className="button-container">
            <div>
              <IonIcon className="locate-icon" icon={locate} />
            </div>
            <button className="route-button">Show Route</button>
            <button className="start-button">Start</button>
          </div>

          {/* Logout Button */}
          <div className="logout-container">
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>

          {/* Map Display */}
          <div className="map-container">
            <GoogleMap
              id="map"
              mapContainerStyle={containerStyle}
              center={center}
              zoom={6}
              onLoad={(mapInstance) => setMap(mapInstance)}
              options={{ gestureHandling: "greedy" }}
            />
          </div>

          {/* Error Message (Optional) */}
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AmbulanceMainPage;