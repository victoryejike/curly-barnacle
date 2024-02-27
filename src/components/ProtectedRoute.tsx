/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  user: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, user }) => {
  console.log(user);
  return user ? children : <Navigate to="/"></Navigate>;
};

export default ProtectedRoute;
