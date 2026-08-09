import { AuthService } from "@/core/auth/services/auth.service";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  isAuthenticated: boolean;
}

export const PrivateRoute = ({ isAuthenticated }: PrivateRouteProps) => {
  const { pathname } = useLocation();

  if (!isAuthenticated && pathname !== '/user/login') {
    AuthService.logout();
    return <Navigate to="/user/login" replace />;
  }

  return <Outlet />;
};
