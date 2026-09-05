import { startTelemetry } from "./telemetry";
import { apiBaseUrl, appId, appSlug } from "./config";
import { installGlobalImageFallbacks } from "./utils/imageFallback";
import { installPasswordFieldEnhancer } from "./utils/passwordFieldEnhancer";
import { installPeterWhatsappFallback } from "./utils/peterWhatsappFallback";
import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App";
import PeterAccountGateway from "./components/PeterAccountGateway";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/nexus-mobile-nav.css";

installGlobalImageFallbacks();
installPasswordFieldEnhancer();
installPeterWhatsappFallback();
startTelemetry({ apiBaseUrl, appSlug, appId });

axios.defaults.headers.common["X-Peter-App"] = appSlug;
axios.defaults.headers.common["X-App-ID"] = String(appId);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <PeterAccountGateway apiBaseUrl={apiBaseUrl} appSlug={appSlug}>
        <App />
      </PeterAccountGateway>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
