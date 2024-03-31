import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/Auth';

export default function MenuAppBar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate()

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const addFriend = () =>{
    navigate("/addFriend")
  }

  const userLogout = () =>{
    try {
      const didLogout = logout()

      if(!didLogout || !didLogout.success){
        console.log("The user was not logged out due to some problem")
      }

      console.log(didLogout.message)
      navigate("/",{replace:true})
    } catch (error) {
      console.log(error)
        console.log("Error while logging out")
    }
  }

  return (
    <Box sx={{ flexGrow: 1,border:"0.5px solid grey"}}>
      <AppBar position="static">
        <Toolbar sx={{flexDirection:'row-reverse'}}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
              <h5><b>{props.email}</b></h5>
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {/* <MenuItem onClick={handleClose}>Logout</MenuItem> */}
                <MenuItem onClick={userLogout}>Logout</MenuItem>
                <MenuItem onClick={addFriend}>Add Friend</MenuItem>
              </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
