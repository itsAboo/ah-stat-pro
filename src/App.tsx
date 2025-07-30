import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/layout/Layout";
import AuthPage from "./pages/AuthPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "./context/SnackbarContext";
import UnauthenticatedRoute from "./routes/UnauthenticatedRoute";
import Post from "./pages/Post";
import CreatePost from "./pages/CreatePost";
import MyAccount from "./pages/MyAccount";
import ChangePasswordSection from "./components/my-account/ChangePasswordSection";
import EditPost from "./pages/EditPost";
import { SocketProvider } from "./context/SocketContext";
import MyAccountSection from "./components/my-account/MyAccountSection";
import MyPostsSection from "./components/my-account/MyPostsSection";
import NotificationsSection from "./components/my-account/NotificationSection";
import NotFoundPage from "./components/layout/NotFound";
import PrivateUserRoute from "./routes/PrivateUserRoute";
import AccessList from "./pages/AccessList";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/auth/:action",
        element: (
          <UnauthenticatedRoute>
            <AuthPage />
          </UnauthenticatedRoute>
        ),
      },
      {
        path: "/post/:postId",
        element: (
          <PrivateUserRoute>
            <Post />
          </PrivateUserRoute>
        ),
      },
      {
        path: "/post/:postId/edit",
        element: (
          <PrivateUserRoute>
            <EditPost />
          </PrivateUserRoute>
        ),
      },
      {
        path: "/post/:postId/edit/access",
        element: (
          <PrivateUserRoute>
            <AccessList />
          </PrivateUserRoute>
        ),
      },
      {
        path: "/create",
        element: (
          <PrivateUserRoute>
            <CreatePost />
          </PrivateUserRoute>
        ),
      },
      {
        path: "/account",
        element: (
          <PrivateUserRoute>
            <MyAccount />
          </PrivateUserRoute>
        ),
        children: [
          {
            path: "/account",
            element: <MyAccountSection />,
          },
          {
            path: "/account/change-password",
            element: <ChangePasswordSection />,
          },
          {
            path: "/account/my-posts",
            element: <MyPostsSection />,
          },
          {
            path: "/account/notifications",
            element: <NotificationsSection />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <SnackbarProvider>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </SocketProvider>
    </QueryClientProvider>
  );
}

export default App;
