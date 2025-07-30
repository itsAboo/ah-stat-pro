import type { User } from "../types";
import { userApi } from "../lib/axios";

export interface UserAuthFormData {
  username: string;
  password: string;
  name?: string;
  action: "signin" | "signup";
}

export interface UserResponseData {
  message: string;
  user: User;
  token: string;
}

export const authorization = async (data: UserAuthFormData) => {
  const response = await userApi.post(`/${data.action}`, {
    ...data,
    action: undefined,
  });
  return response.data as UserResponseData;
};

export const getUser = async ({ signal }: { signal: AbortSignal }) => {
  const response = await userApi.get("/", { signal });
  return response.data.user as User;
};

export const updatePassword = async (data: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const response = await userApi.patch("/password", data);
  return response.data.message;
};

export const signOut = async () => {
  const response = await userApi.post("/signout");
  return response.data.message;
};

export const updateName = async ({ name }: { name: string }) => {
  const response = await userApi.patch("/name", { name });
  return response.data.message;
};
