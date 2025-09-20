import React, { useEffect, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "CUSTOMER" });
  const [editUser, setEditUser] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("adminToken");
  const role = localStorage.getItem("adminRole");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
      setPage(1);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newUser),
    });
    if (res.ok) {
      showToast("Tạo user thành công!");
      setNewUser({ username: "", email: "", password: "", role: "CUSTOMER" });
      fetchUsers();
    } else {
      const err = await res.json();
      showToast(err.error || "Không thể tạo user", "danger");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/admin/users/${editUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(editUser),
    });
    if (res.ok) {
      showToast("Cập nhật user thành công!");
      setEditUser(null);
      fetchUsers();
    } else {
      const err = await res.json();
      showToast(err.error || "Không thể cập nhật user", "danger");
    }
  };

  const handleDeleteUser = async (id) => {
    const res = await fetch(`http://localhost:5000/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      showToast("Xóa user thành công!");
      fetchUsers();
    } else {
      const err = await res.json();
      showToast(err.error || "Không thể xóa user", "danger");
    }
  };

  // --- Phân trang frontend ---
  const totalPages = Math.ceil(users.length / perPage);
  const paginatedUsers = users.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="container mt-4">
      {/* Toast */}
      {toast && (
        <div className={`toast show position-fixed top-0 end-0 m-3 text-white border-0 ${toast.type === "success" ? "bg-success" : "bg-danger"}`} style={{ zIndex: 9999 }}>
          <div className="d-flex">
            <div className="toast-body">{toast.msg}</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast(null)}></button>
          </div>
        </div>
      )}

      <h3 className="mb-3">Quản lý người dùng</h3>

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
                <button type="submit" className="btn btn-success">+ Tạo User</button>
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
                  <button className="btn btn-warning btn-sm me-2" onClick={() => setEditUser({ ...u, password: "" })}>Sửa</button>
                  {role === "ADMIN" && (
                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmDeleteId(u.id)}>Xóa</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang giống AdminOrders */}
      <div className="d-flex justify-content-center mt-3">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setPage(page - 1)} disabled={page === 1}>Trước</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <li key={i} className="page-item">
                  <button className={`btn btn-sm me-2 ${page === pageNumber ? "btn-dark" : "btn-outline-secondary"}`} onClick={() => setPage(pageNumber)}>
                    {pageNumber}
                  </button>
                </li>
              );
            })}
            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Sau</button>
            </li>
          </ul>
        </nav>
      </div>

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

      {/* Confirm modal */}
      <ConfirmModal
        show={confirmDeleteId !== null}
        message="Bạn có chắc muốn xóa user này?"
        onConfirm={() => { handleDeleteUser(confirmDeleteId); setConfirmDeleteId(null); }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
