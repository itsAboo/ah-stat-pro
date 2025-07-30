import axios, { AxiosInstance } from "axios";
import { addToken, getToken, removeToken } from "../util/auth";

const USER_BASE_URL = import.meta.env.VITE_APP_USER_API as string;
const POST_BASE_URL = import.meta.env.VITE_APP_POST_API as string;
const HANDICAP_BASE_URL = import.meta.env.VITE_APP_HANDICAP_API as string;
const ACCESS_REQUEST_BASE_URL = import.meta.env
  .VITE_APP_ACCESS_REQUEST_API as string;
const NOTIFICATION_BASE_URL = import.meta.env.VITE_APP_NOTIFICATION_API;
const POST_ACCESS_BASE_URL = import.meta.env.VITE_APP_POST_ACCESS_API;

// Global refresh token state - shared across ALL axios instances
let refreshTokenPromise: Promise<string> | null = null;
let isTokenExpired = false;

const attachAuthInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        if (isTokenExpired && !refreshTokenPromise) {
          return Promise.reject(new Error("Token expired, please login again"));
        }

        try {
          if (refreshTokenPromise) {
            const newToken = await refreshTokenPromise;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          }
          refreshTokenPromise = refreshToken();

          const newToken = await refreshTokenPromise;
          isTokenExpired = false;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          isTokenExpired = true;
          removeToken();
          return Promise.reject(refreshError);
        } finally {
          refreshTokenPromise = null;
        }
      }

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong";

        return Promise.reject(new Error(message));
      }

      return Promise.reject(error);
    }
  );
};

// Separate refresh token function
const refreshToken = async (): Promise<string> => {
  try {
    const response = await axios.post(
      `${USER_BASE_URL}/refresh-token`,
      {},
      { withCredentials: true }
    );

    const newAccessToken = response.data.token;
    addToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Refresh token API call failed"
    );
  }
};

export const userApi = axios.create({
  baseURL: USER_BASE_URL,
  withCredentials: true,
});

export const postApi = axios.create({
  baseURL: POST_BASE_URL,
  withCredentials: true,
});

export const handicapApi = axios.create({
  baseURL: HANDICAP_BASE_URL,
  withCredentials: true,
});

export const accessRequestApi = axios.create({
  baseURL: ACCESS_REQUEST_BASE_URL,
  withCredentials: true,
});

export const notificationApi = axios.create({
  baseURL: NOTIFICATION_BASE_URL,
  withCredentials: true,
});

export const postAccessApi = axios.create({
  baseURL: POST_ACCESS_BASE_URL,
  withCredentials: true,
});

attachAuthInterceptor(userApi);
attachAuthInterceptor(postApi);
attachAuthInterceptor(handicapApi);
attachAuthInterceptor(accessRequestApi);
attachAuthInterceptor(notificationApi);
attachAuthInterceptor(postAccessApi);
