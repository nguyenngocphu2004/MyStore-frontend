import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiTrash, BiEdit, BiSearch } from "react-icons/bi";
import ConfirmModal from "../components/ConfirmModal";

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [allBrands, setAllBrands] = useState([]); // dropdown filter
  const [form, setForm] = useState({ id: null, name: "" });
  const [activeTab, setActiveTab] = useState("list");
  const [search, setSearch] = useState("");
  const [filterBrandId, setFilterBrandId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 8;
  const token = localStorage.getItem("adminToken");

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const showToast = (msg, type = "success") => {
    if (type === "success") toast.success(msg, { position: "top-right", autoClose: 3000 });
    else toast.error(msg, { position: "top-right", autoClose: 3000 });
  };

  // Fetch brand với search + filter + phân trang
  const fetchBrands = async (pageNum = 1) => {
    try {
      let url = `http://localhost:5000/brands?page=${pageNum}&per_page=${perPage}`;
      if (search) url += `&search=${search}`;
      if (filterBrandId) url += `&brand_id=${filterBrandId}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Lỗi khi tải danh sách thương hiệu");
      const data = await res.json();
      setBrands(data.brands || []);
      setPage(data.pagination.page);
      setTotalPages(data.pagination.total_pages);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Load toàn bộ brand để dropdown filter
  const fetchAllBrands = async () => {
    try {
      const res = await fetch(`http://localhost:5000/brands?per_page=1000`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Lỗi khi tải dropdown thương hiệu");
      const data = await res.json();
      setAllBrands(data.brands || []);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  useEffect(() => {
    fetchBrands(1);
    fetchAllBrands();
  }, []);

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
      showToast(form.id ? "Cập nhật thương hiệu thành công!" : "Thêm thương hiệu thành công!");
      setForm({ id: null, name: "" });
      setActiveTab("list");
      fetchBrands(1);
      fetchAllBrands(); // cập nhật dropdown
    } catch (err) {
      showToast(err.message || "Lỗi hệ thống!", "error");
    }
  };

  const handleDelete = (id) => { setDeleteId(id); setShowConfirm(true); };
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
      showToast("Xóa thương hiệu thành công!");
      fetchBrands(page);
      fetchAllBrands();
    } catch (err) {
      showToast(err.message || "Xóa thất bại!", "error");
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };
  const cancelDelete = () => { setShowConfirm(false); setDeleteId(null); };

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Tabs */}
      <div className="mb-3">
        <button className={`btn me-2 ${activeTab==="list"?"btn-primary":"btn-outline-primary"}`} onClick={() => setActiveTab("list")}>Danh sách thương hiệu</button>
        <button className={`btn me-2 ${activeTab==="add"?"btn-primary":"btn-outline-primary"}`} onClick={() => { setActiveTab("add"); setForm({id:null,name:""}); }}>Thêm thương hiệu</button>
      </div>

      {/* Filter & search */}
      {activeTab==="list" && (
        <div className="mb-3 d-flex align-items-center">
          <input
            type="text"
            className="form-control me-2"
            style={{ width: "400px" }}
            placeholder="Tìm theo tên thương hiệu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
    if (e.key === "Enter") {
      fetchBrands(1);
    }
  }}
          />
          <select
            className="form-select me-2"
            style={{ width: "200px" }}
            value={filterBrandId}
            onChange={e => setFilterBrandId(e.target.value)}
          >
            <option value="">Tất cả thương hiệu</option>
            {allBrands.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={() => fetchBrands(1)}><BiSearch/></button>
        </div>
      )}

      {/* List */}
      {activeTab==="list" && (
        <>
          <h3>Danh sách thương hiệu</h3>
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr><th>ID</th><th>Tên thương hiệu</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {brands.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.name}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={()=>{setForm(b); setActiveTab("edit");}}><BiEdit /></button>
                    <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(b.id)}><BiTrash /></button>
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
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={()=>fetchBrands(page-1)} disabled={page===1}>Trước</button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <li key={i} className="page-item">
                      <button className={`btn btn-sm me-2 ${page===pageNumber?"btn-dark":"btn-outline-secondary"}`} onClick={()=>fetchBrands(pageNumber)}>{pageNumber}</button>
                    </li>
                  );
                })}
                <li className={`page-item ${page===totalPages?"disabled":""}`}>
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={()=>fetchBrands(page+1)} disabled={page===totalPages}>Sau</button>
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
            <input name="name" value={form.name} onChange={handleChange} placeholder="Tên thương hiệu" className="form-control mb-3" required />
            <button type="submit" className="btn btn-primary">{form.id ? "Cập nhật" : "Thêm mới"}</button>
          </form>
        </>
      )}

      <ConfirmModal show={showConfirm} message="Bạn có chắc chắn muốn xóa thương hiệu này?" onConfirm={confirmDelete} onCancel={cancelDelete} />
    </div>
  );
}
