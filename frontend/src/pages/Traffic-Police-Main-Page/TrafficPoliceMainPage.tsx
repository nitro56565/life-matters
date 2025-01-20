import { IonContent, IonPage } from "@ionic/react";
import { useEffect, useState } from "react";
import { GoogleMap } from "@react-google-maps/api";
import { BottomSheet } from "../../components/BottomSheetDrawer/BottomSheet";
import "./TrafficPoliceMainPage.css";
import { getSocket } from "../../components/Utils/socketService";

const TrafficPoliceMainPage: React.FC = () => {
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [AmbulanceLocation, setAmbulanceLocation] = useState<any>(null);
  const socket = getSocket();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const directionsService = new google.maps.DirectionsService();

  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const clusterZoneData = localStorage.getItem("clusterZone");
  const clusterZone = JSON.parse(clusterZoneData);

  const centerLat = clusterZone[0].lat;
  const centerLon = clusterZone[0].lon;

  const center = {
    lat: centerLat,
    lng: centerLon,
  };

  // Initialize directions rendering on map load
  useEffect(() => {
    if (map) {
      directionsRenderer.setMap(map);
    }
  }, [map]);

  // Listen for location updates and calculate directions
  useEffect(() => {
    const handleTrafficSignals = (signals) => {
      // Check if any signal matches the center
      const isMatch = signals.some(
        (signal) => JSON.stringify(signal) === JSON.stringify(center)
      );

      if (isMatch) {
        // Listen for location updates only if there's a match
        socket.on("update-location", (data) => {
          console.log("Received location update:", data);
          setAmbulanceLocation(data);

          if (data && map) {
            // Calculate route
            directionsService.route(
              {
                origin: { lat: data.lat, lng: data.lng },
                destination: center,
                travelMode: google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                  directionsRenderer.setDirections(result);
                } else {
                  console.error("Error calculating directions:", status);
                }
              }
            );
          }
        });
      }
    };

    socket.on("traffic-signals-matches", handleTrafficSignals);

    return () => {
      // Cleanup all listeners
      socket.off("traffic-signals-matches", handleTrafficSignals);
      socket.off("update-location");
    };
  }, [map, socket, center]);

  // Add a circle to the map when the map instance is loaded
  useEffect(() => {
    if (map) {
      new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: map,
        center: center,
        radius: 100,
      });
    }
  }, [map]);

  const handleClose = () => {
    setShowBottomSheet(false);
    setTimeout(() => {
      setShowBottomSheet(true);
    }, 10);
  };

  return (
    <IonPage>
      <IonContent fullscreen scroll-y="false" className="main">
        {/* Full-Screen Google Map */}
        <div className="map-container">
          <GoogleMap
            id="map"
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            onLoad={(mapInstance) => setMap(mapInstance)}
            options={{
              gestureHandling: "greedy",
              fullscreenControl: false,
              mapTypeControl: false,
            }}
          ></GoogleMap>
        </div>

        {/* Bottom Sheet */}
        <BottomSheet isOpen={showBottomSheet} close={handleClose} />
      </IonContent>
    </IonPage>
  );
};

export default TrafficPoliceMainPage;
