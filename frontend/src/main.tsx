import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(
    // <React.StrictMode>
    <App />
    //</React.StrictMode>
  );
} else {
  console.error(
    "Root element not found. Ensure there is an element with id 'root' in your HTML."
  );
}
