import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <nav className="bg-dark text-white p-3" style={{ width: "220px" }}>
        <h4>Admin Panel</h4>
        <ul className="list-unstyled">
          <li><NavLink className="text-white" to="users">Users</NavLink></li>
          <li><NavLink className="text-white" to="products">Products</NavLink></li>
          <li><NavLink className="text-white" to="orders">Orders</NavLink></li>
          <li><NavLink className="text-white" to="profit">Profit</NavLink></li>
          <li><NavLink className="text-white" to="categories">Categories</NavLink></li>
          <li><NavLink className="text-white" to="brands">Brands</NavLink></li>
        </ul>
        <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
      </nav>

      {/* Content */}
      <div className="flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}
