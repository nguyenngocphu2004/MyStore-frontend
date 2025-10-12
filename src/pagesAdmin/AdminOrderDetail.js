import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/admin/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        alert("Lỗi khi tải chi tiết đơn hàng");
      }
    };

    fetchOrder();
  }, [id, token]);

  if (!order) return <p>Đang tải...</p>;

  return (
    <div>
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        &lt; Quay lại
      </button>

      <h2>Chi tiết đơn hàng #{order.order_code}</h2>
      <p>
        <strong>Khách/User:</strong> {order.user ? order.user.username : order.guest_name || "Ẩn danh"} <br />
        <strong>SĐT:</strong> {order.user ? order.user.phone : order.guest_phone || "-"} <br />
        <strong>Ngày tạo:</strong> {new Date(order.created_at).toLocaleString("vi-VN")} <br />
        <strong>Địa chỉ:</strong> {order.address || "Không có"} <br />
        <strong>Phương thức thanh toán:</strong> {order.payment_method} <br />
        <strong>Nhận hàng:</strong>{" "}
            {order.delivery_method === "store"
              ? "Cửa hàng"
              : order.delivery_method === "home"
              ? "Nhận tại nhà"
              : order.delivery_method}
        <br/>
        <strong>Tổng tiền:</strong> {Number(order.total_price).toLocaleString("vi-VN")}₫
      </p>

      <h4>Chi tiết món hàng</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.product_name}</td>
              <td>{item.quantity}</td>
              <td>{Number(item.unit_price).toLocaleString("vi-VN")}₫</td>
              <td>{Number(item.total_price).toLocaleString("vi-VN")}₫</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
