import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("");

  // State modal xác nhận COD
  const [showConfirmCOD, setShowConfirmCOD] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch(() => setOrder(null));
  }, [orderId]);

  const processPayment = async () => {
    setLoading(true);
    setError("");

    try {
      let url = "";
      if (selectedMethod === "Momo") {
        url = `http://localhost:5000/api/create_momo_payment/${orderId}`;
      } else if (selectedMethod === "ZaloPay") {
        url = `http://localhost:5000/api/create_zalopay_payment/${orderId}`;
      } else if (selectedMethod === "COD") {
        url = `http://localhost:5000/api/pay_cod/${orderId}`;
      }

      const res = await fetch(url, { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        if (selectedMethod === "COD") {
          toast.success("Đơn hàng đã được xác nhận, thanh toán khi nhận hàng!");
          setTimeout(() => navigate("/profile"), 2000);
        } else if (data.payUrl) {
          window.location.href = data.payUrl;
        }
      } else {
        setError(data.error || "Không thể xử lý thanh toán");
        toast.error(data.error || "Không thể xử lý thanh toán");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối server");
      toast.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = () => {
    if (!selectedMethod) {
      setError("Vui lòng chọn phương thức thanh toán");
      toast.warning("Vui lòng chọn phương thức thanh toán");
      return;
    }

    if (selectedMethod === "COD") {
      setShowConfirmCOD(true);
    } else {
      processPayment();
    }
  };

  const handleConfirmCOD = () => {
    setShowConfirmCOD(false);
    processPayment();
  };

  const paymentOptions = [
    {
      value: "Momo",
      label: "Thanh toán qua MoMo",
      logo: "https://res.cloudinary.com/dbnra16ca/image/upload/v1758082184/MoMo_Logo_dlzdlh.png",
    },
    {
      value: "ZaloPay",
      label: "Thanh toán qua ZaloPay",
      logo: "https://res.cloudinary.com/dbnra16ca/image/upload/v1758082184/Zalo_logo_rjmkwb.png",
    },
    {
      value: "COD",
      label: "Thanh toán khi nhận hàng",
      logo: "https://res.cloudinary.com/dbnra16ca/image/upload/v1758082325/cash-on-delivery-banner_ddmuaa.png",
    },
  ];

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="card shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
        <div
          className="card-header bg-warning text-center"
          style={{ backgroundColor: "#ffba00", color: "#000" }}
        >
          <h4 className="mb-0">Chọn phương thức thanh toán</h4>
        </div>

        <div className="card-body">
          {order ? (
            <>
              <p className="text-center fs-5 mb-3">
                <strong>Tổng tiền: </strong>
                <span className="text-danger">
                  {order.total_price?.toLocaleString("vi-VN")}₫
                </span>
              </p>

              <div className="mb-4">
                {paymentOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`d-flex align-items-center border rounded p-3 mb-3 shadow-sm ${
                      selectedMethod === opt.value ? "bg-warning bg-opacity-25 border-warning" : ""
                    }`}
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

              {error && <div className="alert alert-danger text-center">{error}</div>}

              <button
                className="w-100 py-2 fs-5"
                style={{
                  backgroundColor: "#ffba00",
                  border: "none",
                  color: "#000",
                  borderRadius: "6px",
                }}
                onClick={handlePay}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Thanh toán"}
              </button>
            </>
          ) : (
            <p className="text-center">Đang tải thông tin đơn hàng...</p>
          )}
        </div>
      </div>

      {/* Modal xác nhận COD */}
      <ConfirmModal
        show={showConfirmCOD}
        message="Bạn chắc chắn muốn thanh toán khi nhận hàng (COD)?"
        onConfirm={handleConfirmCOD}
        onCancel={() => setShowConfirmCOD(false)}
      />
    </div>
  );
}

export default Payment;
