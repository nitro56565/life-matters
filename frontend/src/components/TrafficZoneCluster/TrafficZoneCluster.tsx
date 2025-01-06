import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { GoogleMap, Marker } from "@react-google-maps/api";

interface TrafficZoneClusterProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedLocation: string) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const initialCenter = {
  lat: 18.516726,
  lng: 73.856255,
};

const TrafficZoneCluster: React.FC<TrafficZoneClusterProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] =
    useState<google.maps.LatLng | null>(null);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setSelectedMarker(event.latLng);
    }
  };

  const handleSelect = () => {
    if (selectedMarker) {
      onSubmit(selectedMarker.toString());
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
          onLoad={(mapInstance) => setMap(mapInstance)}
          onClick={handleMapClick}
        >
          {selectedMarker && <Marker position={selectedMarker} />}
        </GoogleMap>
      </IonContent>
      <IonFooter>
        <IonButton expand="block" onClick={handleSelect}>
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
