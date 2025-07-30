import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addHandicapMovement,
  addMatch,
  deleteHandicap,
  removeMatches,
  updateMatch,
} from "../api/handicap-movement";
import { useSnackbar } from "../context/SnackbarContext";

export const useAddHandicap = (options?: { onSuccess: () => void }) => {
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();
  return useMutation({
    mutationFn: addHandicapMovement,
    onMutate: async (data) => {
      return { postId: data.postId };
    },
    onSuccess: (data, _, context) => {
      if (context.postId) {
        queryClient.invalidateQueries({ queryKey: ["post", context.postId] });
      }
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      snackbar({
        autoHideDuration: 3000,
        message: data || "Add handicap successfully",
        severity: "success",
      });
      options?.onSuccess();
    },
  });
};

export const useAddMatch = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();
  return useMutation({
    mutationFn: addMatch,
    onMutate: async (data) => ({ postId: data.postId }),
    onSuccess: (data, _, context) => {
      if (context.postId) {
        queryClient.invalidateQueries({ queryKey: ["post", context.postId] });
      }
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      snackbar({
        autoHideDuration: 3000,
        message: data || "Add match successfully",
        severity: "success",
      });
      options?.onSuccess?.();
    },
  });
};

export const useUpdateMatch = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();
  return useMutation({
    mutationFn: updateMatch,
    onMutate: async (data) => ({ postId: data.postId }),
    onSuccess: (data, _, context) => {
      if (context.postId) {
        queryClient.invalidateQueries({ queryKey: ["post", context.postId] });
      }
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      snackbar({
        autoHideDuration: 3000,
        message: data || "Update match successfully",
        severity: "success",
      });
      options?.onSuccess?.();
    },
  });
};

export const useRemoveMatches = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();

  return useMutation({
    mutationFn: removeMatches,
    onMutate: async (data) => ({ postId: data.postId }),
    onSuccess: (data, _, context) => {
      if (context.postId) {
        queryClient.invalidateQueries({ queryKey: ["post", context.postId] });
      }
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      snackbar({
        autoHideDuration: 3000,
        message: data || "Update match successfully",
        severity: "success",
      });
      options?.onSuccess?.();
    },
  });
};

export const useDeleteHandicap = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();

  return useMutation({
    mutationFn: deleteHandicap,
    onMutate: async (data) => ({ postId: data.postId }),
    onSuccess: (data, _, context) => {
      if (context.postId) {
        queryClient.invalidateQueries({ queryKey: ["post", context.postId] });
      }
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      snackbar({
        autoHideDuration: 3000,
        message: data || "Update match successfully",
        severity: "success",
      });
      options?.onSuccess?.();
    },
  });
};
