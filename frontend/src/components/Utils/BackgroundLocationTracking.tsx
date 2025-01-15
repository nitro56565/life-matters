import BackgroundGeolocation from "./BackgroundLocation";

const startBackgroundTracking = async () => {
  try {
    await BackgroundGeolocation.addWatcher(
      {
        backgroundMessage: "Tracking your location in the background",
        backgroundTitle: "Location Tracking",
        requestPermissions: true,
        stale: false,
      },
      (location, error) => {
        if (error) {
          console.error("Error tracking location:", error);
          return;
        }

        const { latitude, longitude } = location;
        console.log("Background Location:", { latitude, longitude });
      }
    );
  } catch (err) {
    console.error("Failed to start background tracking:", err);
  }
};

export default startBackgroundTracking;
