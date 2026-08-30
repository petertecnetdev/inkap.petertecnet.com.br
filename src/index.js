import { startTelemetry } from "./telemetry";
import { apiBaseUrl, appSlug } from "./config";
import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "bootstrap/dist/css/bootstrap.min.css";

startTelemetry({ apiBaseUrl, appSlug });

axios.defaults.headers.common["X-Peter-App"] = "inkap";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
