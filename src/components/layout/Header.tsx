import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { Button, Skeleton } from "@mui/material";
import { useUser } from "../../hooks/auth";
import AccountButton from "../UI/AccountButton";
import MenuMobile from "./MenuMobile";
import NotificationButton from "../notification/NotificationButton";
import { useSocket } from "../../context/SocketContext";
import { Notification } from "../../types";
import { useGetNotifications } from "../../hooks/notification";
import { useQueryClient } from "@tanstack/react-query";

export default function Header() {
  const { SwitchButton } = useContext(ThemeContext)!;
  const navigate = useNavigate();
  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: notifications, isLoading: isNotificationsLoading } =
    useGetNotifications();

  const queryClient = useQueryClient();

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data: Notification) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });

      if (data.type === "access_request" || data.type === "access_rejected") {
        queryClient.invalidateQueries({ queryKey: ["access-request"] });
      }

      if (data.type === "access_approved") {
        queryClient.invalidateQueries({ queryKey: ["access-request"] });
        queryClient.invalidateQueries({
          queryKey: ["post-accesses", data.recipientId],
        });
      }
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket, notifications, queryClient, user?.id]);

  return (
    <div className="header fixed w-full z-50">
      <div className="max-w-[1024px] h-[70px]  sm:h-[90px] mx-auto px-4 flex justify-between items-center">
        <Link to="/">
          <h1 className="font-bold text-xl sm:text-3xl">AHStatsPro</h1>
        </Link>
        {/* Desktop */}
        <div className="gap-x-4 hidden md:flex items-center">
          <div>{SwitchButton}</div>
          {isUserLoading || isNotificationsLoading ? (
            <>
              <Skeleton variant="circular" width={48} height={48} />
              <Skeleton variant="circular" width={48} height={48} />
            </>
          ) : !user ? (
            <>
              <Button
                onClick={() => navigate("/auth/signin")}
                sx={{ paddingX: 2, marginRight: 2 }}
                color="inherit"
              >
                Sign in
              </Button>
              <Button
                onClick={() => navigate("/auth/signup")}
                sx={{ border: 2 }}
                variant="outlined"
                color="inherit"
              >
                Sign up
              </Button>
            </>
          ) : (
            <>
              <NotificationButton
                userId={user.id}
                notifications={notifications?.notifications || []}
              />
              <AccountButton username={user.username} />
            </>
          )}
        </div>
        {/* Mobile */}
        <div className="flex md:hidden">
          <MenuMobile user={user} />
        </div>
      </div>
    </div>
  );
}
