import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        alert("Lỗi khi tải danh sách đơn hàng");
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div>
      <h2>Danh sách đơn hàng</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Khách/Người dùng</th>
            <th>SĐT</th>
            <th>Ngày tạo</th>
            <th>Tổng tiền</th>
            <th>Phương thức</th>
            <th>Số món</th>
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
    </div>
  );
}
