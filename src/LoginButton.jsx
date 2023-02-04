import React from "react";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button onClick={() => loginWithRedirect()}>
      <Typography variant="body" component="div" color="secondary">
        Log In
      </Typography>
    </Button>
  );
};

export default LoginButton;
