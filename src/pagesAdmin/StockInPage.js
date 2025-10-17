import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiPackage, BiHistory, BiTrash, BiEdit, BiPlus, BiCalendar,BiSearch } from "react-icons/bi";
import { toast } from "react-toastify";
import LogsModal from "../components/LogsModal";


function StockIn() {
  const [products, setProducts] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("form");
  const [search, setSearch] = useState("");
  const [filterProduct, setFilterProduct] = useState("");
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  // form nhiều sản phẩm

  const [items, setItems] = useState([
    { product_id: "", quantity: "", price: ""},
  ]);

  const [editEntry, setEditEntry] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

  const token = localStorage.getItem("adminToken");

  const formatPrice = (value) =>
    value ? new Intl.NumberFormat("vi-VN").format(value) : "";
  const parsePrice = (value) => value.replace(/\D/g, "");

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
    .get(`http://localhost:5000/admin/stockin?page=${p}&per_page=${perPage}&search=${search}&product_id=${filterProduct}`, {
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

  const fetchLogs = async (id) => {
  try {
    const res = await axios.get(`http://localhost:5000/admin/stockin/${id}/logs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLogs(res.data);
    setShowLogs(true);
  } catch (err) {
    toast.error("Không thể tải lịch sử chỉnh sửa!");
  }
};

  // Thêm dòng mới
  const addRow = () => {
    setItems([...items, { product_id: "", quantity: "", price: ""}]);
  };

  // Xóa dòng
  const removeRow = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems.length ? newItems : [{ product_id: "", quantity: "", price: "" }]);
  };

  // Thay đổi dữ liệu trong bảng
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] =
      field === "price" ? parsePrice(value) : value;
    setItems(newItems);
  };

  // Submit nhập kho
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { items };
      const res = await axios.post(
        "http://localhost:5000/admin/stockin",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Nhập kho thành công!");
      setItems([{ product_id: "", quantity: "", price: "" }]);
      if (activeTab === "history") fetchHistory(page);
    } catch (err) {
      toast.error(err.response?.data?.error || "Lỗi khi nhập kho!");
    }
  };

  // Modal xóa

  // Edit
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEntry({
      ...editEntry,
      [name]: name === "price" ? parsePrice(value) : value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/admin/stockin/${editEntry.id}`,
        editEntry,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Cập nhật thành công!");
      setEditEntry(null);
      fetchHistory(page);
    } catch (err) {
      toast.error(err.response?.data?.error || "Cập nhật thất bại!");
    }
  };

  return (
    <div className="container p-4">
      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "form" ? "active" : ""}`}
            onClick={() => setActiveTab("form")}
          >
            <BiPackage className="me-2" /> Nhập sản phẩm
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
            <BiHistory className="me-2" /> Lịch sử nhập sản phẩm
          </button>
        </li>
      </ul>

      {/* Form Nhập kho nhiều sản phẩm */}
      {activeTab === "form" && (
        <form onSubmit={handleSubmit} className="card p-4 shadow mb-5">
          <h5 className="mb-3">Danh sách sản phẩm nhập</h5>
          <table className="table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá (VND)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <select
                      className="form-select"
                      value={item.product_id}
                      onChange={(e) =>
                        handleItemChange(idx, "product_id", e.target.value)
                      }
                      required
                    >
                      <option value="">Chọn sản phẩm</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={item.quantity}
                      min="1"
                      required
                      onChange={(e) => {
      const value = Number(e.target.value);

      if (value < 1 || value > 10000) {
        toast.error("Số lượng phải từ 1 đến 10000");
      }

      handleItemChange(idx, "quantity", value);
    }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formatPrice(item.price)}
                      required
                      onChange={(e) =>
                        handleItemChange(idx, "price", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeRow(idx)}
                    >
                      <BiTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            className="btn btn-secondary mb-3"
            onClick={addRow}
          >
            <BiPlus className="me-2" /> Thêm sản phẩm
          </button>
          <button type="submit" className="btn btn-primary w-100 py-2">
            Lưu phiếu nhập
          </button>
        </form>
      )}

      {/* Lịch sử nhập kho */}
      {activeTab === "history" && (
        <div>
        <div className="d-flex mb-3">
  <input
    type="text"
    className="form-control me-2"
    placeholder="Tìm theo sản phẩm hoặc người nhập"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    onKeyDown={(e) => {
    if (e.key === 'Enter') {
      fetchHistory(1);
    }
  }}
  />
  <select
    className="form-select me-2"
    value={filterProduct}
    onChange={(e) => setFilterProduct(e.target.value)}
  >
    <option value="">Tất cả sản phẩm</option>
    {products.map((p) => (
      <option key={p.id} value={p.id}>
        {p.name}
      </option>
    ))}
  </select>
  <button className="btn btn-primary" onClick={() => fetchHistory(1)}>
    <BiSearch/>
  </button>
</div>

          {loading ? (
            <p className="text-center">Đang tải dữ liệu...</p>
          ) : (
            <>
              <table className="table table-striped table-bordered shadow">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá nhập (VND)</th>
                    <th>Tổng tiền</th>
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
                        ) : entry.price.toLocaleString("vi-VN")} đ</td>
                        <td>{entry.total.toLocaleString("vi-VN")} đ</td>
                        <td>{new Date(entry.date).toLocaleString("vi-VN")}</td>
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

                              <button className="btn btn-info btn-sm" onClick={() => fetchLogs(entry.id)}>
                                  <BiCalendar />
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

       <LogsModal
      show={showLogs}
      onClose={() => setShowLogs(false)}
      logs={logs}
    />
    </div>

  );
}

export default StockIn;
