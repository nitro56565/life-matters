import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, Autocomplete, useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Define the libraries as a static constant
const libraries = ["places"];

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
  const [sourceLatLng, setSourceLatLng] = useState(null);
  const [destinationLatLng, setDestinationLatLng] = useState(null);

  const sourceRef = useRef(null);
  const destinationRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handlePlaceChange = (ref, setLatLng) => {
    const place = ref.current.getPlace();
    if (place.geometry) {
      const location = place.geometry.location;
      setLatLng({ lat: location.lat(), lng: location.lng() });
    }
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

  // Initialize and set markers
  useEffect(() => {
    if (map && sourceLatLng) {
      const AdvancedMarkerElement = google.maps.marker?.AdvancedMarkerElement;

      if (AdvancedMarkerElement) {
        new AdvancedMarkerElement({
          map,
          position: sourceLatLng,
          title: "Source",
        });
      } else {
        // Fallback to traditional Marker if AdvancedMarkerElement is not available
        new google.maps.Marker({
          map,
          position: sourceLatLng,
          title: "Source",
        });
      }
    }

    if (map && destinationLatLng) {
      const AdvancedMarkerElement = google.maps.marker?.AdvancedMarkerElement;

      if (AdvancedMarkerElement) {
        new AdvancedMarkerElement({
          map,
          position: destinationLatLng,
          title: "Destination",
        });
      } else {
        // Fallback to traditional Marker if AdvancedMarkerElement is not available
        new google.maps.Marker({
          map,
          position: destinationLatLng,
          title: "Destination",
        });
      }
    }
  }, [map, sourceLatLng, destinationLatLng]);

  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold text-center mb-6 font-poppins text-[#7326F1]">
        Ambulance Portal
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        <div>
          <Autocomplete
            onLoad={(autocomplete) => (sourceRef.current = autocomplete)}
            onPlaceChanged={() => handlePlaceChange(sourceRef, setSourceLatLng)}
          >
            <input
              type="text"
              placeholder="Enter source"
              className="w-full p-1 border border-gray-300 rounded font-poppins"
            />
          </Autocomplete>
        </div>
        <div>
          <Autocomplete
            onLoad={(autocomplete) => (destinationRef.current = autocomplete)}
            onPlaceChanged={() => handlePlaceChange(destinationRef, setDestinationLatLng)}
          >
            <input
              type="text"
              placeholder="Enter destination"
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
        />
      </div>
    </div>
  );
};

export default AmbulanceMainPage;