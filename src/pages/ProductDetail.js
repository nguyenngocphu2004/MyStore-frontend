import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [adding, setAdding] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    axios.get(`http://localhost:5000/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error("Lỗi khi lấy chi tiết sản phẩm:", err));
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    // Lấy vị trí ảnh sản phẩm và icon giỏ hàng
    const cartIcon = document.getElementById("cart-icon");
    if (!imgRef.current || !cartIcon) {
      alert("Lỗi: không tìm thấy ảnh sản phẩm hoặc icon giỏ hàng.");
      return;
    }

    const imgRect = imgRef.current.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    // Clone ảnh sản phẩm
    const cloneImg = imgRef.current.cloneNode(true);
    cloneImg.style.position = "fixed";
    cloneImg.style.left = `${imgRect.left}px`;
    cloneImg.style.top = `${imgRect.top}px`;
    cloneImg.style.width = `${imgRect.width}px`;
    cloneImg.style.height = `${imgRect.height}px`;
    cloneImg.style.transition = "all 1s ease-in-out";
    cloneImg.style.zIndex = 1000;
    cloneImg.style.borderRadius = "8px";
    cloneImg.style.pointerEvents = "none"; // tránh ảnh hưởng đến tương tác
    document.body.appendChild(cloneImg);

    // Force reflow để chắc chắn áp dụng vị trí ban đầu
    cloneImg.getBoundingClientRect();

    // Bắt đầu animation bay vào giỏ hàng
    cloneImg.style.left = `${cartRect.left + cartRect.width / 2}px`;
    cloneImg.style.top = `${cartRect.top + cartRect.height / 2}px`;
    cloneImg.style.width = "0px";
    cloneImg.style.height = "0px";
    cloneImg.style.opacity = "0.5";

    cloneImg.addEventListener("transitionend", () => {
      cloneImg.remove();
    });

    setAdding(true);
    try {
      await axios.post("http://localhost:5000/cart/add", {
        product_id: product.id,
        quantity: 1,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("🛒 Đã thêm vào giỏ hàng!");
      // TODO: Cập nhật giỏ hàng trong state hoặc context nếu có

    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      if (error.response?.status === 401) {
        alert("Bạn cần đăng nhập lại!");
      } else {
        alert("Thêm vào giỏ hàng thất bại!");
      }
    } finally {
      setAdding(false);
    }
  };

  if (!product) return <p>Đang tải...</p>;

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-5">
          <img
            ref={imgRef}
            src={product.image || "https://via.placeholder.com/300"}
            alt={product.name}
            className="img-fluid"
            style={{ borderRadius: "8px" }}
          />
        </div>
        <div className="col-md-7">
          <h2>{product.name}</h2>
          <h4 className="text-danger">
            {Number(product.price).toLocaleString("vi-VN")}₫
          </h4>

          <table className="table mt-3">
            <tbody>
              <tr><th>Hãng</th><td>{product.brand}</td></tr>
              <tr><th>CPU</th><td>{product.cpu || "Chưa rõ"}</td></tr>
              <tr><th>RAM</th><td>{product.ram}</td></tr>
              <tr><th>Bộ nhớ</th><td>{product.storage}</td></tr>
              <tr><th>Màn hình</th><td>{product.screen}</td></tr>
              <tr><th>Pin</th><td>{product.battery}</td></tr>
              <tr><th>Hệ điều hành</th><td>{product.os}</td></tr>
              <tr><th>Camera trước</th><td>{product.camera_front}</td></tr>
              <tr><th>Camera sau</th><td>{product.camera_rear}</td></tr>
              <tr><th>Màu sắc</th><td>{product.color}</td></tr>
              <tr><th>Kích thước</th><td>{product.dimensions}</td></tr>
              <tr><th>Trọng lượng</th><td>{product.weight}</td></tr>
              <tr><th>Cổng kết nối</th><td>{product.ports}</td></tr>
              <tr><th>Bảo hành</th><td>{product.warranty}</td></tr>
              <tr><th>Ngày phát hành</th><td>{product.release_date}</td></tr>
            </tbody>
          </table>

          <button
            onClick={handleAddToCart}
            className="btn btn-warning mt-3"
            disabled={adding}
          >
            {adding ? "Đang thêm..." : "Thêm vào giỏ"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
