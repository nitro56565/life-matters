import React, { useEffect, useLayoutEffect, useState } from "react";
import { GoogleMap } from "@react-google-maps/api"; // No need for useLoadScript anymore
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
  const router = useIonRouter();

  useEffect(() => {
    // Check if google maps has loaded
    if (!window.google) {
      console.error("Google Maps JavaScript API not loaded");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType");

    if (!token && !userType) {
      router.push("/", "root", "replace");
    }
  }, [router]);

  const logout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // Confirm logout with the user (optional)
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    try {
      // Clear authentication tokens or any other user data in local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userType");

      // Optionally clear app state here, e.g., any Redux or Context state

      // Redirect the user after clearing the local storage
      router.push("/ambulance-signin", "root", "replace");
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, show a toast or alert to inform the user of the issue
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div className="container">
          <h1 className="title">Ambulance Portal</h1>

          {/* Source - Destination */}
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
                  ></IonIcon>
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
                  ></IonIcon>
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
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AmbulanceMainPage;