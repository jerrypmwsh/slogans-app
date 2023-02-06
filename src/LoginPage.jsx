import { useAuth0 } from "@auth0/auth0-react";
import { Avatar, Grid, Paper } from "@mui/material";
import { Navigate } from "react-router-dom";
import LoginButton from "./LoginButton";

export default function LoginPage() {
  const { isAuthenticated } = useAuth0();
  if (isAuthenticated) {
    return <Navigate to="/slogans-app/slogans" />;
  }
  return (
    <Paper elevation={10} square={false}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Avatar
          variant="circular"
          src={`${window.location.origin}/slogans-app/logo.png`}
          style={{ width: "20%", height: "20%" }}
        />
        <LoginButton></LoginButton>
      </Grid>
    </Paper>
  );
}
