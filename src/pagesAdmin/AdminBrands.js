import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiTrash, BiEdit } from "react-icons/bi";
import ConfirmModal from "../components/ConfirmModal"; // đường dẫn đến ConfirmModal

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ id: null, name: "" });
  const [activeTab, setActiveTab] = useState("list");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const token = localStorage.getItem("adminToken");

  // Modal xóa
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const showToast = (msg, type = "success") => {
    if (type === "success") toast.success(msg, { position: "top-right", autoClose: 3000 });
    else toast.error(msg, { position: "top-right", autoClose: 3000 });
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch("http://localhost:5000/brands");
      if (!res.ok) throw new Error("Lỗi khi tải danh sách thương hiệu");
      const data = await res.json();
      setBrands(data);
      setPage(1);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = form.id
      ? `http://localhost:5000/admin/brands/${form.id}`
      : "http://localhost:5000/admin/brands";
    const method = form.id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      showToast(form.id ? "Cập nhật thương hiệu thành công!" : "Thêm thương hiệu thành công!", "success");
      setForm({ id: null, name: "" });
      setActiveTab("list");
      fetchBrands();
    } catch (err) {
      showToast(err.message || "Lỗi hệ thống!", "error");
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/admin/brands/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      showToast("Xóa thương hiệu thành công!", "success");
      fetchBrands();
    } catch (err) {
      showToast(err.message || "Xóa thất bại!", "error");
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  // Phân trang frontend
  const totalPages = Math.ceil(brands.length / perPage);
  const paginatedBrands = brands.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Tabs */}
      <div className="mb-3">
        <button className={`btn me-2 ${activeTab==="list"?"btn-primary":"btn-outline-primary"}`}
          onClick={() => setActiveTab("list")}>Danh sách thương hiệu</button>
        <button className={`btn me-2 ${activeTab==="add"?"btn-primary":"btn-outline-primary"}`}
          onClick={() => { setActiveTab("add"); setForm({id:null,name:""}); }}>Thêm thương hiệu</button>
      </div>

      {/* List */}
      {activeTab==="list" && (
        <>
          <h3>Danh sách thương hiệu</h3>
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr><th>ID</th><th>Tên thương hiệu</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {paginatedBrands.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.name}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2"
                      onClick={() => { setForm(b); setActiveTab("edit"); }}><BiEdit /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b.id)}><BiTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${page===1?"disabled":""}`}>
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setPage(page-1)} disabled={page===1}>Trước</button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <li key={i} className="page-item">
                      <button
                        className={`btn btn-sm me-2 ${page===pageNumber?"btn-dark":"btn-outline-secondary"}`}
                        onClick={() => setPage(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  );
                })}
                <li className={`page-item ${page===totalPages?"disabled":""}`}>
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setPage(page+1)} disabled={page===totalPages}>Sau</button>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}

      {/* Add/Edit */}
      {(activeTab==="add" || activeTab==="edit") && (
        <>
          <h3>{form.id ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu"} </h3>
          <form onSubmit={handleSubmit}>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="Tên thương hiệu" className="form-control mb-3" required />
            <button type="submit" className="btn btn-primary">
              {form.id ? "Cập nhật" : "Thêm mới"}
            </button>
          </form>
        </>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        show={showConfirm}
        message="Bạn có chắc chắn muốn xóa thương hiệu này?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
