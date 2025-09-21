import React from "react";
import { NavLink, Outlet, useNavigate,Link } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const role = localStorage.getItem("adminRole");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    navigate("/admin");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <nav
        className="bg-dark text-white d-flex flex-column p-3 shadow"
        style={{ width: "240px" }}
      >
        <h4 className="text-center mb-4">
          <Link to="/admin/dashboard" className="text-white text-decoration-none">
            Quản lý PhuStore
          </Link>
        </h4>

        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <NavLink
              to="users"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active bg-primary" : ""}`
              }
            >
             Quản lí người dùng
            </NavLink>
          </li>
          <li>
            <NavLink
              to="products"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active bg-primary" : ""}`
              }
            >
             Quản lí sản phẩm
            </NavLink>
          </li>
          <li>
            <NavLink
              to="revenue"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active bg-primary" : ""}`
              }
            >
             Thống kê
            </NavLink>
          </li>

          {/* Chỉ Admin mới thấy tab này */}
          {role === "ADMIN" && (
            <li>
              <NavLink
                to="profit"
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "active bg-primary" : ""}`
                }
              >
                Lợi nhuận
              </NavLink>
            </li>
          )}

          <li>
            <NavLink
              to="categories"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active bg-primary" : ""}`
              }
            >
               Danh mục
            </NavLink>
          </li>
          <li>
            <NavLink
              to="brands"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active bg-primary" : ""}`
              }
            >
               Thương hiệu
            </NavLink>
          </li>
          <li>
            <NavLink
              to="orders"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active bg-primary" : ""}`
              }
            >
              Quản lí đơn hàng
            </NavLink>
          </li>
          <li>
            <NavLink
              to="admincomments"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active bg-primary" : ""}`
              }
            >
              Quản lí bình luận
            </NavLink>
          </li>
          <li>
            <NavLink
              to="adminchat"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active bg-primary" : ""}`
              }
            >
              Chat với khách hàng
            </NavLink>
          </li>
          <li>
  <NavLink
    to="stockin"
    className={({ isActive }) =>
      `nav-link text-white ${isActive ? "active bg-primary" : ""}`
    }
  >
    Nhập sản phẩm
  </NavLink>
</li>
        </ul>

        <hr />
        <button className="btn btn-danger w-100 mt-auto" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Content */}
      <div className="flex-grow-1 p-4 bg-light">
        <Outlet />
      </div>
    </div>
  );
}
