import { Plugins, Capacitor } from "@capacitor/core";
const { BackgroundGeolocation } = Plugins;

export const startBackgroundTracking = async () => {
  if (
    Capacitor.getPlatform() === "android" ||
    Capacitor.getPlatform() === "ios"
  ) {
    requestPermissions();
    try {
      const watcherId = await BackgroundGeolocation.addWatcher(
        {
          backgroundMessage: "Cancel to prevent battery drain.",
          backgroundTitle: "Tracking You.",
          requestPermissions: true,
          stale: false,
          distanceFilter: 50,
        },
        (location, error) => {
          if (error) {
            if (error.code === "NOT_AUTHORIZED") {
              if (
                window.confirm(
                  "This app needs your location, but it does not have permission.\n\nOpen settings now?"
                )
              ) {
                BackgroundGeolocation.openSettings();
              }
            }
            return console.error(error);
          }

          // Log or use the location data
          console.log(location);
        }
      );

      // Remove the watcher after a certain timeout, if necessary
      setTimeout(() => {
        BackgroundGeolocation.removeWatcher({ id: watcherId });
      }, 30000); // Example: remove after 30 seconds
    } catch (err) {
      console.error("Error starting background tracking:", err);
    }
  } else {
    console.log("Background geolocation is not available on web.");
  }
};
const requestPermissions = async () => {
  try {
    const permission = await BackgroundGeolocation.checkPermission();
    if (!permission.location) {
      const request = await BackgroundGeolocation.requestPermission();
      if (request.location) {
        console.log("Location permission granted.");
      } else {
        console.log("Location permission denied.");
      }
    } else {
      console.log("Location permission already granted.");
    }
  } catch (err) {
    console.error("Error checking or requesting location permission:", err);
  }
};
