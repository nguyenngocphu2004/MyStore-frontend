// src/pages/Payment.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/orders/${orderId}`)
      .then(res => res.json())
      .then(data => setOrder(data))
      .catch(() => setOrder(null));
  }, [orderId]);

  const handlePayMomo = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/create_momo_payment/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (res.ok && data.payUrl) {
        window.location.href = data.payUrl;
      } else {
        setError(data.error || "Không tạo được link thanh toán Momo");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối server Momo");
    } finally {
      setLoading(false);
    }
  };

  const handlePayZaloPay = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/create_zalopay_payment/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (res.ok && data.payUrl) {
        window.location.href = data.payUrl;
      } else {
        setError(data.error || "Không tạo được link thanh toán ZaloPay");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối server ZaloPay");
    } finally {
      setLoading(false);
    }
  };

  const handleCOD = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/pay_cod/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (res.ok) {
        alert("Đơn hàng đã được xác nhận, thanh toán khi nhận hàng!");
        navigate("/orders");
      } else {
        setError(data.error || "Không thể xác nhận COD");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối server COD");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Thanh toán cho đơn hàng #{orderId}</h4>
        </div>
        <div className="card-body">
          {order ? (
            <>
              <div className="mb-4">
                <h5>Thông tin đơn hàng</h5>
                <p><strong>Tổng tiền:</strong> {order.total_price?.toLocaleString("vi-VN")}₫</p>
                <p><strong>Trạng thái:</strong> <span className={`badge ${order.status === "PENDING" ? "bg-warning" : order.status === "PAID" ? "bg-success" : "bg-secondary"}`}>{order.status}</span></p>
              </div>
              <div className="mb-4">
                <h5>Sản phẩm</h5>
                <ul className="list-group">
                  {order.items.map(item => (
                    <li key={item.product_id} className="list-group-item d-flex justify-content-between align-items-center">
                      Sản phẩm #{item.product_id} x {item.quantity}
                      <span>{item.unit_price.toLocaleString("vi-VN")}₫</span>
                    </li>
                  ))}
                </ul>
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="d-flex flex-column flex-md-row gap-3 mt-4">
                <button className="btn btn-primary flex-fill" onClick={handlePayMomo} disabled={loading}>
                  {loading ? "Đang tạo thanh toán..." : "Thanh toán Momo"}
                </button>
                <button className="btn btn-success flex-fill" onClick={handlePayZaloPay} disabled={loading}>
                  {loading ? "Đang tạo thanh toán..." : "Thanh toán ZaloPay"}
                </button>
                <button className="btn btn-warning flex-fill" onClick={handleCOD} disabled={loading}>
                  {loading ? "Đang xử lý..." : "Thanh toán khi nhận hàng (COD)"}
                </button>
              </div>
            </>
          ) : (
            <p>Đang tải thông tin đơn hàng...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Payment;
