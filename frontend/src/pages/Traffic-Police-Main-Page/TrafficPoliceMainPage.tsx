import { IonContent, IonPage } from "@ionic/react";
import { useEffect, useState, useRef } from "react";
import { GoogleMap } from "@react-google-maps/api";
import { BottomSheet } from "../../components/BottomSheetDrawer/BottomSheet";
import "./TrafficPoliceMainPage.css";
import { getSocket } from "../../components/Utils/socketService";
import axios from "axios";
import debounce from "lodash.debounce";

const TrafficPoliceMainPage: React.FC = () => {
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [updateChecker, setUpdateChecker] = useState<number>(0);
  const [ambulanceData, setAmbulanceData] = useState<any[]>([]); // aggregated data state
  const socket = getSocket();

  const directionsRendererRef = useRef(new google.maps.DirectionsRenderer());
  const directionsServiceRef = useRef(new google.maps.DirectionsService());
  const trafficPoliceId = localStorage.getItem("trafficPoliceId");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

  const fetchAggregatedData = async () => {
    if (!trafficPoliceId) {
      console.error("No traffic police id found in localStorage");
      return;
    }

    try {
      // Send the trafficPoliceId in the POST request body
      const { data } = await axios.post(
        `${BACKEND_URL}/redis/api/trafficpolice/full-data`,
        { trafficPoliceId }
      );
      console.log("Aggregated ambulance data:", data.ambulanceData);
      setAmbulanceData(data.ambulanceData); // update state with response
    } catch (error) {
      console.error("Error fetching aggregated Redis data:", error);
    }
  };

  // Listen for the "police-id-update" socket event and update the counter
  useEffect(() => {
    const handlePoliceIdUpdate = (policeId) => {
      if (policeId === trafficPoliceId) {
        setUpdateChecker((prev) => prev + 1);
      }
    };

    socket.on("police-id-update", handlePoliceIdUpdate);
    return () => {
      socket.off("police-id-update", handlePoliceIdUpdate);
    };
  }, [socket, trafficPoliceId]);

  // Debounce the fetchAggregatedData call so that it only runs once every few seconds max
  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchAggregatedData();
    }, 3000); // 10 seconds debounce

    debouncedFetch();

    // Cleanup debounce on unmount or dependency change
    return () => {
      debouncedFetch.cancel();
    };
  }, [updateChecker]);

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
        socket.off("update-location");

        socket.on("update-location", (data) => {
          console.log("Received location update:", data);

          if (data && map) {
            // Clear previous route
            directionsRendererRef.current.setDirections({
              routes: [],
              request: undefined,
            });

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
          });
          map.setCenter(center);
          map.setZoom(15);
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
        <BottomSheet
          isOpen={showBottomSheet}
          close={handleClose}
          ambulanceData={ambulanceData}
        />
      </IonContent>
    </IonPage>
  );
};

export default TrafficPoliceMainPage;
