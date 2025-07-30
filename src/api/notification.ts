import { Notification } from "../types";
import { notificationApi } from "../lib/axios";

export const getNotifications = async ({
  signal,
  maxPerPage,
  page,
}: {
  signal: AbortSignal;
  maxPerPage?: number;
  page?: number;
}) => {
  const response = await notificationApi.get(
    `/?page=${page}&maxPerPage=${maxPerPage}`,
    { signal }
  );
  return response.data.notifications as {
    notifications: Notification[];
    pageCount?: number;
  };
};

export const markNotificationsAllAsRead = async () => {
  const response = await notificationApi.patch("/mark-all-read");
  return response.data.message;
};
