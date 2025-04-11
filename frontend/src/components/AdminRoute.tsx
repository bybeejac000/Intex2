import { Navigate } from "react-router-dom";
import { useAdminStatus } from "../hooks/useAdminStatus";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = useAdminStatus();

  if (isAdmin === null) {
    return <p>Loading...</p>; // Or your loading spinner
  }

  if (!isAdmin) {
    return <Navigate to="/movies" />;
  }

  return <>{children}</>;
}
