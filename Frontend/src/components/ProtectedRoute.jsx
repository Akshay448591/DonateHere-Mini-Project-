import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />; // not logged in
  if (roles && !roles.includes(role)) return <Navigate to="/login" />; // role not allowed

  return children;
};

export default ProtectedRoute;
