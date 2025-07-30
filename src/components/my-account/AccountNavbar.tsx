import { Button, CircularProgress, Divider, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useSignOut } from "../../hooks/auth";

export default function AccountNavbar() {
  const location = useLocation();
  const pathname = location.pathname;

  const pathSegments = pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];

  const { signout, isPending } = useSignOut();

  const navigate = useNavigate();

  const handleSignOut = () => {
    signout();
  };

  return (
    <Paper className="p-4 flex flex-col gap-y-2">
      <Button
        sx={{
          justifyContent: "start",
          backgroundColor:
            lastSegment === "account" ? "action.hover" : "transparent",
        }}
        fullWidth
        color="inherit"
        onClick={() => navigate("/account")}
      >
        My Account
      </Button>
      <Divider />
      <Button
        sx={{
          justifyContent: "start",
          backgroundColor:
            lastSegment === "change-password" ? "action.hover" : "transparent",
        }}
        fullWidth
        color="inherit"
        onClick={() => navigate("/account/change-password")}
      >
        Change password
      </Button>
      <Divider />
      <Button
        sx={{
          justifyContent: "start",
          backgroundColor:
            lastSegment === "my-posts" ? "action.hover" : "transparent",
        }}
        fullWidth
        color="inherit"
        onClick={() => navigate("/account/my-posts")}
      >
        My posts
      </Button>
      <Divider />
      <Button
        sx={{
          justifyContent: "start",
          backgroundColor:
            lastSegment === "notifications" ? "action.hover" : "transparent",
        }}
        fullWidth
        color="inherit"
        onClick={() => navigate("/account/notifications")}
      >
        Notifications
      </Button>
      <Divider />
      <Button
        onClick={handleSignOut}
        disabled={isPending}
        startIcon={isPending ? <CircularProgress size={16} /> : undefined}
        variant="outlined"
        fullWidth
        color="inherit"
      >
        Sign out
      </Button>
    </Paper>
  );
}
