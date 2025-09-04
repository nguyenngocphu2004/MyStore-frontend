import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("adminToken"); // Lấy token admin từ localStorage
  if (!token) {
    // Nếu chưa login => redirect về login
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
