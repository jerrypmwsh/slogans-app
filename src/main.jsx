import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@mui/material";
import { appTheme } from "./Theme";
import { Auth0Provider } from "@auth0/auth0-react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import NavBar from "./NavBar";
import Slogans from "./slogans/Slogans";
import SloganDetail from "./slogans/SloganDetail";
import SloganCreate from "./slogans/SloganCreate";

const Layout = () => (
  <div>
    <header>
      <NavBar />
    </header>
    <Outlet
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignContent: "center",
        minHeight: "50vh",
        gap: 2,
        maxWidth: "50vh",
      }}
    />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/slogans-app",
    element: <LoginPage></LoginPage>,
  },
  {
    element: <Layout />,
    children: [
      // {
      //   path: "/slogans-app/slogans",
      //   element: <App />,
      // },
      {
        path: "/slogans-app/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/slogans-app/slogans",
        element: <Slogans />,
      },
      {
        path: "/slogans-app/slogans/new",
        element: <SloganCreate />,
      },
      {
        path: "/slogans-app/slogans/:id",
        element: <SloganDetail />,
      },
    ],
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
