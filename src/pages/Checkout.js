import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function Checkout() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [, setIsLoggedIn] = useState(false);
  const [, setUserInfo] = useState({ name: "", phone: "", email: "" });
  const [checkoutInfo, setCheckoutInfo] = useState({ name: "", phone: "", email: "" });
  const [deliveryMethod, setDeliveryMethod] = useState("store"); // store | home
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  // State riêng cho lỗi realtime
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    // Lấy thông tin sản phẩm
    fetch(`http://localhost:5000/products/${productId}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(() => setProduct(null));

    // Lấy thông tin user nếu đã login
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => {
          setIsLoggedIn(true);
          setUserInfo({
            name: data.username || data.email || "",
            phone: data.phone || "",
            email: data.email || "",
          });
          setCheckoutInfo({
            name: data.username || data.email || "",
            phone: data.phone || "",
            email: data.email || "",
          });
        })
        .catch(() => {
          setIsLoggedIn(false);
          setUserInfo({ name: "", phone: "", email: "" });
          setCheckoutInfo({ name: "", phone: "", email: "" });
        });
    }
  }, [productId]);

  // Validate realtime số điện thoại
  function handlePhoneChange(e) {
    const value = e.target.value;
    setCheckoutInfo((prev) => ({ ...prev, phone: value }));

    // Check số điện thoại 10 số
    const phoneRegex = /^[0-9]{0,10}$/; // cho phép tối đa 10 số nhập
    if (!phoneRegex.test(value)) {
      setPhoneError("Số điện thoại chỉ chứa chữ số và tối đa 10 ký tự");
    } else if (value.length !== 10) {
      setPhoneError("Số điện thoại phải đúng 10 chữ số");
    } else {
      setPhoneError("");
    }
  }

  // Validate realtime email
  function handleEmailChange(e) {
    const value = e.target.value;
    setCheckoutInfo((prev) => ({ ...prev, email: value }));

    if (value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) {
        setEmailError("Email không hợp lệ");
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!product) return;

    if (quantity < 1) {
      setError("Số lượng phải lớn hơn 0");
      return;
    }

    if (!checkoutInfo.name.trim() || !checkoutInfo.phone.trim()) {
      setError("Vui lòng nhập họ tên và số điện thoại");
      return;
    }

    // Kiểm tra lỗi realtime trước khi submit
    if (phoneError) {
      setError(phoneError);
      return;
    }

    if (emailError) {
      setError(emailError);
      return;
    }

    if (deliveryMethod === "home" && !address.trim()) {
      setError("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    const token = localStorage.getItem("token");

    const body = {
      product_id: product.id,
      quantity,
      guest_name: checkoutInfo.name,
      guest_phone: checkoutInfo.phone,
      guest_email: checkoutInfo.email,
      delivery_method: deliveryMethod,
      address: deliveryMethod === "home" ? address : undefined,
    };

    fetch("http://localhost:5000/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json().then((data) => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status === 200) {
          const orderId = data.order.id;
          navigate(`/payment/${orderId}`);
        } else {
          setError(data.error || "Đặt hàng thất bại");
        }
      })
      .catch(() => setError("Lỗi khi gửi đơn hàng"));
  }

  if (!product) return <p>Đang tải sản phẩm...</p>;

  return (
    <div className="container my-5">
      <div className="row">
        {/* Cột trái - thông tin sản phẩm */}
        <div className="col-md-6 text-center">
          <img
            src={
              product.images && product.images.length > 0
                ? product.images[0]
                : "https://via.placeholder.com/300"
            }
            alt={product.name}
            className="img-fluid mb-3"
            style={{ maxHeight: "300px", objectFit: "contain" }}
          />
          <h3>{product.name}</h3>
          <p className="text-danger fw-bold">
            {product.price.toLocaleString("vi-VN")}₫
          </p>
          <Link to={`/product/${product.id}`} className="btn btn-outline-secondary btn-sm">
            Xem chi tiết
          </Link>
        </div>

        {/* Cột phải - form đặt hàng */}
        <div className="col-md-6">
          <h4>Thông tin đơn hàng</h4>
          <form onSubmit={handleSubmit} className="mt-3">
            {/* Số lượng */}
            <div className="mb-3">
              <label>Số lượng:</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="form-control"
              />
            </div>

            {/* Thông tin khách / user */}
            <div className="mb-3">
              <label>Họ tên:</label>
              <input
                type="text"
                value={checkoutInfo.name}
                onChange={(e) =>
                  setCheckoutInfo((prev) => ({ ...prev, name: e.target.value }))
                }
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label>Số điện thoại:</label>
              <input
                type="tel"
                value={checkoutInfo.phone}
                onChange={handlePhoneChange}
                className="form-control"
                required
              />
              {phoneError && <small className="text-danger">{phoneError}</small>}
            </div>
            <div className="mb-3">
              <label>Email:</label>
              <input
                type="email"
                value={checkoutInfo.email}
                onChange={handleEmailChange}
                className="form-control"
              />
              {emailError && <small className="text-danger">{emailError}</small>}
            </div>

            {/* Phương thức nhận hàng */}
            <div className="mb-3">
              <label>Phương thức nhận hàng:</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    id="store"
                    value="store"
                    checked={deliveryMethod === "store"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="form-check-input"
                  />
                  <label htmlFor="store" className="form-check-label">
                    Lấy tại cửa hàng
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    id="home"
                    value="home"
                    checked={deliveryMethod === "home"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="form-check-input"
                  />
                  <label htmlFor="home" className="form-check-label">
                    Giao tận nhà
                  </label>
                </div>
              </div>
            </div>

            {/* Nhập địa chỉ nếu giao tận nhà */}
            {deliveryMethod === "home" && (
              <div className="mb-3">
                <label>Địa chỉ giao hàng:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            )}

            {error && <p className="text-danger">{error}</p>}

            <button type="submit" className="btn btn-warning w-100">
              Đặt hàng
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
