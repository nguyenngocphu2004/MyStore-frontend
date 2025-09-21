import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiPackage, BiHistory, BiTrash, BiEdit } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "../components/ConfirmModal";

function StockIn() {
  const [products, setProducts] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("form");

  const [form, setForm] = useState({
    product_id: "",
    quantity: "",
    price: ""
  });

  const [editEntry, setEditEntry] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

  const token = localStorage.getItem("adminToken");

  // Modal xóa
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const formatPrice = (value) => (value ? new Intl.NumberFormat("vi-VN").format(value) : "");
  const parsePrice = (value) => value.replace(/\D/g, "");
  const formatDate = (dateStr) => (dateStr ? new Intl.DateTimeFormat("vi-VN").format(new Date(dateStr)) : "");

  // Load sản phẩm
  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("Lỗi khi tải danh sách sản phẩm!"));
  }, [token]);

  // Load lịch sử nhập kho
  const fetchHistory = (p = 1) => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/admin/stockin?page=${p}&per_page=${perPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setEntries(res.data.entries);
        setPage(res.data.page);
        setTotalPages(res.data.pages);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Lỗi khi tải lịch sử nhập kho!");
        setLoading(false);
      });
  };

  // Form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") setForm({ ...form, price: parsePrice(value) });
    else setForm({ ...form, [name]: value });
  };

  // Submit nhập kho
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/admin/stockin", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message || "Nhập kho thành công!");
      setForm({ product_id: "", quantity: "", price: "", date: new Date().toISOString().split("T")[0] });
      if (activeTab === "history") fetchHistory(page);
    } catch (err) {
      toast.error(err.response?.data?.error || "Lỗi khi nhập kho!");
    }
  };

  // Modal xóa
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/admin/stockin/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Xóa thành công!");
      fetchHistory(page);
    } catch (err) {
      toast.error(err.response?.data?.error || "Xóa thất bại!");
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  // Edit
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEntry({ ...editEntry, [name]: name === "price" ? parsePrice(value) : value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/admin/stockin/${editEntry.id}`, editEntry, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Cập nhật thành công!");
      setEditEntry(null);
      fetchHistory(page);
    } catch (err) {
      toast.error(err.response?.data?.error || "Cập nhật thất bại!");
    }
  };

  return (
    <div className="container p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "form" ? "active" : ""}`}
            onClick={() => setActiveTab("form")}
          >
            <BiPackage className="me-2" /> Nhập kho
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "history" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("history");
              fetchHistory(1);
            }}
          >
            <BiHistory className="me-2" /> Lịch sử nhập kho
          </button>
        </li>
      </ul>

      {/* Form Nhập kho */}
      {activeTab === "form" && (
        <form onSubmit={handleSubmit} className="card p-4 shadow mb-5">
          <div className="mb-3">
            <label className="form-label">Tên sản phẩm</label>
            <select
              className="form-select"
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              required
            >
              <option value="">Chọn sản phẩm</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Số lượng</label>
            <input
              type="number"
              className="form-control"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Giá</label>
            <input
              type="text"
              className="form-control"
              name="price"
              value={formatPrice(form.price)}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-warning text-black w-100 py-2">
            Lưu nhập kho
          </button>
        </form>
      )}

      {/* Lịch sử nhập kho */}
      {activeTab === "history" && (
        <div>
          {loading ? (
            <p className="text-center">Đang tải dữ liệu...</p>
          ) : (
            <>
              <table className="table table-striped table-bordered shadow">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá nhập</th>
                    <th>Ngày nhập</th>
                    <th>Người nhập</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Chưa có dữ liệu nhập kho
                      </td>
                    </tr>
                  ) : (
                    entries.map((entry, index) => (
                      <tr key={entry.id}>
                        <td>{index + 1 + (page - 1) * perPage}</td>
                        <td>{entry.product_name}</td>
                        <td>{editEntry?.id === entry.id ? (
                          <input
                            type="number"
                            name="quantity"
                            value={editEntry.quantity}
                            onChange={handleEditChange}
                            min="1"
                          />
                        ) : entry.quantity}</td>
                        <td>{editEntry?.id === entry.id ? (
                          <input
                            type="text"
                            name="price"
                            value={formatPrice(editEntry.price)}
                            onChange={handleEditChange}
                          />
                        ) : entry.price.toLocaleString() + " đ"}</td>
                        <td>{formatDate(entry.date)}</td>
                        <td>{entry.imported_by}</td>
                        <td>
                          {editEntry?.id === entry.id ? (
                            <>
                              <button className="btn btn-success btn-sm me-2" onClick={handleEditSubmit}>
                                Lưu
                              </button>
                              <button className="btn btn-secondary btn-sm" onClick={() => setEditEntry(null)}>
                                Hủy
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="btn btn-warning btn-sm me-2" onClick={() => setEditEntry(entry)}>
                                <BiEdit />
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(entry.id)}>
                                <BiTrash />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="d-flex justify-content-center mt-4">
                <nav>
                  <ul className="pagination">
                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => fetchHistory(page - 1)}
                        disabled={page === 1}
                      >
                        Trước
                      </button>
                    </li>

                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNumber = idx + 1;
                      return (
                        <li key={pageNumber} className={`page-item ${page === pageNumber ? "active" : ""}`}>
                          <button className="page-link" onClick={() => fetchHistory(pageNumber)}>
                            {pageNumber}
                          </button>
                        </li>
                      );
                    })}

                    <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => fetchHistory(page + 1)}
                        disabled={page === totalPages}
                      >
                        Sau
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </>
          )}
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        show={showConfirm}
        message="Bạn có chắc chắn muốn xóa bản ghi này?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default StockIn;
