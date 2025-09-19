import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ConfirmModal({ show, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title btn">Xác nhận</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>
              Hủy
            </button>
            <button className="btn btn-warning" onClick={onConfirm}>
              Đồng ý
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("");

  // State modal xác nhận COD
  const [showConfirmCOD, setShowConfirmCOD] = useState(false);

  // State thông báo (thay alert)
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch(() => setOrder(null));
  }, [orderId]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

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
          showNotification("Đơn hàng đã được xác nhận, thanh toán khi nhận hàng!");
          navigate("/profile");
        } else if (data.payUrl) {
          window.location.href = data.payUrl;
        }
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

  const handlePay = () => {
    if (!selectedMethod) {
      setError("⚠️ Vui lòng chọn phương thức thanh toán");
      return;
    }

    if (selectedMethod === "COD") {
      // Hiển thị modal xác nhận trước khi thanh toán COD
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
      {notification && (
        <div
          className="alert alert-warning position-fixed top-0 end-0 m-3 shadow"
          style={{ zIndex: 1055 }}
        >
          {notification}
        </div>
      )}

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
