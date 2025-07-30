import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authorization, getUser, signOut, updateName } from "../api/user";
import { addToken, getToken, removeToken } from "../util/auth";
import { User } from "../types";
import { useSnackbar } from "../context/SnackbarContext";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useEffect } from "react";

export const useUser = () => {
  const queryClient = useQueryClient();

  const { mutate: signout } = useMutation({
    mutationFn: signOut,
  });
  const { isError, ...result } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: getUser,
    retry: 1,
    enabled: !!getToken(),
  });

  useEffect(() => {
    if (isError) {
      removeToken();
      queryClient.setQueryData(["user"], null);
    }
  }, [isError, queryClient, signout]);

  return { ...result };
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const { snackbar } = useSnackbar();
  const navigate = useNavigate();
  const { setToken } = useSocket();

  return useMutation({
    mutationFn: authorization,
    onSuccess: (data) => {
      addToken(data.token);
      setToken(data.token);
      snackbar({
        autoHideDuration: 3000,
        message:
          params.action === "signup"
            ? "Successfully sign up"
            : "Successfully sign in",
      });
      queryClient.setQueryData(["user"], data.user);
      navigate("/");
    },
  });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();

  const {
    mutate: signout,
    isPending,
    isError,
  } = useMutation({
    mutationFn: signOut,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], null);
      removeToken();
      snackbar({
        message: data || "Sign out successfully",
      });
    },
  });

  return { signout, isPending, isError };
};

export const useUpdateName = (option?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();

  return useMutation({
    mutationFn: updateName,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      snackbar({
        message: data.message || "Updated name successfully",
      });
      option?.onSuccess?.();
    },
  });
};
