import { getToken } from "../util/auth";
import { Navigate } from "react-router-dom";

export default function UnauthenticatedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  if (getToken()) {
    return <Navigate to="/" replace />;
  }

  return children;
}
