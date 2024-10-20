import React from "react";
import { IonButton, IonContent, IonImg, IonPage } from "@ionic/react";
import { useHistory } from "react-router-dom";
import "./Home.css"

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="home-container">
          {/* Logo */}
          <IonImg className="home-logo" src="/life-matters-logo-t-nnm.png" alt="Logo" />

          {/* Buttons */}
          <div className="home-buttons">
            <IonButton
              expand="block"
              className="custom-button"
              onClick={() => history.push("/ambulance-signin")}            
              >
              Ambulance
            </IonButton>
            <IonButton
              expand="block"
              className="custom-button"
              onClick={() => history.push("/trafficpolice-signin")}
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