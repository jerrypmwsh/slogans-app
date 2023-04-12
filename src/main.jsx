import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@mui/material";
import { appTheme } from "./Theme";
import { Auth0Provider } from "@auth0/auth0-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";

const router = createBrowserRouter([
  {
    path: "/slogans-app",
    element: <LoginPage></LoginPage>,
  },
  {
    path: "/slogans-app/slogans",
    element: <App />,
  },
  {
    path: "/slogans-app/dashboard",
    element: <Dashboard />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="slogans.auth0.com"
      clientId="KvRHjbjqF7kjvpm3jnXixUcazvGbVO7k"
      authorizationParams={{
        audience: "https://tresosos.com/slogans",
        redirect_uri: `${window.location.origin}/slogans-app/`,
      }}
    >
      <ThemeProvider theme={appTheme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Auth0Provider>
  </React.StrictMode>
);
