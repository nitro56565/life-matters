import React, { useEffect } from "react";
import { IonButton, IonContent, IonImg, IonPage, useIonRouter } from "@ionic/react";
import { App } from '@capacitor/app';
import "./Home.css";

const Home: React.FC = () => {
  const router = useIonRouter();

  useEffect(() => {
    const handleBackButton = () => {
      // Exit the application
      App.exitApp();
    };

    // Add back button event listener
    document.addEventListener('backbutton', handleBackButton);

    if (window.google && window.google.maps) {
      // Only run map initialization if google maps is available
      const type = localStorage.getItem("userType");
      if (type === "ambulance") {
        router.push("/ambulance-home", "root");
      } else if (type === "trafficpolice") {
        router.push("/trafficpolice-home", "root");
      }
    } else {
      console.error("Google Maps JavaScript API not loaded");
    }

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('backbutton', handleBackButton);
    };
  }, [router]);

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="home-container">
          {/* Logo */}
          <IonImg
            className="home-logo"
            src="/life-matters-logo-t-nnm.png"
            alt="Logo"
          />

          {/* Buttons */}
          <div className="home-buttons">
            <IonButton
              expand="block"
              className="custom-button"
              onClick={() => router.push("/ambulance-signin", "root")}
            >
              Ambulance
            </IonButton>
            <IonButton
              expand="block"
              className="custom-button"
              onClick={() => router.push("/trafficpolice-signin", "root")}
            >
              Traffic Police
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;