import { Article, Logout, Notifications, Settings } from "@mui/icons-material";
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "../../hooks/auth";

export default function AccountButton({ username }: { username: string }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { signout } = useSignOut();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    setAnchorEl(null);
    navigate(path);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignout = () => {
    setAnchorEl(null);
    signout();
  };

  const AccountMenu = (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "inherit",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem onClick={() => handleNavigate("/account")}>
        <Avatar /> My account
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => handleNavigate("/account/my-posts")}>
        <ListItemIcon>
          <Article fontSize="small" />
        </ListItemIcon>
        My Posts
      </MenuItem>
      <MenuItem onClick={() => handleNavigate("/account/notifications")}>
        <ListItemIcon>
          <Notifications fontSize="small" />
        </ListItemIcon>
        Notifications
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        Settings
      </MenuItem>
      <MenuItem onClick={handleSignout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Sign out
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          backgroundColor: "#1976d2",
          "&:hover": {
            backgroundColor: "#1565c0",
          },
        }}
      >
        <Avatar sx={{ width: 32, height: 32 }}>
          {username.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      {AccountMenu}
    </>
  );
}
