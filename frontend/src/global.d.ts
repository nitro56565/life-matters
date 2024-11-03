// src/global.d.ts
declare module '@react-google-maps/api';
declare global {
  interface Window {
    google: any;
  }
}
