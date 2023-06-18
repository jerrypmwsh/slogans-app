import React from "react";
import LoginButton from "./LoginButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

const Profile = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return !isAuthenticated ? (
    <LoginButton></LoginButton>
  ) : (
    <Box>
      <IconButton onClick={handleOpenUserMenu}>
        <Avatar src={user.picture} alt={user.name}></Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem
          onClick={() =>
            logout({
              logoutParams: {
                returnTo: `${window.location.origin}/slogans-app/`,
              },
            })
          }
        >
          <Button>
            <LogoutIcon fontSize="sm" />
            <Typography textAlign="center" variant="caption">
              logout
            </Typography>
          </Button>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Profile;
