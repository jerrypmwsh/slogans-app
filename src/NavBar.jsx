import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Profile from "./Profile";
import { Box, Button, Link as MLink } from "@mui/material";

import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Slogans
        </Typography>
        <Box>
          <Button color="inherit">
            <MLink component={Link} to="/slogans-app/slogans" color="inherit">
              slogans
            </MLink>
          </Button>
          <Button color="inherit">
            <MLink component={Link} to="/slogans-app/dashboard" color="inherit">
              dashboard
            </MLink>
          </Button>
        </Box>
        <Profile></Profile>
      </Toolbar>
    </AppBar>
  );
}
