import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  useIonRouter,
  IonButton,
} from "@ionic/react";
import { locate, location } from "ionicons/icons";
import { Geolocation } from "@capacitor/geolocation";
import { getSocket } from "../../components/Utils/socketService";
import "./Ambulancemainpage.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { menuOutline } from "ionicons/icons";
import startBackgroundTracking from "../../components/Utils/BackgroundLocationTracking";

const containerStyle = {
  width: "100%",
  height: "370px",
};

const center = {
  lat: 18.516726,
  lng: 73.856255,
};

const AmbulanceMainPage = () => {
  const [map, setMap] = useState<any>(null);
  const [sourceMarker, setSourceMarker] = useState<any>(null);
  const [destinationMarker, setDestinationMarker] = useState<any>(null);
  const [directions, setDirections] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [previousRouteStart, setPreviousRouteStart] = useState<any>(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const router = useIonRouter();

  const sourceRef = useRef<HTMLIonInputElement | null>(null);
  const destinationRef = useRef<HTMLIonInputElement | null>(null);
  const previousRouteStartRef = useRef(previousRouteStart);
  const socket = getSocket();
  let locationInterval: NodeJS.Timeout;

  useEffect(() => {
    previousRouteStartRef.current = previousRouteStart;
  }, [previousRouteStart]);

  useEffect(() => {
    if (
      !localStorage.getItem("authToken") &&
      !localStorage.getItem("userType")
    ) {
      router.push("/", "root", "replace");
    }

    socket.on("traffic-signals-response", (data: any) => {
      console.log("Traffic signals data received:", data);
    });

    return () => {
      socket.off("traffic-signals-response");
      if (locationInterval) {
        clearInterval(locationInterval); // Clean up the interval
      }
    };
  }, [router, socket]);

  const fetchCurrentLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      const { latitude, longitude } = position.coords;
      const newLocation = { lat: latitude, lng: longitude };
      console.log("Current location new:", newLocation);
      console.log("Previous route start:", previousRouteStartRef.current);
      const newSourceMarker = new window.google.maps.Marker({
        position: newLocation,
        map,
        title: "Current Location",
      });

      if (previousRouteStart) {
        const distanceFromStart = calculateDistance(
          previousRouteStartRef.current,
          newLocation
        );
        console.log("Distance from start:", distanceFromStart);

        if (distanceFromStart > 100) {
          if (sourceMarker) {
            sourceMarker.setMap(null);
            sourceMarker.setPosition(newLocation);
          }
          console.log("User deviated from the route. Recalculating...");
          calculateRoute();
        } else {
          console.log(
            "User is within the allowed radius from the start point."
          );
        }
      }

      if (sourceMarker) {
        sourceMarker.setMap(null);
        setSourceMarker(null);
      }
      setSourceMarker(newSourceMarker);
      // map.panTo(new window.google.maps.LatLng(latitude, longitude));
    } catch (error) {
      console.error("Error fetching current location:", error);
      setError("Failed to get current location");
    }
  };

  useEffect(() => {
    const initializeAutocomplete = async () => {
      if (sourceRef.current && destinationRef.current) {
        const sourceInput = await sourceRef.current.getInputElement();
        const destinationInput = await destinationRef.current.getInputElement();

        const options = {
          types: ["establishment"],
          fields: ["place_id", "geometry", "name", "formatted_address"],
          componentRestrictions: { country: "in" },
        };

        const sourceAutocomplete = new window.google.maps.places.Autocomplete(
          sourceInput,
          options
        );
        const destinationAutocomplete =
          new window.google.maps.places.Autocomplete(destinationInput, options);

        sourceAutocomplete.addListener("place_changed", () => {
          const place = sourceAutocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            if (sourceMarker) {
              sourceMarker.setMap(null);
            }
            const newSourceMarker = new window.google.maps.Marker({
              position: place.geometry.location,
              map,
              title: "Source",
            });
            setSourceMarker(newSourceMarker);
            map.panTo(place.geometry.location);
          }
        });

        destinationAutocomplete.addListener("place_changed", () => {
          const place = destinationAutocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            if (destinationMarker) {
              destinationMarker.setMap(null);
            }
            const newDestinationMarker = new window.google.maps.Marker({
              position: place.geometry.location,
              map,
              title: "Destination",
            });
            setDestinationMarker(newDestinationMarker);
            map.panTo(place.geometry.location);
          }
        });
      }
    };

    initializeAutocomplete();
  }, [map, sourceMarker, destinationMarker]);

  const interpolatePoints = (start, end, numPoints, baseIndex) => {
    const latStep = (end.lat() - start.lat()) / numPoints;
    const lngStep = (end.lng() - start.lng()) / numPoints;

    return Array.from({ length: numPoints - 1 }, (_, i) => ({
      id: `${baseIndex}-${i}`, // Generate ID based on the baseIndex
      lat: start.lat() + latStep * (i + 1),
      lng: start.lng() + lngStep * (i + 1),
    }));
  };

  const calculateRoute = () => {
    if (sourceMarker && destinationMarker) {
      if (directions) {
        setDirections(null);
      }
      if (directionsRenderer) {
        directionsRenderer.setMap(null); // This should fully remove the old route
        setDirectionsRenderer(null);
      }
      const directionsService = new window.google.maps.DirectionsService();
      const request = {
        origin: sourceMarker.getPosition(),
        destination: destinationMarker.getPosition(),
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
      };

      directionsService.route(request, (result, status) => {
        if (status === "OK") {
          setDirections(result);

          const route = result.routes[0].legs[0];
          setDistance(route.distance.text);
          setDuration(route.duration.text);

          let pointCounter = 0;
          // Generate high-density route points
          const highDensityPoints = route.steps.flatMap((step) => {
            const densePath = [];
            for (let i = 0; i < step.path.length - 1; i++) {
              const start = step.path[i];
              const end = step.path[i + 1];
              // Add original points
              densePath.push({
                id: `${pointCounter}`,
                lat: start.lat(),
                lng: start.lng(),
              });
              pointCounter++;

              // Add interpolated points
              const interpolated = interpolatePoints(
                start,
                end,
                10,
                pointCounter
              );
              densePath.push(...interpolated);
              pointCounter += interpolated.length;
            }
            // Add the last point of the step
            densePath.push({
              id: `${pointCounter}`,
              lat: step.path[step.path.length - 1].lat(),
              lng: step.path[step.path.length - 1].lng(),
            });
            pointCounter++;
            return densePath;
          });

          if (highDensityPoints.length > 0) {
            setPreviousRouteStart({
              lat: highDensityPoints[0].lat,
              lng: highDensityPoints[0].lng,
            });
          }

          console.log("Generated high-density points:", highDensityPoints);
          socket.emit("request-traffic-signals", highDensityPoints);
        } else {
          setError("Directions request failed due to " + status);
        }
      });
    }
  };

  const handleStartTrip = async () => {
    if (sourceMarker && destinationMarker) {
      await startBackgroundTracking();
      const sourceCoords = sourceMarker.getPosition();
      const destinationCoords = destinationMarker.getPosition();

      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${sourceCoords.lat()},${sourceCoords.lng()}&destination=${destinationCoords.lat()},${destinationCoords.lng()}`;
      window.open(googleMapsUrl, "_blank");

      // Start live tracking after the trip starts
      setIsTracking(true);
      locationInterval = setInterval(() => {
        fetchCurrentLocation();
      }, 5000);
    } else {
      setError(
        "Please set both source and destination before starting the trip."
      );
    }
  };

  const calculateDistance = (point1, point2) => {
    const rad = (x) => (x * Math.PI) / 180;
    const R = 6371e3; // Earth's radius in meters
    const lat1 = rad(point1.lat);
    const lat2 = rad(point2.lat);
    const deltaLat = rad(point2.lat - point1.lat);
    const deltaLng = rad(point2.lng - point1.lng);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLng / 2) *
        Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  if (error) return <div style={{ color: "red" }}>{error}</div>;

  const openMenu = () => {
    document.querySelector("ion-menu")?.open();
  };

  return (
    <>
      <Sidebar />
      <IonPage>
        <IonContent id="main-content">
          <div className="container">
            <div className="header">
              <IonButton
                onClick={openMenu}
                fill="clear"
                className="menu-button"
              >
                <IonIcon icon={menuOutline} />
              </IonButton>
              <h1 className="title">Ambulance Portal</h1>
            </div>
            {/* Source - Destination Inputs */}
            <div className="input-container">
              <IonList className="input-list" style={{ background: "white" }}>
                <IonItem lines="none" className="input-box">
                  <IonInput
                    ref={sourceRef}
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
                    ref={destinationRef}
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
                <IonIcon
                  onClick={fetchCurrentLocation}
                  className="locate-icon"
                  icon={locate}
                />
              </div>
              <button className="route-button" onClick={calculateRoute}>
                Show Route
              </button>
              <button onClick={handleStartTrip} className="start-button">
                Start
              </button>
            </div>

            {/* Display and Duration */}
            <div className="dd-container">
              <p>Duration: {duration}</p>
              <p>Distance: {distance}</p>
            </div>

            {/* Map Display */}
            <div className="map-container">
              <GoogleMap
                id="map"
                mapContainerStyle={containerStyle}
                center={center}
                zoom={6}
                onLoad={(mapInstance: any) => setMap(mapInstance)}
                options={{ gestureHandling: "greedy" }}
              >
                {sourceMarker && (
                  <Marker position={sourceMarker.getPosition()} />
                )}
                {destinationMarker && (
                  <Marker position={destinationMarker.getPosition()} />
                )}
                {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            </div>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default AmbulanceMainPage;
