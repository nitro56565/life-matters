import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApuBvHD6LbukzdA5j6h1su9Ho69lJSDK0",
  authDomain: "life-matters-430518.firebaseapp.com",
  projectId: "life-matters-430518",
  storageBucket: "life-matters-430518.firebasestorage.app",
  messagingSenderId: "953695564974",
  appId: "1:953695564974:web:a8378e4e4b0728804a293f",
  measurementId: "G-G5ECQPNLH6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const setUpRecaptcha = () => {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
    callback: (response) => {
      console.log("reCAPTCHA verified", response);
    },
  });
};

export {setUpRecaptcha, auth, signInWithPhoneNumber}
