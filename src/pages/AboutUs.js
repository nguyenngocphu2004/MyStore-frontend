import React from "react";
import {
  FaBoxOpen,
  FaHeadset,
  FaShippingFast,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt
} from "react-icons/fa";

function AboutUs() {
  return (
    <div className="container my-5">
      {/* Tiêu đề */}
      <h2 className="text-center mb-4 fw-bold">
        Về Chúng Tôi
      </h2>

      {/* Phần giới thiệu */}
      <p
        className="text-center text-muted mb-5"
        style={{ fontSize: "1.15rem", lineHeight: "1.8" }}
      >
        Chào mừng bạn đến với <strong style={{fontSize: "1.3rem" }}>
             PhuStore
        </strong> –
        cửa hàng chuyên cung cấp các sản phẩm công nghệ chính hãng, chất lượng và giá cả hợp lý.
        <br />
        Sứ mệnh của chúng tôi là mang đến cho khách hàng trải nghiệm mua sắm
        trực tuyến <span className="fw-bold">an toàn</span>, <span className="fw-bold">nhanh chóng</span> và <span className="fw-bold">tiện lợi</span>.
      </p>

      {/* 3 cột giới thiệu */}
      <div className="row text-center">
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow border-0 rounded-4 p-3">
            <FaBoxOpen className="mb-3" size={40} color="#ff6600" />
            <h5 className="fw-bold">Sản phẩm chính hãng</h5>
            <p className="text-muted">
              Cam kết 100% sản phẩm chính hãng, bảo hành đầy đủ, giúp khách hàng yên tâm tuyệt đối.
            </p>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow border-0 rounded-4 p-3">
            <FaHeadset className="mb-3" size={40} color="#28a745" />
            <h5 className="fw-bold">Dịch vụ tận tâm</h5>
            <p className="text-muted">
              Hỗ trợ khách hàng 24/7, luôn sẵn sàng giải đáp thắc mắc và mang đến trải nghiệm tốt nhất.
            </p>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow border-0 rounded-4 p-3">
            <FaShippingFast className="mb-3" size={40} color="#007bff" />
            <h5 className="fw-bold">Giao hàng nhanh chóng</h5>
            <p className="text-muted">
              Dịch vụ vận chuyển toàn quốc, nhanh gọn, an toàn, với chi phí hợp lý nhất.
            </p>
          </div>
        </div>
      </div>

      {/* Thông tin liên hệ với icon */}
      <div className="mt-5 text-center">
        <h4 className="fw-bold mb-3">
          Liên hệ với chúng tôi
        </h4>
        <p className="text-muted mb-1">
          <FaMapMarkerAlt className="me-2" /> 35c Đường 109, Phước Long B
        </p>
        <p className="text-muted mb-1">
          <FaPhoneAlt className="me-2" />
          <a
            href="tel:0123456789"
            className="fw-bold text-decoration-none text-dark"
            style={{ cursor: "pointer" }}
          >
            0123 456 789
          </a>
        </p>
        <p className="text-muted">
          <FaEnvelope className="me-2" />
          <a
            href="mailto:support@phustore.vn"
            className="fw-bold text-decoration-none text-dark"
            style={{ cursor: "pointer" }}
          >
            support@phustore.vn
          </a>
        </p>
      </div>
    </div>
  );
}

export default AboutUs;
