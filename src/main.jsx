import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider, Box } from "@mui/material";
import { appTheme } from "./Theme";
import { Auth0Provider } from "@auth0/auth0-react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import NavBar from "./NavBar";
import Slogans from "./slogans/Slogans";
import SloganDetail from "./slogans/SloganDetail";
import SloganCreate from "./slogans/SloganCreate";
import Categories from "./categories/Categories";
import CategoryDetail from "./categories/CategoryDetail";

const Layout = () => (
  <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <header>
      <NavBar />
    </header>
    <Box
      component="main"
      sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
    >
      <Outlet />
    </Box>
  </Box>
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
      {
        path: "/slogans-app/categories",
        element: <Categories />,
      },
      {
        path: "/slogans-app/categories/:id",
        element: <CategoryDetail />,
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
  </React.StrictMode>,
);
