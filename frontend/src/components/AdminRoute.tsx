import { Navigate } from "react-router-dom";
import { useAdminStatus } from "../hooks/useAdminStatus";

/**
 * AdminRoute - Protects routes that should only be accessible to admin users
 * Redirects non-admin users to the movies page
 */
export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if current user has admin privileges
  const isAdmin = useAdminStatus();

  // Show loading state while determining admin status
  if (isAdmin === null) {
    return <p>Loading...</p>; // Or your loading spinner
  }

  // Redirect non-admin users to the movies page
  if (!isAdmin) {
    return <Navigate to="/movies" />;
  }

  // Render the protected content for admin users
  return <>{children}</>;
}
