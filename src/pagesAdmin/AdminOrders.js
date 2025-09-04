import React, { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const token = localStorage.getItem("adminToken");

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:5000/admin/orders", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders);
      setTotalRevenue(data.total_revenue);
    } else {
      console.error("Không lấy được đơn hàng");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Quản lý đơn hàng</h3>
      <h5>Tổng doanh thu: {totalRevenue.toLocaleString()} VNĐ</h5>

      <table className="table table-striped table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Điện thoại</th>
            <th>Tổng tiền</th>
            <th>Phương thức giao hàng</th>
            <th>Địa chỉ</th>
            <th>Ngày tạo</th>
            <th>Sản phẩm</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.user_id ? `User ${o.user_id}` : o.guest_name}</td>
              <td>{o.user_id ? "" : o.guest_phone}</td>
              <td>{o.total_price.toLocaleString()}</td>
              <td>{o.delivery_method}</td>
              <td>{o.address || "-"}</td>
              <td>{o.created_at}</td>
              <td>
                {o.items.map((item, i) => (
                  <div key={i}>
                    {item.product_name} x {item.quantity} = {item.total_price.toLocaleString()}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
