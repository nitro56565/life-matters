import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: '100%',
  height: '550px',
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const AmbulanceMainPage = () => {
  const [map, setMap] = useState(null);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [sourceLatLng, setSourceLatLng] = useState(null);
  const [destinationLatLng, setDestinationLatLng] = useState(null);

  const sourceRef = useRef(null);
  const destinationRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);

  const handlePlaceChange = (place, setLatLng) => {
    const location = place.geometry.location;
    setLatLng({ lat: location.lat(), lng: location.lng() });
  };

  const handleRoute = () => {
    if (directionsServiceRef.current && sourceLatLng && destinationLatLng) {
      directionsServiceRef.current.route(
        {
          origin: sourceLatLng,
          destination: destinationLatLng,
          travelMode: 'DRIVING',
        },
        (result, status) => {
          if (status === 'OK') {
            directionsRendererRef.current.setDirections(result);
          } else {
            console.error(`Directions request failed due to ${status}`);
          }
        }
      );
    }
  };

  useEffect(() => {
    if (map) {
      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer();
      directionsRendererRef.current.setMap(map);
    }
  }, [map]);

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold text-center mb-6 font-poppins text-[#7326F1]">
          Ambulance Portal
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
          <div>
            <Autocomplete
              onLoad={(autocomplete) => (sourceRef.current = autocomplete)}
              onPlaceChanged={() => {
                const place = sourceRef.current.getPlace();
                handlePlaceChange(place, setSourceLatLng);
                setSource(place.formatted_address);
              }}
            >
              <input
                type="text"
                placeholder="Enter source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full p-1 border border-gray-300 rounded font-poppins"
              />
            </Autocomplete>
          </div>
          <div>
            <Autocomplete
              onLoad={(autocomplete) => (destinationRef.current = autocomplete)}
              onPlaceChanged={() => {
                const place = destinationRef.current.getPlace();
                handlePlaceChange(place, setDestinationLatLng);
                setDestination(place.formatted_address);
              }}
            >
              <input
                type="text"
                placeholder="Enter destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-1 border border-gray-300 rounded font-poppins"
              />
            </Autocomplete>
          </div>
        </div>
        <button
          onClick={handleRoute}
          className="w-full bg-[#7326F1] text-white py-2 px-4 rounded font-poppins"
        >
          Show Route
        </button>
        <div className="border border-gray-300 rounded mt-6">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={(mapInstance) => setMap(mapInstance)}
          >
            {sourceLatLng && <Marker position={sourceLatLng} label="Source" />}
            {destinationLatLng && (
              <Marker position={destinationLatLng} label="Destination" />
            )}
          </GoogleMap>
        </div>
      </div>
    </LoadScript>
  );
};

export default AmbulanceMainPage;
