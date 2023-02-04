import React from "react";
import { Avatar } from "@mui/material";
import Button from "@mui/material/Button";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = ({ img, alt }) => {
  const { logout } = useAuth0();
  return (
    <Button
      variant="contained"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
      startIcon={<Avatar src={img}></Avatar>}
      alt={alt}
    ></Button>
  );
};

export default LogoutButton;
