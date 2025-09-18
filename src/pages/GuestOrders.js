import React, { useState, useRef, useEffect } from "react";

function GuestOrders() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const otpInputRef = useRef(null);
  const ordersPerPage = 3;
    const DELIVERY_TEXT = {
  PENDING: "Chờ xác nhận",
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
};
 const PAYMENT_TEXT = {
  PENDING: "Chưa thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thanh toán thất bại",
  };
  // Countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleRequestOtp = async () => {
    if (!phone.trim()) return setError("Vui lòng nhập số điện thoại");
    setError(""); setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/request-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (res.ok) setCountdown(60);
      else setError(data.error || "Có lỗi khi gửi OTP");
    } catch {
      setError("Không thể kết nối server");
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return setError("Vui lòng nhập mã OTP");
    setError(""); setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/orders/guest", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data); setCurrentPage(1);
        if (data.length === 0) setError("Không tìm thấy đơn hàng nào");
      } else setError(data.error || "OTP không hợp lệ");
    } catch {
      setError("Không thể kết nối server");
    } finally { setLoading(false); }
  };

  const formatCurrency = (v) =>
    v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // Pagination
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const currentOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <div className="container my-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-3 text-center">TRA CỨU ĐƠN HÀNG</h2>

      {/* Nhập số điện thoại */}
      <input
        type="tel"
        className="form-control mb-3"
        placeholder="Nhập số điện thoại"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {/* Nhập OTP + nút lấy OTP / tra cứu */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
          ref={otpInputRef}
        />
        <button
          className="btn btn-warning"
          onClick={countdown > 0 ? handleVerifyOtp : handleRequestOtp}
          disabled={loading}
        >
          {loading
            ? "Đang xử lý..."
            : countdown > 0
            ? "Tra cứu"
            : "Lấy OTP"}
        </button>
      </div>

      {countdown > 0 && (
        <p className="text-muted small">
          OTP đã gửi, còn <b>{countdown}s</b> để nhập.
        </p>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Kết quả */}
      {orders.length > 0 && (
        <div className="mt-3">
          <h4>Kết quả ({orders.length} đơn hàng)</h4>
          {currentOrders.map((o) => (
            <div key={o.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Đơn hàng #{o.id}</h5>
                <p><b>Tổng tiền:</b> {formatCurrency(o.total_price)}</p>
                <p><b>Giao hàng:</b> {o.delivery_method === "home" ? "Tại nhà" : "Tại cửa hàng"}</p>
                {o.delivery_method === "home" && <p><b>Địa chỉ:</b> {o.address}</p>}
                <p><b>Ngày đặt:</b> {new Date(o.created_at).toLocaleString("vi-VN")}</p>
                {/* Trạng thái đơn hàng */}
                <p><b>Trạng thái đơn hàng:</b> {DELIVERY_TEXT[o.delivery_status || "PENDING"]}</p>
                <p><b>Trạng thái đơn hàng:</b> {PAYMENT_TEXT[o.status || "PENDING"]}</p>
                <h6>Sản phẩm:</h6>
                <ul>
                  {o.items.map((it, i) => (
                    <li key={i}>{it.product_name} - SL: {it.quantity} x {formatCurrency(it.unit_price)}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                  <button className="page-link" onClick={() => setCurrentPage((p) => p - 1)}>Trước</button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 && "active"}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
                  <button className="page-link" onClick={() => setCurrentPage((p) => p + 1)}>Sau</button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}

export default GuestOrders;
