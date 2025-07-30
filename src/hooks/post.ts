import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPost,
  deletePost,
  editPost,
  getMyPosts,
  getPost,
  getPosts,
} from "../api/post";
import { useParams } from "react-router-dom";
import { useSnackbar } from "../context/SnackbarContext";
import { getToken } from "../util/auth";

export const useCreatePost = ({ onSuccess }: { onSuccess: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onSuccess();
    },
  });
};

export const useGetPosts = ({
  maxPerPage,
  page,
}: {
  maxPerPage?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["posts", maxPerPage, page],
    queryFn: ({ signal }) => getPosts({ signal, maxPerPage, page }),
  });
};

export const useGetPost = () => {
  const params = useParams();
  const id = params.postId as string;
  return useQuery({
    queryKey: ["post", id],
    queryFn: ({ signal }) => getPost({ id, signal }),
    notifyOnChangeProps: "all",
    retry : false
  });
};

export const useGetMyPosts = ({
  page,
  maxPerPage,
}: {
  page?: number;
  maxPerPage?: number;
}) => {
  return useQuery({
    queryKey: ["my-posts",maxPerPage,page],
    queryFn: ({ signal }) => getMyPosts({ signal, page, maxPerPage }),
    enabled: !!getToken(),
    retry: false,
  });
};

export const useEditPost = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();
  return useMutation({
    mutationFn: editPost,
    onMutate: async (data) => ({ postId: data.postId }),
    onSuccess: (data, __, context) => {
      queryClient.invalidateQueries({ queryKey: ["post", context.postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      snackbar({
        autoHideDuration: 3000,
        message: data.message || "Updated post successfully",
      });
      options?.onSuccess?.();
    },
  });
};

export const useDeletePost = (option?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();

  return useMutation({
    mutationFn: deletePost,
    onMutate: async (data) => ({ postId: data.postId }),
    onSuccess: (data, _, context) => {
      queryClient.setQueryData(["post", context.postId], undefined);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      snackbar({
        autoHideDuration: 3000,
        message: data.message || "Deleted post successfully",
      });
      option?.onSuccess?.();
    },
  });
};
