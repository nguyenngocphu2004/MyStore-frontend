import React, { useState } from "react";

function GuestOrders() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setOrders([]);

    if (!phone.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/orders/guest?phone=${phone}`);
      const data = await res.json();
      if (res.ok) {
        if (data.length === 0) {
          setError("Không tìm thấy đơn hàng nào với số điện thoại này.");
        } else {
          setOrders(data);
        }
      } else {
        setError(data.error || "Có lỗi xảy ra");
      }
    } catch {
      setError("Không thể kết nối server");
    }
  };

  return (
    <div className="container my-5">
      <h2>Tra cứu đơn hàng cho khách vãng lai</h2>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group">
          <input
            type="tel"
            className="form-control"
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Tra cứu
          </button>
        </div>
      </form>

      {error && <p className="text-danger">{error}</p>}

      {orders.length > 0 && (
        <div>
          <h4>Kết quả:</h4>
          {orders.map((order) => (
            <div key={order.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Đơn hàng #{order.id}</h5>
                <p>
                  <strong>Tổng tiền:</strong>{" "}
                  {order.total_price.toLocaleString("vi-VN")}₫
                </p>
                <p>
                  <strong>Hình thức giao hàng:</strong>{" "}
                  {order.delivery_method === "home"
                    ? "Giao tại nhà"
                    : "Nhận tại cửa hàng"}
                </p>
                {order.delivery_method === "home" && (
                  <p>
                    <strong>Địa chỉ:</strong> {order.address}
                  </p>
                )}
                <p>
                  <strong>Ngày đặt:</strong> {order.created_at}
                </p>
                <h6>Sản phẩm:</h6>
                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.product_name} - SL: {item.quantity} x{" "}
                      {item.unit_price.toLocaleString("vi-VN")}₫
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GuestOrders;
