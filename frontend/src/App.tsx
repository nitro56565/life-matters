import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import React, { lazy, Suspense, useEffect, useState } from "react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Minimal CSS utils */
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

setupIonicReact();

const App: React.FC = () => {
  //Map Loading
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const loadGoogleMapsApi = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
        return;
      }

      // Check if script is already present in the document
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

      // Inject the script if not present
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

  useEffect(() => {
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
          </Suspense>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
