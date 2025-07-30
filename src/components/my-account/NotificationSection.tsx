import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Pagination,
  Paper,
} from "@mui/material";
import {
  useGetNotifications,
  useMarkNotificationsAllAsRead,
} from "../../hooks/notification";
import { formatTimeAgo } from "../../util/time";
import {
  useGetAccessesRequest,
  useRejectAccessRequest,
} from "../../hooks/access-request";
import { useCreatePostAccess } from "../../hooks/post-access";
import { useUser } from "../../hooks/auth";
import CheckIcon from "@mui/icons-material/Check";
import { Close } from "@mui/icons-material";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import NotificationSectionSkeleton from "../skeleton/my-account/NotificationSectionSkeleton";
export default function NotificationsSection() {
  const [page, setPage] = useState(1);

  const { data: notifications, isLoading: isNotificationsLoading } =
    useGetNotifications({
      maxPerPage: 10,
      page,
    });
  const { data: accessRequests, isLoading: isAccessRequestsLoading } =
    useGetAccessesRequest();
  const { data: user, isLoading: isUserLoading } = useUser();

  const { mutate: createPostAccess, isPending: isCreatePostAccessPending } =
    useCreatePostAccess({ userId: user?.id as string });

  const { mutate: markAllAsRead, isPending: isMarkAllAsReadPending } =
    useMarkNotificationsAllAsRead(user?.id as string);

  const {
    mutate: rejectAccessRequest,
    isPending: isRejectAccessRequestPending,
  } = useRejectAccessRequest(user?.id as string);

  const unreadNotifications = notifications?.notifications.filter(
    (notification) => !notification.isRead
  );

  useEffect(() => {
    if (unreadNotifications && unreadNotifications.length > 0) {
      markAllAsRead();
    }
  }, []);

  const transformedNotifications = useMemo(() => {
    return notifications?.notifications.map((notification) => ({
      ...notification,
      message:
        notification.type === "access_request"
          ? notification.message.split(" ").slice(1).join(" ")
          : notification.message,
    }));
  }, [notifications]);

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

  const handleChangePage = (_: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (
    isNotificationsLoading ||
    isAccessRequestsLoading ||
    isUserLoading ||
    isMarkAllAsReadPending
  ) {
    return <NotificationSectionSkeleton />;
  }

  return (
    <Paper className="p-4">
      <h1 className="text-2xl font-semibold mb-6 text-center">Notifications</h1>
      <Box display="flex" flexDirection="column" gap={2}>
        {transformedNotifications && transformedNotifications.length > 0 ? (
          transformedNotifications.map((notification) => {
            const access = accessRequests?.find(
              (a) =>
                a.id === notification.accessRequest?.id &&
                a.receiverId === notification.recipientId
            );
            return (
              <Card
                key={notification.id}
                sx={{ bgcolor: "appBgContrast.main" }}
              >
                <CardContent sx={{ display: "flex", gap: 2 }}>
                  <Avatar>{notification.sender.charAt(0).toUpperCase()}</Avatar>
                  <div>
                    <p className="line-clamp-2">
                      {notification.type === "access_request" && (
                        <span className="font-semibold">
                          {notification.sender}
                        </span>
                      )}{" "}
                      {notification.message}
                    </p>

                    <p>
                      <span className="text-primary text-base font-semibold">
                        {formatTimeAgo(notification.createdAt)}{" "}
                      </span>
                      <span className="font-semibold">
                        {notification.source.post.title}
                      </span>
                    </p>

                    {notification.accessRequest?.status === "pending" ||
                    (access && access.status === "pending") ? (
                      <div className="flex gap-2 mt-2">
                        <Button
                          disabled={
                            isCreatePostAccessPending ||
                            isRejectAccessRequestPending
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateAccessRequest(
                              access?.postId ||
                                notification.accessRequest.postId,
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
                            isRejectAccessRequestPending ||
                            isCreatePostAccessPending
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
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <p className="text-muted italic text-center">
            You have no notifications at the moment
          </p>
        )}
        <div className="w-full flex justify-center">
          <Pagination
            onChange={handleChangePage}
            count={notifications?.pageCount}
            page={page}
            variant="outlined"
            shape="rounded"
          />
        </div>
      </Box>
    </Paper>
  );
}
