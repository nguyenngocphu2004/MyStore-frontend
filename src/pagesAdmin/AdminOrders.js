import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null); // { msg, type }
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const PAYMENT_TEXT = {
  PENDING: "Chưa thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thanh toán thất bại",
  };
  const DELIVERY_TEXT = {
    PENDING: "Chờ xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPING: "Đang giao",
    DELIVERED: "Đã giao",
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 1000); // 3 giây tự ẩn
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        showToast("Lỗi khi tải danh sách đơn hàng", "danger");
      }
    };
    fetchOrders();
  }, [token]);
  const handlePaymentStatusChange = async (orderId, newStatus) => {
  try {
    await axios.put(
      `http://localhost:5000/admin/orders/${orderId}/payment_status`,
      { status: newStatus },  // hoặc { payment_status: newStatus } tùy API
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );

    showToast("Cập nhật trạng thái thanh toán thành công!", "success");
  } catch (err) {
    console.error(err);
    showToast("Cập nhật trạng thái thanh toán thất bại!", "danger");
  }
};
  const handleDeliveryChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/admin/orders/${orderId}/delivery_status`,
        { delivery_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, delivery_status: newStatus } : o
        )
      );

      showToast("Cập nhật trạng thái thành công!", "success");
    } catch (err) {
      console.error(err);
      showToast("Cập nhật trạng thái thất bại!", "danger");
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Danh sách đơn hàng</h2>

      {/* Toast */}
      {toast && (
        <div
          className={`toast show position-fixed top-0 end-0 m-3 text-white border-0 ${
            toast.type === "success" ? "bg-success" : "bg-danger"
          }`}
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

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Khách/Người dùng</th>
            <th>SĐT</th>
            <th>Ngày tạo</th>
            <th>Tổng tiền</th>
            <th>Phương thức</th>
            <th>Số món</th>
            <th>Trạng thái giao hàng</th>
            <th>Trạng thái thanh toán</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user ? order.user.username : order.guest_name || "Ẩn danh"}</td>
              <td>{order.user ? order.user.phone : order.guest_phone || "-"}</td>
              <td>{order.created_at}</td>
              <td>{Number(order.total_price).toLocaleString("vi-VN")}₫</td>
              <td>{order.delivery_method}</td>
              <td>{order.items_count}</td>
              <td>
                <select
                  className="form-select form-select-sm"
                  value={order.delivery_status || "PENDING"}
                  onChange={(e) => handleDeliveryChange(order.id, e.target.value)}
                  disabled={order.delivery_status === "DELIVERED"}
                >
                  <option value="PENDING">{DELIVERY_TEXT.PENDING}</option>
                  <option value="PROCESSING">{DELIVERY_TEXT.PROCESSING}</option>
                  <option value="SHIPPING">{DELIVERY_TEXT.SHIPPING}</option>
                  <option value="DELIVERED" disabled>{DELIVERY_TEXT.DELIVERED}</option>
                </select>
              </td>
              <td>
              <select
              className="form-select form-select-sm"
              value={order.status || "PENDING"}
              onChange={(e) => handlePaymentStatusChange(order.id, e.target.value)}
              disabled={order.status === "PAID" || order.status === "FAILED"}
            >
              <option value="PENDING">{PAYMENT_TEXT.PENDING}</option>
              <option value="PAID">{PAYMENT_TEXT.PAID}</option>
              <option value="FAILED">{PAYMENT_TEXT.FAILED}</option>
                </select>

              </td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => navigate(`${order.id}`)}
                >
                  Xem
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && <p className="text-center mt-3">Không có đơn hàng nào.</p>}
    </div>
  );
}
