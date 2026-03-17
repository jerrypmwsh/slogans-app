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
import Categories from "./categories/Categories";
import Sources from "./sources/Sources";
import { SnackbarProvider } from "notistack";

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
    path: "/",
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
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/slogans",
        element: <Slogans />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },
      {
        path: "/sources",
        element: <Sources />,
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
        redirect_uri: `${window.location.origin}/`,
      }}
    >
      <ThemeProvider theme={appTheme}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <RouterProvider router={router} />
        </SnackbarProvider>
      </ThemeProvider>
    </Auth0Provider>
  </React.StrictMode>,
);
