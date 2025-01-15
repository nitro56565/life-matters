import { Plugins } from "@capacitor/core";
import { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";

const { BackgroundGeolocation } = Plugins as {
  BackgroundGeolocation: BackgroundGeolocationPlugin;
};

export default BackgroundGeolocation;