import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CheckoutCart() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // <-- Thêm state thông báo
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const createOrder = async () => {
      try {
        const checkoutInfo = JSON.parse(localStorage.getItem("checkoutInfo"));
        const selectedProducts = JSON.parse(localStorage.getItem("selectedProducts"));

        if (!checkoutInfo || !selectedProducts || selectedProducts.length === 0) {
          setError("Không tìm thấy thông tin đơn hàng hoặc sản phẩm chưa được chọn.");
          setLoading(false);
          return;
        }

        const res = await axios.post(
          "http://localhost:5000/create_order_from_cart",
          { checkoutInfo, products: selectedProducts },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setOrder(res.data);
      } catch (err) {
        console.error("Lỗi tạo đơn hàng:", err);
        setError("Lỗi tạo đơn hàng, vui lòng thử lại.");
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

  const handlePay = async () => {
    if (!selectedMethod) {
      setError("Vui lòng chọn phương thức thanh toán");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage(""); // Reset thông báo cũ

    try {
      let url = "";
      if (selectedMethod === "Momo") url = `http://localhost:5000/api/create_momo_payment/${order.order_id}`;
      else if (selectedMethod === "ZaloPay") url = `http://localhost:5000/api/create_zalopay_payment/${order.order_id}`;
      else if (selectedMethod === "COD") url = `http://localhost:5000/api/pay_cod/${order.order_id}`;

      const res = await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      const data = res.data;

      if (selectedMethod === "COD") {
        setSuccessMessage("Đơn hàng đã được xác nhận, thanh toán khi nhận hàng!");
        localStorage.removeItem("selectedProducts");
        localStorage.removeItem("checkoutInfo");
        setTimeout(() => navigate("/profile"), 2000);
      } else if (data.payUrl) {
        localStorage.removeItem("selectedProducts");
        localStorage.removeItem("checkoutInfo");
        window.location.href = data.payUrl;
      } else {
        setError(data.error || "Không thể xử lý thanh toán");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  const paymentOptions = [
    { value: "Momo", label: "Thanh toán qua MoMo", logo: "https://res.cloudinary.com/dbnra16ca/image/upload/v1758082184/MoMo_Logo_dlzdlh.png" },
    { value: "ZaloPay", label: "Thanh toán qua ZaloPay", logo: "https://res.cloudinary.com/dbnra16ca/image/upload/v1758082184/Zalo_logo_rjmkwb.png" },
    { value: "COD", label: "Thanh toán khi nhận hàng", logo: "https://res.cloudinary.com/dbnra16ca/image/upload/v1758082325/cash-on-delivery-banner_ddmuaa.png" },
  ];

  if (loading) return <div className="container py-5 text-center">Đang xử lý...</div>;
  if (!order) return <div className="container py-5 text-center">{error || "Không tạo được đơn hàng."}</div>;

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="card shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="card-header bg-warning text-center" style={{ color: "#000" }}>
          <h4 className="mb-0">Thanh toán đơn hàng #{order.order_id}</h4>
        </div>

        <div className="card-body">
          <p className="text-center fs-5 mb-3">
            <strong>Tổng tiền: </strong>
            <span className="text-danger">{order.total_price.toLocaleString("vi-VN")}₫</span>
          </p>

          <div className="mb-4">
            {paymentOptions.map(opt => (
              <label
                key={opt.value}
                className={`d-flex align-items-center border rounded p-3 mb-3 shadow-sm ${selectedMethod === opt.value ? "bg-warning bg-opacity-25 border-warning" : ""}`}
                style={{ cursor: "pointer" }}
              >
                <input
                  type="radio"
                  name="payment"
                  value={opt.value}
                  checked={selectedMethod === opt.value}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="d-none"
                />
                <img src={opt.logo} alt={opt.value} width={40} className="me-3" />
                <span className="fs-6">{opt.label}</span>
              </label>
            ))}
          </div>

          {/* Hiển thị thông báo */}
          {error && <div className="alert alert-danger text-center">{error}</div>}
          {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

          <button
            className="w-100 py-2 fs-5"
            style={{ backgroundColor: "#ffba00", border: "none", color: "#000", borderRadius: "6px" }}
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Thanh toán"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutCart;
