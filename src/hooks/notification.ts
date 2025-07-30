import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "./auth";
import {
  getNotifications,
  markNotificationsAllAsRead,
} from "../api/notification";
import { getToken } from "../util/auth";

export const useGetNotifications = (option?: {
  maxPerPage?: number;
  page?: number;
}) => {
  const { data: user } = useUser();

  return useQuery({
    queryKey: ["notifications", user?.id, option?.maxPerPage, option?.page],
    queryFn: ({ signal }) =>
      getNotifications({
        signal,
        maxPerPage: option?.maxPerPage,
        page: option?.page,
      }),
    enabled: !!getToken() && !!user,
  });
};

export const useMarkNotificationsAllAsRead = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationsAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    },
  });
};
