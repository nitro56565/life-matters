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
} from "@ionic/react";
import { locate, location } from "ionicons/icons";
import { Geolocation } from "@capacitor/geolocation";
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
  const [map, setMap] = useState<any>(null);
  const [sourceMarker, setSourceMarker] = useState<any>(null);
  const [destinationMarker, setDestinationMarker] = useState<any>(null);
  const [directions, setDirections] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const router = useIonRouter();

  const sourceRef = useRef<HTMLIonInputElement | null>(null);
  const destinationRef = useRef<HTMLIonInputElement | null>(null);

  useEffect(() => {
    // Redirect if the user is not authenticated
    if (
      !localStorage.getItem("authToken") &&
      !localStorage.getItem("userType")
    ) {
      router.push("/", "root", "replace");
    }
  }, [router]);

  const fetchCurrentLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      const { latitude, longitude } = position.coords;

      setCurrentLocation({ lat: latitude, lng: longitude });

      if (sourceRef.current) {
        sourceRef.current.value = `${latitude}, ${longitude}`;
      }

      if (sourceMarker) {
        sourceMarker.setMap(null);
      }

      const newSourceMarker = new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map,
        title: "Current Location",
      });
      setSourceMarker(newSourceMarker);

      map.panTo(new window.google.maps.LatLng(latitude, longitude));
    } catch (error) {
      console.error("Error getting location:", error);
      setError("Failed to get current location");
    }
  };

  useEffect(() => {
    const initializeAutocomplete = async () => {
      if (sourceRef.current && destinationRef.current) {
        const sourceInput = await sourceRef.current.getInputElement();
        const destinationInput = await destinationRef.current.getInputElement();

        const sourceAutocomplete = new window.google.maps.places.Autocomplete(
          sourceInput,
          { types: ["geocode"] }
        );
        const destinationAutocomplete =
          new window.google.maps.places.Autocomplete(destinationInput, {
            types: ["geocode"],
          });

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

  const calculateRoute = () => {
    if (sourceMarker && destinationMarker) {
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

          // Extract high-density route points
          const highDensityPoints = route.steps.flatMap((step, stepIndex) =>
            step.path.map((point, pointIndex) => ({
              id: `${stepIndex}-${pointIndex}`, // Unique ID for each point
              lat: point.lat(),
              lng: point.lng(),
            }))
          );

          // Log the high-density points
          console.log("High-density route points:", highDensityPoints);

          // Optionally, set these points to state if you need them elsewhere
          // setRoutePoints(highDensityPoints);
        } else {
          setError("Directions request failed due to " + status);
        }
      });
    }
  };

  const handleStartTrip = () => {
    if (sourceMarker && destinationMarker) {
      const sourceCoords = sourceMarker.getPosition();
      const destinationCoords = destinationMarker.getPosition();

      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${sourceCoords.lat()},${sourceCoords.lng()}&destination=${destinationCoords.lat()},${destinationCoords.lng()}`;

      window.open(googleMapsUrl, "_blank");
    } else {
      setError(
        "Please set both source and destination before starting the trip."
      );
    }
  };

  const logout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userType");
      router.push("/ambulance-signin", "root", "replace");
    }
  };

  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <IonPage>
      <IonContent>
        <div className="container">
          <h1 className="title">Ambulance Portal</h1>

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

          {/* Logout Button */}
          <div className="logout-container">
            <p>Duration: {duration}</p>
            <p>Distance: {distance}</p>
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
            >
              {sourceMarker && <Marker position={sourceMarker.getPosition()} />}
              {destinationMarker && (
                <Marker position={destinationMarker.getPosition()} />
              )}
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AmbulanceMainPage;