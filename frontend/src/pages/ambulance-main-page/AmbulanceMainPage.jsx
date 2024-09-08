import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, Autocomplete, useJsApiLoader, DirectionsRenderer } from "@react-google-maps/api";
import { FaTimes } from "react-icons/fa";
import currentlocationImg  from "../../assets/current-location-icon.svg";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const libraries = ["places"];

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const AmbulanceMainPage = () => {
  const [map, setMap] = useState(null);
  const [sourceLatLng, setSourceLatLng] = useState(null);
  const [destinationLatLng, setDestinationLatLng] = useState(null);
  const [sourceInput, setSourceInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [distance, setDistance] = useState("")
  const [duration, setDuration] = useState("")
  const [directionResponse, setDirectionResponse] = useState(null)
  const sourceRef = useRef();
  const destinationRef = useRef();
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const sourceMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const isLatLngFormat = (input) => {
    const latLngPattern = /^\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*$/;
    return latLngPattern.test(input);
  };

  const parseLatLng = (input) => {
    if (isLatLngFormat(input)) {
      const [lat, lng] = input.split(',').map(Number);
      return new google.maps.LatLng(lat, lng);
    }
    return null;
  };

  const handlePlaceChange = (ref, setLatLng, setInput) => {
    const place = ref.current.getPlace();
    if (place.geometry) {
      const location = place.geometry.location;
      setLatLng(location);
      setInput(place.formatted_address || `${location.lat()},${location.lng()}`);
    }
  };

  const handleInputChange = (input, setLatLng, setInput) => {
    setInput(input);
    const latLng = parseLatLng(input);
    if (latLng) {
      setLatLng(latLng);
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
            console.log(result);
            setDirectionResponse(result)
            setDistance(result.routes[0].legs[0].distance.text)
            setDuration(result.routes[0].legs[0].duration.text)
          } else {
            console.error(`Directions request failed due to ${status}`);
          }
        }
      );
    }
  };
  
  const clearRoute = () => {
    setDirectionResponse(null)
    setDistance(null)
    setDuration(null)
    sourceRef.current.value = ''
    destinationRef.current.value = ''
  }

  useEffect(() => {
    if (map) {
      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer();
      directionsRendererRef.current.setMap(map);
    }
  }, [map]);

  useEffect(() => {
    if (sourceMarkerRef.current) {
      sourceMarkerRef.current.setMap(null);
    }
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.setMap(null);
    }

    if (map && sourceLatLng) {
      sourceMarkerRef.current = new google.maps.Marker({
        map,
        position: sourceLatLng,
        title: "Source",
      });
    }

    if (map && destinationLatLng) {
      destinationMarkerRef.current = new google.maps.Marker({
        map,
        position: destinationLatLng,
        title: "Destination",
      });
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

  const gotLocation = (userLocation) => {
    console.log("User Location is ", userLocation);
    const locationStr = `${userLocation.coords.latitude},${userLocation.coords.longitude}`;
    const latLng = new google.maps.LatLng(userLocation.coords.latitude, userLocation.coords.longitude);
    setSourceInput(locationStr);
    setSourceLatLng(latLng);
    if (map) {
      map.setCenter(latLng);
      map.setZoom(15);
    }
  };

  const errorLocation = () => {
    console.log("Some Error while getting user location");
  };

  const currentLocation = () => {
    navigator.geolocation.getCurrentPosition(gotLocation, errorLocation);
  };

  return (
    <div className="scroll-smooth container mx-auto p-4">
      <h1 className="text-xl font-bold text-center mb-6 font-poppins text-[#7326F1]">
        Ambulance Portal
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
        <div>
          <Autocomplete
            onLoad={(autocomplete) => (sourceRef.current = autocomplete)}
            onPlaceChanged={() => handlePlaceChange(sourceRef, setSourceLatLng, setSourceInput)}
          >
            <input
              type="text"
              placeholder="Enter source"
              value={sourceInput}
              onChange={(e) => handleInputChange(e.target.value, setSourceLatLng, setSourceInput)}
              className="w-full p-1 border border-gray-300 rounded font-poppins"
              ref={sourceRef}
            />
          </Autocomplete>
        </div>
        <div>
          <Autocomplete
            onLoad={(autocomplete) => (destinationRef.current = autocomplete)}
            onPlaceChanged={() => handlePlaceChange(destinationRef, setDestinationLatLng, setDestinationInput)}
          >
            <input
              type="text"
              placeholder="Enter destination"
              value={destinationInput}
              onChange={(e) => handleInputChange(e.target.value, setDestinationLatLng, setDestinationInput)}
              className="w-full p-1 border border-gray-300 rounded font-poppins"
              ref={destinationRef}
            />
          </Autocomplete>
        </div>
      </div>
      <div className="flex justify-between gap-10 mb-3 font-poppins">
        <p>Duration:{duration}</p>
        <p>Distance:{distance}</p>
        <button onClick={clearRoute}> <FaTimes/></button>
      </div>
      <div className="flex gap-2 justify-center items-center">
        <img src={currentlocationImg} className=" cursor-pointer w-10 h-10" alt="Current Location" onClick={currentLocation} />
        <button
          onClick={handleRoute}
          className="w-full bg-[#7326F1] text-white py-2 px-4 rounded font-poppins"
        >
          Show Route
        </button>
        <button className="w-full bg-[#7326F1] text-white py-2 px-4 rounded font-poppins">
          Start
        </button>
      </div>
      <div className="scroll-smooth overflow-y-auto h-screen border border-gray-300 rounded mt-6">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          {directionResponse && <DirectionsRenderer directions={directionResponse} />}
        </GoogleMap>
      </div>
    </div>
  );
};

export default AmbulanceMainPage;