import React, { useEffect, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {BiUserPlus,BiTrash, BiEdit } from "react-icons/bi";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "CUSTOMER" });
  const [editUser, setEditUser] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const token = localStorage.getItem("adminToken");
  const role = localStorage.getItem("adminRole");

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        setPage(1);
      }
    } catch (err) {
      toast.error("❌ Lỗi khi tải danh sách user");
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Tạo user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newUser),
    });
    if (res.ok) {
      toast.success("Tạo user thành công!");
      setNewUser({ username: "", email: "", password: "", role: "CUSTOMER" });
      fetchUsers();
    } else {
      const err = await res.json();
      toast.error(`${err.error || "Không thể tạo user"}`);
    }
  };

  // Sửa user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/admin/users/${editUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(editUser),
    });
    if (res.ok) {
      toast.success("Cập nhật user thành công!");
      setEditUser(null);
      fetchUsers();
    } else {
      const err = await res.json();
      toast.error(`${err.error || "Không thể cập nhật user"}`);
    }
  };

  // Xóa user
  const handleDeleteUser = async (id) => {
    const res = await fetch(`http://localhost:5000/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      toast.success("Xóa user thành công!");
      fetchUsers();
    } else {
      const err = await res.json();
      toast.error(`${err.error || "Không thể xóa user"}`);
    }
  };

  // --- Phân trang frontend ---
  const totalPages = Math.ceil(users.length / perPage);
  const paginatedUsers = users.slice((page - 1) * perPage, page * perPage);

  // --- Tính số lượng theo role ---
  const totalAdmin = users.filter(u => u.role === "ADMIN").length;
  const totalStaff = users.filter(u => u.role === "STAFF").length;
  const totalCustomer = users.filter(u => u.role === "CUSTOMER").length;

  const pieData = {
    labels: ["Quản trị viên", "Nhân viên", "Khách hàng"],
    datasets: [
      {
        data: [totalAdmin, totalStaff, totalCustomer],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <h3 className="mb-3">Quản lý người dùng</h3>

      {/* Tổng người dùng + Pie chart */}
      <div className="d-flex align-items-center mb-3">
        <p className="text-muted mb-0 me-3">
          Tổng số người dùng: <strong>{users.length}</strong> |
          Quản trị viên: <strong>{totalAdmin}</strong> |
          Nhân viên: <strong>{totalStaff}</strong> |
          Khách hàng: <strong>{totalCustomer}</strong>
        </p>
        <div style={{ width: "120px", height: "120px" }}>
          <Pie data={pieData} options={{ plugins: { legend: { display: false } } }} />
        </div>
      </div>

      {/* Form tạo user */}
      {role === "ADMIN" && (
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white">Tạo User mới</div>
          <div className="card-body">
            <form onSubmit={handleCreateUser} className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Role</label>
                <select className="form-select" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="STAFF">STAFF</option>
                </select>
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-success"><BiUserPlus/> Tạo User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bảng user */}
      <table className="table table-striped table-hover shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>ID</th><th>Username</th><th>Email</th><th>Role</th>
            {(role === "ADMIN" || role === "STAFF") && <th>Hành động</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              {(role === "ADMIN" || role === "STAFF") && (
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => setEditUser({ ...u, password: "" })}><BiEdit /></button>
                  {role === "ADMIN" && (
                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmDeleteId(u.id)}><BiTrash /></button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirm modal */}
      <ConfirmModal
        show={confirmDeleteId !== null}
        message="Bạn có chắc muốn xóa user này?"
        onConfirm={() => { handleDeleteUser(confirmDeleteId); setConfirmDeleteId(null); }}
        onCancel={() => setConfirmDeleteId(null)}
      />

      {/* Form sửa user */}
      {editUser && (role === "ADMIN" || role === "STAFF") && (
        <div className="card mt-4 shadow-sm">
          <div className="card-header bg-warning">Sửa User</div>
          <div className="card-body">
            <form onSubmit={handleUpdateUser} className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" value={editUser.username} onChange={e => setEditUser({ ...editUser, username: e.target.value })} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Password (mới)</label>
                <input type="password" className="form-control" value={editUser.password} onChange={e => setEditUser({ ...editUser, password: e.target.value })} />
              </div>
              {role === "ADMIN" && (
                <div className="col-md-3">
                  <label className="form-label">Role</label>
                  <select className="form-select" value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value })}>
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="STAFF">STAFF</option>
                  </select>
                </div>
              )}
              <div className="col-12">
                <button type="submit" className="btn btn-success me-2">Lưu</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditUser(null)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
