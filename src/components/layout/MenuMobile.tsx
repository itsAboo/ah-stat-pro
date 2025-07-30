import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useContext, useState } from "react";
import {
  AccountCircle,
  Article,
  Close,
  DarkMode,
  Home,
  LightMode,
  Login,
  Logout,
  Notifications,
  PersonAdd,
} from "@mui/icons-material";
import { ThemeContext } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { User } from "../../types";
import { useSignOut } from "../../hooks/auth";

export default function MenuMobile({
  user,
}: {
  user: User | undefined | null;
}) {
  const [open, setOpen] = useState(false);

  const { signout } = useSignOut();

  const themeCtx = useContext(ThemeContext);

  const navigate = useNavigate();

  if (!themeCtx) return null;

  const { toggleDarkMode, darkMode } = themeCtx;

  const toggleDrawer = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleNavigate = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const handleSignOut = () => {
    signout();
    setOpen(false);
  };

  const DrawerList = (
    <Box
      sx={{
        width: {
          xs: "100vw",
          sm: "250px",
        },
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      role="presentation"
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigate("/")}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItemButton>
        </ListItem>
        {user ? (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigate("/account")}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText>Account</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigate("/account/my-posts")}
              >
                <ListItemIcon>
                  <Article />
                </ListItemIcon>
                <ListItemText>My posts</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigate("/account/notifications")}
              >
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText>Notifications</ListItemText>
              </ListItemButton>
            </ListItem>
          </>
        ) : undefined}
        <ListItem disablePadding>
          <ListItemButton onClick={toggleDarkMode}>
            <ListItemIcon>
              {darkMode ? <LightMode /> : <DarkMode />}
            </ListItemIcon>
            <ListItemText>{darkMode ? "Light" : "Dark"} Mode</ListItemText>
          </ListItemButton>
        </ListItem>
        <Divider />
        {!user ? (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigate("/auth/signup")}>
                <ListItemIcon>
                  <PersonAdd />
                </ListItemIcon>
                <ListItemText>Sign up</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigate("/auth/signin")}>
                <ListItemIcon>
                  <Login />
                </ListItemIcon>
                <ListItemText>Sign in</ListItemText>
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={handleSignOut}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText>Sign out</ListItemText>
            </ListItemButton>
          </ListItem>
        )}
      </List>

      <div className="w-full flex justify-center mb-5">
        <IconButton onClick={() => toggleDrawer(false)}>
          <Close />
        </IconButton>
      </div>
    </Box>
  );
  return (
    <>
      <IconButton onClick={() => toggleDrawer(true)}>
        <MenuIcon fontSize="large" sx={{ color: "white" }} />
      </IconButton>
      <Drawer keepMounted={false} anchor="right" open={open} onClose={() => toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  );
}
