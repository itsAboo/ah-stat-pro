import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAccessesRequest,
  rejectAccessRequest,
  sendAccessRequest,
} from "../api/access-request";
import { useSnackbar } from "../context/SnackbarContext";
import { getToken } from "../util/auth";
import { useUser } from "./auth";

export const useSendAccessRequest = () => {
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();
  return useMutation({
    mutationFn: sendAccessRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-request"] });
      snackbar({
        autoHideDuration: 3000,
        message: "Request sent successfully",
      });
    },
  });
};

export const useGetAccessesRequest = () => {
  const { data } = useUser();
  return useQuery({
    queryKey: ["access-request"],
    queryFn: getAccessesRequest,
    retry: false,
    enabled: !!getToken() && !!data,
  });
};

export const useRejectAccessRequest = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectAccessRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
      queryClient.invalidateQueries({
        queryKey: ["access-request"],
      });
    },
  });
};
