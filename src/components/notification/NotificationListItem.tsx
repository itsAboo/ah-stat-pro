import {
  Avatar,
  Box,
  Button,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import { formatTimeAgo } from "../../util/time";
import { Close } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import { AccessRequest, Notification } from "../../types";
import { useRejectAccessRequest } from "../../hooks/access-request";
import { useCreatePostAccess } from "../../hooks/post-access";

interface NotificationListItemProps {
  notification: Notification;
  accessesRequest: AccessRequest[];
  userId: string;
}

export default function NotificationListItem({
  notification,
  accessesRequest,
  userId,
}: NotificationListItemProps) {
  const { mutate: createPostAccess, isPending: isCreatePostAccessPending } =
    useCreatePostAccess({ userId });

  const {
    mutate: rejectAccessRequest,
    isPending: isRejectAccessRequestPending,
  } = useRejectAccessRequest(userId);

  const handleCreateAccessRequest = (
    postId: string,
    requesterId: string,
    accessRequestId: string
  ) => {
    createPostAccess({ postId, requesterId, accessRequestId });
  };

  const handleRejectAccessRequest = (accessRequestId: string) => {
    rejectAccessRequest(accessRequestId);
  };

  const access = accessesRequest?.find(
    (a) =>
      a.id === notification.accessRequest?.id &&
      a.receiverId === notification.recipientId
  );

  return (
    <ListItem key={notification.id} disablePadding>
      <ListItemButton
        disableRipple
        sx={{
          p: 0.75,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          borderRadius: "4px",
        }}
      >
        <ListItemIcon>
          <Avatar>{notification.sender.charAt(0).toUpperCase()}</Avatar>
        </ListItemIcon>
        <Box>
          <p className="leading-tight line-clamp-3">
            {notification.type === "access_request" && (
              <span className="font-semibold">{notification.sender}</span>
            )}{" "}
            {notification.message}
          </p>
          {notification.accessRequest?.status === "pending" ||
          (access && access.status === "pending") ? (
            <div className="flex gap-2 my-2">
              <Button
                disabled={
                  isCreatePostAccessPending || isRejectAccessRequestPending
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateAccessRequest(
                    access?.postId || notification.accessRequest.postId,
                    access?.requesterId ||
                      notification.accessRequest.requesterId,
                    access?.id || notification.accessRequest.id
                  );
                }}
                size="small"
                variant="contained"
              >
                Accept
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRejectAccessRequest(
                    access?.id || notification.accessRequest.id
                  );
                }}
                disabled={
                  isRejectAccessRequestPending || isCreatePostAccessPending
                }
              >
                Decline
              </Button>
            </div>
          ) : access?.status === "approved" ? (
            <p className="italic">
              Approved <CheckIcon color="success" fontSize="small" />
            </p>
          ) : access?.status === "rejected" ? (
            <p>
              Rejected <Close color="error" fontSize="small" />
            </p>
          ) : null}
          <p className="line-clamp-1 text-sm">
            <span className="text-primary text-base font-semibold">
              {formatTimeAgo(notification.createdAt)}
            </span>{" "}
            <span className="text-muted">{notification.source.post.title}</span>
          </p>
        </Box>
      </ListItemButton>
    </ListItem>
  );
}
