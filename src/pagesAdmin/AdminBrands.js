import React, { useEffect, useState } from "react";

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ id: null, name: "" });
  const [activeTab, setActiveTab] = useState("list");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [toast, setToast] = useState(null); // {msg,type}
  const token = localStorage.getItem("adminToken");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBrands = async () => {
    const res = await fetch("http://localhost:5000/brands");
    if (res.ok) {
      const data = await res.json();
      setBrands(data);
      setPage(1);
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

      showToast(form.id ? "Cập nhật brand thành công!" : "Thêm brand thành công!", "success");
      setForm({ id: null, name: "" });
      setActiveTab("list");
      fetchBrands();
    } catch (err) {
      showToast(err.message || "Lỗi hệ thống!", "danger");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa brand này?")) return;
    try {
      const res = await fetch(`http://localhost:5000/admin/brands/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      showToast("Xóa brand thành công!", "success");
      fetchBrands();
    } catch (err) {
      showToast(err.message || "Xóa thất bại!", "danger");
    }
  };

  // Phân trang frontend
  const totalPages = Math.ceil(brands.length / perPage);
  const paginatedBrands = brands.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="container mt-5">
      {/* Toast */}
      {toast && (
        <div
          className={`toast show position-fixed top-0 end-0 m-3 text-white border-0 ${toast.type === "success" ? "bg-success" : "bg-danger"}`}
          role="alert"
          style={{ zIndex: 9999 }}
        >
          <div className="d-flex">
            <div className="toast-body">{toast.msg}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setToast(null)}
            ></button>
          </div>
        </div>
      )}

      {/* Tab */}
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
                      onClick={() => { setForm(b); setActiveTab("edit"); }}>Sửa</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b.id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination giống AdminOrders */}
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
          <h3>{form.id ? "Chỉnh sửa" : "Thêm"} brand</h3>
          <form onSubmit={handleSubmit}>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="Tên brand" className="form-control mb-3" required />
            <button type="submit" className="btn btn-primary">
              {form.id ? "Cập nhật" : "Thêm mới"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
