import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error("Lỗi khi lấy chi tiết sản phẩm:", err));
  }, [id]);

  if (!product) return <p>Đang tải...</p>;

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-5">
          <img
            src={product.image || "https://via.placeholder.com/300"}
            alt={product.name}
            className="img-fluid"
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

          <button className="btn btn-warning mt-3">Thêm vào giỏ</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
