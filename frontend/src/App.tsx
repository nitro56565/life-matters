import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import {
  AndroidSettings,
  IOSSettings,
  NativeSettings,
} from "capacitor-native-settings";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/flex-utils.css";

/* Theme variables */
import "./theme/variables.css";

/* Lazy-loaded pages */
const Home = lazy(() => import("./pages/Home/Home"));
const SignIn = lazy(() => import("./components/SignIn/SignIn"));
const AmbulanceMainPage = lazy(
  () => import("./pages/Ambulance-Main-Page/AmbulanceMainPage")
);
const ForgotPassword = lazy(
  () => import("./pages/Forgot-Password-Page/ForgotPasswordPage")
);
const SetNewPassword = lazy(
  () => import("./pages/set-new-password/SetNewPasswordPage")
);
const TrafficPoliceSignUp = lazy(
  () => import("./pages/Traffic-Police-SignUp/TrafficPoliceSignUp")
);
const AmbulanceSignUp = lazy(
  () => import("./pages/Ambulance-SignUp/AmbulanceSignUp")
);

setupIonicReact();

export const enableGps = async () => {
  try {
    if (Capacitor.getPlatform() === "android") {
      await NativeSettings.open({
        optionAndroid: AndroidSettings.Location,
        optionIOS: IOSSettings.About,
      });
    } else if (Capacitor.getPlatform() === "ios") {
      await NativeSettings.open({
        optionIOS: IOSSettings.App,
        optionAndroid: AndroidSettings.Accessibility,
      });
    } else {
      console.error("Unsupported platform");
    }
  } catch (error) {
    console.error("Error opening location settings:", error);
  }
};

const App = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Load Google Maps API
  const loadGoogleMapsApi = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
        return;
      }

      const existingScript = document.querySelector(
        `script[src^="https://maps.googleapis.com/maps/api/js"]`
      );
      if (existingScript) {
        existingScript.addEventListener("load", () =>
          resolve(window.google.maps)
        );
        existingScript.addEventListener("error", () =>
          reject(new Error("Failed to load Google Maps API"))
        );
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&libraries=places,routes,geometry&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google.maps);
      script.onerror = (error) => reject(error);

      document.head.appendChild(script);
    });
  };

  // Request Location Permission
  const requestLocationPermission = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        console.log("Native platform detected");
        const hasPermission = await Geolocation.checkPermissions();
        console.log("Has permission:", hasPermission);
        if (hasPermission.location !== "granted") {
          console.log("Requesting location permission...");
          const permission = await Geolocation.requestPermissions();
          console.log("Permission response:", permission);
          if (permission.location !== "granted") {
            await openSettings(true);
            return;
          }
        }
      } else {
        if (!("geolocation" in navigator)) {
          console.error("Geolocation is not available in this browser.");
          return;
        }

        console.log("Web platform detected, attempting to get location...");
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Location obtained:", position);
          },
          (error) => {
            console.error("Error obtaining location:", error);
          },
          { enableHighAccuracy: true }
        );
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
    }
  };

  const openSettings = (app = false) => {
    console.log("open settings...");
    return NativeSettings.open({
      optionAndroid: app
        ? AndroidSettings.ApplicationDetails
        : AndroidSettings.Location,
      optionIOS: app ? IOSSettings.App : IOSSettings.LocationServices,
    });
  };

  useLayoutEffect(() => {
    requestLocationPermission();
  });

  useEffect(() => {
    if (Capacitor.getPlatform() === "android") {
      enableGps();
    }
    loadGoogleMapsApi()
      .then(() => {
        console.log("Google Maps API loaded successfully");
        setIsMapLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to load Google Maps API:", error);
        alert("Failed to load maps. Please try again later.");
      });
  }, []);

  if (!isMapLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Suspense fallback={<div>Loading...</div>}>
            <Route exact path="/home" component={Home} />
            <Route exact path="/" render={() => <Redirect to="/home" />} />
            <Route exact path="/ambulance-signin">
              <SignIn
                apiEndpoint="/api/ambulance/signin"
                redirectUrl="/ambulance-home"
                signupLink="/ambulancesignup"
              />
            </Route>
            <Route exact path="/trafficpolice-signin">
              <SignIn
                apiEndpoint="/api/trafficpolice/signin"
                redirectUrl="/trafficpolice-home"
                signupLink="/trafficpolicesignup"
              />
            </Route>
            <Route exact path="/ambulance-home" component={AmbulanceMainPage} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/set-new-password" component={SetNewPassword} />
            <Route
              exact
              path="/trafficpolicesignup"
              component={TrafficPoliceSignUp}
            />
            <Route exact path="/ambulancesignup" component={AmbulanceSignUp} />
          </Suspense>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
