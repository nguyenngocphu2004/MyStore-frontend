import React from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleBuyNow = (e) => {
    e.stopPropagation(); // Ngăn click nổi lên parent
    navigate(`/checkout/${product.id}`);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  if (!product) return null;

  return (
    <div
      className="card h-100 text-center shadow-sm py-3"
      onClick={handleCardClick}
      style={{ transition: "transform 0.3s", cursor: "pointer" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <img
        src={
          product.images && product.images.length > 0
            ? `${product.images[0]}?v=${new Date().getTime()}`
            : "https://via.placeholder.com/300"
        }
        alt={product.name || "Sản phẩm"}
        className="card-img-top"
        style={{
          width: "100%",
          height: "195px",
          objectFit: "contain",
          backgroundColor: "#fff",
          transition: "transform 0.3s",
        }}
      />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-semibold">{product.name}</h5>
        <h5 className="card-title fw-semibold">{product.stock}</h5>
        <p className="text-danger fw-bold">
          {product.price.toLocaleString("vi-VN")}₫
        </p>

        <div className="mt-auto d-flex justify-content-center gap-2">
          <button onClick={handleBuyNow} className="btn btn-warning">
            Mua ngay
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // ngăn nổi click lên card
              handleCardClick();
            }}
            className="btn btn-outline-secondary"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
