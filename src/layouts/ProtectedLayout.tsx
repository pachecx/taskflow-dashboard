import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../hooks/useSession";

export function ProtectedLayout() {
  const { authenticated } = useSession();
  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
