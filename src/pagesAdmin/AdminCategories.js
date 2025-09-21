import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiTrash, BiEdit } from "react-icons/bi";
import ConfirmModal from "../components/ConfirmModal"; // đường dẫn đến ConfirmModal

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ id: null, name: "" });
  const [activeTab, setActiveTab] = useState("list");
  const token = localStorage.getItem("adminToken");

  // Modal xóa
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const showToast = (msg, type = "success") => {
    if (type === "success") toast.success(msg, { position: "top-right", autoClose: 3000 });
    else toast.error(msg, { position: "top-right", autoClose: 3000 });
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/categories");
      if (!res.ok) throw new Error("Lỗi khi tải danh mục");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = form.id
      ? `http://localhost:5000/admin/categories/${form.id}`
      : "http://localhost:5000/admin/categories";
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
      showToast(form.id ? "Cập nhật danh mục thành công!" : "Thêm danh mục thành công!", "success");
      setForm({ id: null, name: "" });
      setActiveTab("list");
      fetchCategories();
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
      const res = await fetch(`http://localhost:5000/admin/categories/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      showToast("Xóa danh mục thành công!", "success");
      fetchCategories();
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

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mb-3">
        <button className={`btn me-2 ${activeTab==="list"?"btn-primary":"btn-outline-primary"}`}
          onClick={() => setActiveTab("list")}>Danh sách danh mục</button>
        <button className={`btn me-2 ${activeTab==="add"?"btn-primary":"btn-outline-primary"}`}
          onClick={() => { setActiveTab("add"); setForm({id:null,name:""}); }}>Thêm danh mục</button>
      </div>

      {activeTab==="list" && (
        <>
          <h3>Danh sách danh mục</h3>
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr><th>ID</th><th>Tên danh mục</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2"
                      onClick={() => { setForm(c); setActiveTab("edit"); }}><BiEdit /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}><BiTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {(activeTab==="add" || activeTab==="edit") && (
        <>
          <h3>{form.id ? "Chỉnh sửa" : "Thêm"} danh mục</h3>
          <form onSubmit={handleSubmit}>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="Tên danh mục" className="form-control mb-3" required />
            <button type="submit" className="btn btn-primary">
              {form.id ? "Cập nhật" : "Thêm mới"}
            </button>
          </form>
        </>
      )}

      <ConfirmModal
        show={showConfirm}
        message="Bạn có chắc chắn muốn xóa danh mục này?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
