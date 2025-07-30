import { MoreVert, Notifications } from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  Popover,
  Skeleton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Notification } from "../../types";

import { useMarkNotificationsAllAsRead } from "../../hooks/notification";
import { useGetAccessesRequest } from "../../hooks/access-request";
import NotificationListItem from "./NotificationListItem";

interface NotificationButtonProps {
  notifications: Notification[] | [];
  userId: string;
}

export default function NotificationButton(props: NotificationButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const { mutate: markAllAsRead } = useMarkNotificationsAllAsRead(props.userId);
  const { data: accessesRequest, isLoading: isGetAccessesLoading } =
    useGetAccessesRequest();

  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (unreadNotifications.length > 0) {
      markAllAsRead();
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    setAnchorEl(null);
    navigate(path);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  const transformedNotifications = props.notifications
    .map((notification) => ({
      ...notification,
      message:
        notification.type === "access_request"
          ? notification.message.split(" ").slice(1).join(" ")
          : notification.message,
    }))
    .slice(0, 7);

  const unreadNotifications = props.notifications.filter(
    (notification) => !notification.isRead
  );

  if (isGetAccessesLoading) {
    return <Skeleton variant="circular" width={48} height={48} />;
  }

  const NotificationPopover = (
    <Popover
      sx={{ mt: 0.5 }}
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Box sx={{ width: "345px", maxHeight: "80vh", p: 1.5 }}>
        <div className="py-1 mb-2 flex justify-between items-center">
          <h1 className="font-semibold text-2xl">Notifications</h1>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
        <Divider />
        {transformedNotifications && transformedNotifications.length > 0 ? (
          <List>
            {transformedNotifications.map((notification) => {
              return (
                <NotificationListItem
                  accessesRequest={accessesRequest!}
                  notification={notification}
                  userId={props.userId}
                  key={notification.id}
                />
              );
            })}
          </List>
        ) : (
          <p className="text-muted italic text-center my-2">
            You have no notifications at the moment
          </p>
        )}
        <Button
          onClick={() => handleNavigate("/account/notifications")}
          sx={{ my: 1 }}
          fullWidth
          variant="contained"
        >
          See all notifications
        </Button>
      </Box>
    </Popover>
  );

  return (
    <>
      <IconButton
        sx={{
          backgroundColor: "#1976d2",
          "&:hover": {
            backgroundColor: "#1565c0",
          },
        }}
        onClick={handleClick}
      >
        <Badge
          badgeContent={
            (unreadNotifications.length > 7
              ? "7+"
              : unreadNotifications.length) || 0
          }
          color="error"
        >
          <Notifications sx={{ color: "white", width: 32, height: 32 }} />
        </Badge>
      </IconButton>
      {NotificationPopover}
    </>
  );
}
