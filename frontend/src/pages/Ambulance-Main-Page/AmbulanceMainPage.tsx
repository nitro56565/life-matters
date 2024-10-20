import React from "react";
import { IonPage, IonHeader, IonContent, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonButton, IonInput, IonLabel, IonItem, IonText } from '@ionic/react';
import './Ambulancemainpage.css'

const AmbulanceMainPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Ambulance Portal</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Input Fields Section */}
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <IonItem>
                <IonLabel position="floating">Enter source</IonLabel>
                <IonInput placeholder="Enter source"></IonInput>
              </IonItem>
            </IonCol>

            <IonCol size="12">
              <IonItem>
                <IonLabel position="floating">Enter destination</IonLabel>
                <IonInput placeholder="Enter destination"></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Logout Button */}
        <div className="logout-btn">
          <IonButton expand="block" color="danger">Logout</IonButton>
        </div>

        {/* Distance and Duration Info */}
        <IonGrid className="info-grid">
          <IonRow>
            <IonCol size="6">
              <IonText>Duration: N/A</IonText>
            </IonCol>
            <IonCol size="6">
              <IonText>Distance: N/A</IonText>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Route and Map Buttons */}
        <IonGrid className="route-grid">
          <IonRow className="ion-align-items-center">
            <IonCol size="2" className="ion-text-center">
              <img src="assets/current-location-icon.svg" className="location-icon" alt="Current Location" />
            </IonCol>
            <IonCol size="5">
              <IonButton expand="block" color="primary">Show Route</IonButton>
            </IonCol>
            <IonCol size="5">
              <IonButton expand="block" color="primary">Start</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Placeholder for Google Map */}
        <div className="map-container">
          {/* You can later replace this with Google Maps */}
          <div className="map-placeholder">Map Placeholder</div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AmbulanceMainPage;