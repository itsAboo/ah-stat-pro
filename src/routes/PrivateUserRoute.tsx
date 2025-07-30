import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/auth";
import { getToken } from "../util/auth";

export default function PrivateUserRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, error, isPending } = useUser();

  if (!getToken() && !user) {
    return <Navigate to="/auth/signin" />;
  }

  if (isPending) {
    return undefined;
  }

  if (error) {
    return <Navigate to="/auth/signin" />;
  }

  if (user != undefined && !user && !isPending) {
    return <Navigate to="/auth/signin" />;
  }

  return children;
}
