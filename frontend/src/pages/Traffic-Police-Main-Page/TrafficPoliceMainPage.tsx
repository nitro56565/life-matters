import { IonContent, IonPage } from "@ionic/react";
import { useEffect, useState, useRef } from "react";
import { GoogleMap } from "@react-google-maps/api";
import { BottomSheet } from "../../components/BottomSheetDrawer/BottomSheet";
import "./TrafficPoliceMainPage.css";
import { getSocket } from "../../components/Utils/socketService";

const TrafficPoliceMainPage: React.FC = () => {
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const socket = getSocket();

  const directionsRendererRef = useRef(new google.maps.DirectionsRenderer());
  const directionsServiceRef = useRef(new google.maps.DirectionsService());

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

  console.log(clusterZone);

  // Initialize directions rendering on map load
  useEffect(() => {
    if (map) {
      directionsRendererRef.current.setMap(map);
    }
  }, [map]);

  // Listen for traffic signal matches
  useEffect(() => {
    const handleTrafficSignals = (signals) => {
      const isMatch = clusterZone?.some((zone) =>
        signals.some(
          (signal) => signal.lat === zone.lat && signal.lng === zone.lon
        )
      );

      if (isMatch) {
        console.log("Match found with traffic signals and cluster zone.");
        // Clear any existing listeners to avoid duplication
        socket.off("update-location");

        // Listen for location updates and calculate directions
        socket.on("update-location", (data) => {
          console.log("Received location update:", data);

          if (data && map) {
            // Clear previous route
            directionsRendererRef.current.setDirections({
              routes: [],
              request: undefined,
            }); // Use an empty routes array

            // Calculate new route
            directionsServiceRef.current.route(
              {
                origin: { lat: data.lat, lng: data.lng },
                destination: center,
                travelMode: google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                  directionsRendererRef.current.setDirections(result);
                } else {
                  console.error("Error calculating directions:", status);
                }
              }
            );
          }
        });
      } else {
        console.log("No match found between traffic signals and cluster zone.");
        // Reset the map to its default state
        if (map) {
          directionsRendererRef.current.setDirections({
            routes: [],
            request: undefined,
          }); // Clear directions
          map.setCenter(center); // Reset to center
          map.setZoom(15); // Reset zoom level
        }
        // Ensure no location updates are processed
        socket.off("update-location");
      }
    };

    // Listen for traffic signals matching events
    socket.on("traffic-signals-matches", handleTrafficSignals);

    return () => {
      // Cleanup all listeners
      socket.off("traffic-signals-matches", handleTrafficSignals);
      socket.off("update-location");
    };
  }, [map, center, clusterZone, socket]);

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
