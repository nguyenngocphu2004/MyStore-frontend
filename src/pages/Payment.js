// src/pages/Payment.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Payment() {
  const { orderId } = useParams();
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
        setError(data.error || "Không tạo được link thanh toán");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h3>Thanh toán cho đơn hàng #{orderId}</h3>
      {order && (
        <div className="mb-3">
          <p><strong>Tổng tiền:</strong> {order.total_price?.toLocaleString("vi-VN")}₫</p>
          <p><strong>Trạng thái:</strong> {order.status}</p>
          <ul>
            {order.items.map(item => (
              <li key={item.product_id}>
                Sản phẩm #{item.product_id}, Số lượng: {item.quantity}, Giá: {item.unit_price}
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="text-danger">{error}</p>}
      <button className="btn btn-primary" onClick={handlePayMomo} disabled={loading}>
        {loading ? "Đang tạo thanh toán..." : "Thanh toán Momo"}
      </button>
    </div>
  );
}

export default Payment;
