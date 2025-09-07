import React from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleBuyNow = (e) => {
    e.stopPropagation();
    navigate(`/checkout/${product.id}`);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  if (!product) return null;

  // Badge text (ví dụ: nếu bán nhiều thì HOT, nếu mới ra mắt thì NEW)
  let badgeText = "";
  if (product.sold > 0) {
    badgeText = "HOT";
  } else if (product.release_date && new Date(product.release_date) > new Date("2025-01-01")) {
    badgeText = "NEW";
  }

  return (
    <div
      className="card h-100"
      onClick={handleCardClick}
      style={{
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        cursor: "pointer",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #ddd",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
        e.currentTarget.style.borderColor = "#f0ad4e";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
        e.currentTarget.style.borderColor = "#ddd";
      }}
    >
      {/* Badge */}
      {badgeText && (
        <span
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: badgeText === "HOT" ? "#dc3545" : "#28a745", // đỏ cho HOT, xanh cho NEW
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "8px",
            fontSize: "0.75rem",
            fontWeight: "bold",
            zIndex: 10,
          }}
        >
          {badgeText}
        </span>
      )}

      {/* Ảnh sản phẩm */}
      <div style={{ background: "#fff", padding: "10px" }}>
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
            height: "200px",
            objectFit: "contain",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>

      {/* Nội dung */}
      <div className="card-body d-flex flex-column text-center px-3">
        <h6 className="fw-semibold text-truncate">{product.name}</h6>

        <small className="text-muted mb-1">
          Đã bán: <span className="fw-bold">{product.sold}</span>
        </small>

        <p className="text-danger fw-bold mb-3" style={{ fontSize: "1.1rem" }}>
          {product.price.toLocaleString("vi-VN")}₫
        </p>

        <div className="mt-auto d-flex justify-content-center gap-2">
          <button
            onClick={handleBuyNow}
            className="btn btn-warning px-3 rounded-pill fw-semibold"
          >
            Mua ngay
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="btn btn-outline-secondary px-3 rounded-pill"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
