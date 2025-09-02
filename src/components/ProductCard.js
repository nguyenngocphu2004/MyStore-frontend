import React from "react";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  if (!product) return null;

  return (
    <div className="card h-100 text-center shadow-sm">
      <img
        src={product.image || "https://via.placeholder.com/200"}
        alt={product.name}
        className="card-img-top"
        style={{ objectFit: "cover", height: "195px" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-semibold">{product.name}</h5>
        <p className="text-danger fw-bold">
          {product.price.toLocaleString("vi-VN")}₫
        </p>

        {/* Có category không thì hiển thị */}


        <div className="mt-auto d-flex justify-content-center gap-2">
          <button className="btn btn-warning">Mua ngay</button>
          <Link to={`/product/${product.id}`} className="btn btn-outline-secondary">
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
