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

  // Thanh toán Momo
  const handleMomoPayment = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/create_momo_payment/${order.order_id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = res.data.payUrl;
    } catch (err) {
      console.error("Lỗi Momo:", err);
    }
  };

  // Thanh toán ZaloPay (chưa backend)
  const handleZaloPayPayment = async () => {
    alert("Chức năng ZaloPay sẽ được triển khai sau.");
    // Khi backend sẵn sàng, thay alert bằng call API:
    // try {
    //   const res = await axios.post(
    //     `http://localhost:5000/api/create_zalopay_payment/${order.order_id}`,
    //     {},
    //     { headers: { Authorization: `Bearer ${token}` } }
    //   );
    //   window.location.href = res.data.payUrl;
    // } catch (err) {
    //   console.error("Lỗi ZaloPay:", err);
    // }
  };

  if (loading)
    return <div className="container py-5 text-center">Đang xử lý...</div>;

  if (!order)
    return <div className="container py-5 text-center">Không tạo được đơn hàng.</div>;

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "500px" }}>
        <h2 className="mb-3 text-center">Thanh toán đơn hàng #{order.order_id}</h2>
        <p className="text-center fs-5">
          Tổng tiền: <strong>{order.total_price.toLocaleString("vi-VN")}₫</strong>
        </p>

        <h5 className="mt-4 mb-3">Chọn phương thức thanh toán:</h5>
        <div className="d-flex flex-column gap-3">
          <button
            className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
            onClick={handleMomoPayment}
            style={{ fontWeight: "500" }}
          >
             Thanh toán qua Momo
          </button>

          <button
            className="btn btn-warning d-flex align-items-center justify-content-center gap-2"
            onClick={handleZaloPayPayment}
            style={{ fontWeight: "500", color: "#fff" }}
          >
            Thanh toán qua ZaloPay
          </button>

          <button
            className="btn btn-success d-flex align-items-center justify-content-center gap-2"
            style={{ fontWeight: "500" }}
          >
             Thanh toán khi nhận hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutCart;
