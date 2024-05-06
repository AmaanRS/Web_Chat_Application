import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useNavigate } from "react-router-dom";
import { getToken, logoutUsingCookies } from "../../utils/Auth";
import { getSocket } from "../../context/SocketContext";
import PrimarySearchAppBar from "../AddFriendComponents/SearchBar";
import Dialog from "@mui/material/Dialog";
import { useAddFriend } from "../../context/AddFriendContext";

export default function MenuAppBar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { open, setOpen } = useAddFriend();
  const navigate = useNavigate();
  const socket = getSocket();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const userLogout = async () => {
    try {
      //Get the token from cookie
      const token = await getToken();

      if (!token) {
        console.log("The user was not logged out due to some problem");
      }

      //Emit an socket event
      socket.emit("event:logout", { token: token });

      logoutUsingCookies();

      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
      console.log("Error while logging out");
    }
  };

  return (
    <Box sx={{ flexGrow: 1, border: "0.5px solid grey" }}>
      <AppBar position="static">
        <Toolbar sx={{ flexDirection: "row-reverse" }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <h5>
              <b>{props.email}</b>
            </h5>
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={userLogout}>Logout</MenuItem>
            <MenuItem onClick={handleOpenDialog}>Add Friend</MenuItem>
          </Menu>
          <Dialog open={open} onClose={handleCloseDialog}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseDialog}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <PrimarySearchAppBar />
          </Dialog>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
