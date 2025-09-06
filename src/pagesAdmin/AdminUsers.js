import React, { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });
  const [editUser, setEditUser] = useState(null);

  const token = localStorage.getItem("adminToken");
  const role = localStorage.getItem("adminRole"); // lấy role đã lưu khi login

  // --- Lấy danh sách user ---
  useEffect(() => {
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  };
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  };

  // --- Tạo user ---
  const handleCreateUser = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newUser),
    });
    if (res.ok) {
      alert("Tạo user thành công!");
      setNewUser({ username: "", email: "", password: "", role: "CUSTOMER" });
      fetchUsers();
    } else {
      const err = await res.json();
      alert("Lỗi: " + (err.error || "Không thể tạo user"));
    }
  };

  // --- Sửa user ---
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/admin/users/${editUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editUser),
    });
    if (res.ok) {
      alert("Cập nhật user thành công!");
      setEditUser(null);
      fetchUsers();
    } else {
      const err = await res.json();
      alert("Lỗi: " + (err.error || "Không thể cập nhật user"));
    }
  };

  // --- Xóa user ---
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;
    const res = await fetch(`http://localhost:5000/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      alert("Xóa user thành công!");
      fetchUsers();
    } else {
      const err = await res.json();
      alert("Lỗi: " + (err.error || "Không thể xóa user"));
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Quản lý người dùng</h3>

      {/* Form tạo user - chỉ admin mới thấy */}
      {role === "ADMIN" && (
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white">Tạo User mới</div>
          <div className="card-body">
            <form onSubmit={handleCreateUser} className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="STAFF">STAFF</option>
                </select>
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-success">
                  + Tạo User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bảng danh sách user */}
      <table className="table table-striped table-hover shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>ID</th><th>Username</th><th>Email</th><th>Role</th>
            {(role === "ADMIN" || role === "STAFF") && <th>Hành động</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              {(role === "ADMIN" || role === "STAFF") && (
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => setEditUser({ ...u, password: "" })}
                  >
                    Sửa
                  </button>
                  {/* Nút Xóa: chỉ ADMIN mới thấy */}
                  {role === "ADMIN" && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteUser(u.id)}
                  >
                    Xóa
                  </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form sửa user - chỉ admin mới thấy */}
      {editUser && (role === "ADMIN" || role === "STAFF") && (
        <div className="card mt-4 shadow-sm">
          <div className="card-header bg-warning">Sửa User</div>
          <div className="card-body">
            <form onSubmit={handleUpdateUser} className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={editUser.username}
                  onChange={(e) =>
                    setEditUser({ ...editUser, username: e.target.value })
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Password (mới)</label>
                <input
                  type="password"
                  className="form-control"
                  value={editUser.password}
                  onChange={(e) =>
                    setEditUser({ ...editUser, password: e.target.value })
                  }
                />
              </div>
              {role === "ADMIN" && (
              <div className="col-md-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="STAFF">STAFF</option>
                </select>
              </div>
              )}
              <div className="col-12">
                <button type="submit" className="btn btn-success me-2">
                  Lưu
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditUser(null)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
