import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPostAccess,
  deletePostAccess,
  getPostAccessAccepted,
  getPostAccesses,
} from "../api/post-access";
import { getToken } from "../util/auth";
import { useUser } from "./auth";
import { useSnackbar } from "../context/SnackbarContext";

export const useCreatePostAccess = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostAccess,
    onMutate: async (data) => ({ postId: data.postId }),
    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["access-request"],
      });
      queryClient.invalidateQueries({
        queryKey: ["post-access-accepted", context.postId],
      });
    },
  });
};

export const useGetPostAccesses = (userId: string) => {
  const { data: user } = useUser();
  return useQuery({
    queryKey: ["post-accesses", userId],
    queryFn: getPostAccesses,
    enabled: !!getToken() && !!user,
    retry: false,
  });
};

export const useGetPostAccessAccepted = (postId: string) => {
  const { data: user } = useUser();
  return useQuery({
    queryKey: ["post-access-accepted", postId],
    queryFn: ({ signal }) => getPostAccessAccepted({ id: postId, signal }),
    enabled: !!getToken() && !!user,
  });
};

export const useDeletePostAccess = (postId: string) => {
  const { snackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePostAccess,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["post-access-accepted", postId],
      });
      snackbar({
        message: data || "Delete access successfully",
      });
    },
  });
};
