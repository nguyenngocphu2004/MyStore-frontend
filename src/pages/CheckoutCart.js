import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CheckoutCart() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Tạo đơn hàng từ giỏ
  useEffect(() => {
    const createOrder = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/create_order_from_cart",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrder(res.data);
      } catch (err) {
        console.error("Lỗi tạo đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) createOrder();
    else {
      setLoading(false);
      navigate("/login");
    }
  }, [token, navigate]);

  // Thanh toán qua Momo
  const handleMomoPayment = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/create_momo_payment/${order.order_id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = res.data.payUrl; // chuyển sang cổng Momo
    } catch (err) {
      console.error("Lỗi Momo:", err);
    }
  };

  if (loading) return <div className="container py-4">Đang xử lý...</div>;

  if (!order) return <div className="container py-4">Không tạo được đơn hàng.</div>;

  return (
    <div className="container py-4">
      <h2>💳 Thanh toán đơn hàng #{order.order_id}</h2>
      <p>Tổng tiền: <strong>{order.total_price.toLocaleString("vi-VN")}₫</strong></p>

      <h4>Chọn phương thức thanh toán:</h4>
      <div className="d-flex gap-3">
        <button className="btn btn-outline-primary" onClick={handleMomoPayment}>
          Thanh toán qua Momo
        </button>
        <button className="btn btn-outline-success">
          Thanh toán khi nhận hàng
        </button>
      </div>
    </div>
  );
}

export default CheckoutCart;
