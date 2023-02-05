import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="slogans.auth0.com"
      clientId="KvRHjbjqF7kjvpm3jnXixUcazvGbVO7k"
      authorizationParams={{
        audience: "https://tresosos.com/slogans",
        redirect_uri: window.location.href,
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
