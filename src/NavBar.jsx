import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'
import Profile from './Profile'

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function NavBar (){
    return (
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Slogans
              </Typography>
                <Profile></Profile>
                <LoginButton></LoginButton>
                <LogoutButton></LogoutButton>
            </Toolbar>
          </AppBar>

      );
}