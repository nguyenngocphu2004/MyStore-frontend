import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function CheckoutCartInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedProducts = location.state?.selectedProducts || [];

  const [info, setInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    deliveryMethod: "store",
  });
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // Lấy thông tin user nếu đã đăng nhập
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data;
        setInfo((prev) => ({
          ...prev,
          name: user.username || "",
          phone: user.phone || "",
          email: user.email || "",
          address: user.address || "",
        }));
      } catch (err) {
        console.error("Lỗi lấy thông tin profile:", err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!info.name || !info.phone) {
      setError("Vui lòng nhập họ tên và số điện thoại");
      return;
    }
    if (info.deliveryMethod === "home" && !info.address) {
      setError("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    if (selectedProducts.length === 0) {
      setError("Chưa có sản phẩm nào được chọn để đặt hàng");
      return;
    }

    // Lưu thông tin nhận hàng và sản phẩm đã chọn để trang thanh toán dùng
    localStorage.setItem("checkoutInfo", JSON.stringify(info));
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));

    // Chuyển sang trang thanh toán
    navigate("/checkout-cart");
  };

  return (
    <div className="container py-5" style={{ maxWidth: "500px" }}>
      <h3>Thông tin nhận hàng</h3>
      <form onSubmit={handleSubmit}>
        {/* Form nhập thông tin */}
        <div className="mb-3">
          <label>Họ tên:</label>
          <input
            type="text"
            className="form-control"
            value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>Số điện thoại:</label>
          <input
            type="tel"
            className="form-control"
            value={info.phone}
            onChange={(e) => setInfo({ ...info, phone: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={info.email}
            onChange={(e) => setInfo({ ...info, email: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>Phương thức nhận hàng:</label>
          <div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                className="form-check-input"
                checked={info.deliveryMethod === "store"}
                onChange={() => setInfo({ ...info, deliveryMethod: "store" })}
              />
              <label className="form-check-label">Lấy tại cửa hàng</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                className="form-check-input"
                checked={info.deliveryMethod === "home"}
                onChange={() => setInfo({ ...info, deliveryMethod: "home" })}
              />
              <label className="form-check-label">Giao tận nhà</label>
            </div>
          </div>
        </div>
        {info.deliveryMethod === "home" && (
          <div className="mb-3">
            <label>Địa chỉ:</label>
            <input
              type="text"
              className="form-control"
              value={info.address}
              onChange={(e) => setInfo({ ...info, address: e.target.value })}
            />
          </div>
        )}
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary w-100">
          Xác nhận
        </button>
      </form>

      {/* Hiển thị danh sách sản phẩm đã chọn */}
      {selectedProducts.length > 0 && (
        <>
          <h4 className="mt-4">Sản phẩm đã chọn:</h4>
          <ul className="list-group">
            {selectedProducts.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                {item.name} - {item.quantity} x {item.unit_price.toLocaleString("vi-VN")}₫
                <span>{(item.quantity * item.unit_price).toLocaleString("vi-VN")}₫</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default CheckoutCartInfo;
