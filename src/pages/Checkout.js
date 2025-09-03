import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Checkout() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // Lấy thông tin product
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
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Không lấy được thông tin user");
        })
        .then((data) => {
          setIsLoggedIn(true);
          setUserInfo({
            name: data.username || "",
            phone: data.phone || "",
          });
        })
        .catch(() => {
          setIsLoggedIn(false);
          setUserInfo({ name: "", phone: "" });
        });
    }
  }, [productId]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!product) return;

    // Với khách, bắt nhập họ tên và số điện thoại
    if (!isLoggedIn) {
      if (!userInfo.name.trim() || !userInfo.phone.trim()) {
        setError("Vui lòng nhập họ tên và số điện thoại");
        return;
      }
    }

    const token = localStorage.getItem("access_token");

    fetch("http://localhost:5000/api/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        product_id: product.id,
        quantity,
        guest_name: !isLoggedIn ? userInfo.name : undefined,
        guest_phone: !isLoggedIn ? userInfo.phone : undefined,
      }),
    })
      .then((res) => res.json().then((data) => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status === 200) {
          alert("Đặt hàng thành công!");
          navigate("/orders"); // Hoặc trang nào bạn muốn chuyển tới sau khi đặt hàng
        } else {
          setError(data.error || "Đặt hàng thất bại");
        }
      })
      .catch(() => setError("Lỗi khi gửi đơn hàng"));
  }

  if (!product) return <p>Đang tải sản phẩm...</p>;

  return (
    <div className="container my-5">
      <h2>Mua hàng: {product.name}</h2>
      <p>Giá: {product.price.toLocaleString("vi-VN")}₫</p>

      <form onSubmit={handleSubmit} className="mt-4">
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

        {!isLoggedIn && (
          <>
            <div className="mb-3">
              <label>Họ tên:</label>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, name: e.target.value }))
                }
                className="form-control"
                required={!isLoggedIn}
              />
            </div>
            <div className="mb-3">
              <label>Số điện thoại:</label>
              <input
                type="tel"
                value={userInfo.phone}
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="form-control"
                required={!isLoggedIn}
              />
            </div>
          </>
        )}

        {isLoggedIn && (
          <div className="mb-3">
            <label>Họ tên:</label>
            <input
              type="text"
              value={userInfo.name}
              className="form-control"
              readOnly
            />
          </div>
        )}

        {isLoggedIn && (
          <div className="mb-3">
            <label>Số điện thoại:</label>
            <input
              type="tel"
              value={userInfo.phone}
              className="form-control"
              readOnly
            />
          </div>
        )}

        {error && <p className="text-danger">{error}</p>}

        <button type="submit" className="btn btn-primary">
          Đặt hàng
        </button>
      </form>
    </div>
  );
}

export default Checkout;
