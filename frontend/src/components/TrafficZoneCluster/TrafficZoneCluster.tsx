import React, { useState } from "react";
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { GoogleMap, Circle } from "@react-google-maps/api";

interface TrafficZoneClusterProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedZone) => void;
  trafficZones: { id: number; lat: number; lng: number }[]; // Updated with an ID
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const initialCenter = {
  lat: 18.516726,
  lng: 73.856255,
};

const circleOptions = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.35,
  clickable: true,
  draggable: false,
  editable: false,
  visible: true,
  radius: 100,
  zIndex: 1,
};

const TrafficZoneCluster: React.FC<TrafficZoneClusterProps> = ({
  isOpen,
  onClose,
  onSubmit,
  trafficZones,
}) => {
  const [selectedZone, setSelectedZone] = useState<{
    id: number;
    lat: number;
    lng: number;
  } | null>(null);

  const handleCircleClick = (zone: {
    id: number;
    lat: number;
    lng: number;
  }) => {
    console.log("Selected Traffic Zone:", zone);
    setSelectedZone(zone);
  };

  const handleSelect = () => {
    if (selectedZone) {
      onSubmit(selectedZone.id);
      onClose();
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Select Traffic Signal</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={initialCenter}
          zoom={12}
        >
          {/* Render Circles for Traffic Zones */}
          {trafficZones.map((zone) => (
            <Circle
              key={zone.id}
              center={{ lat: zone.lat, lng: zone.lng }}
              options={circleOptions}
              onClick={() => handleCircleClick(zone)}
            />
          ))}
        </GoogleMap>
      </IonContent>
      <IonFooter>
        <IonButton
          expand="block"
          onClick={handleSelect}
          disabled={!selectedZone}
        >
          Select
        </IonButton>
        <IonButton expand="block" color="danger" onClick={onClose}>
          Cancel
        </IonButton>
      </IonFooter>
    </IonModal>
  );
};

export default TrafficZoneCluster;
