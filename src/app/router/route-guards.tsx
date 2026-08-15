import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "@/lib/auth-storage";

/** Solo para usuarios con sesión. */
export function ProtectedRoute() {
  return getToken() ? <Outlet /> : <Navigate to="/login" replace />;
}

/** Solo para usuarios sin sesión: evita volver al login ya logueado. */
export function GuestRoute() {
  return getToken() ? <Navigate to="/discover" replace /> : <Outlet />;
}
