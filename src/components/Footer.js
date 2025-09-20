import React from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

function Footer() {
  const iconHoverEffect = (e, color = "#ffc107") => {
    e.currentTarget.style.color = color;
    e.currentTarget.style.transform = "scale(1.2)";
    e.currentTarget.style.textShadow = "0 0 8px rgba(255,255,255,0.8)";
  };

  const iconLeaveEffect = (e) => {
    e.currentTarget.style.color = "#fff";
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.textShadow = "none";
  };

  return (
    <footer
      className="bg-dark text-light py-4"
      style={{
        background: "linear-gradient(135deg, #000000, #1a1a1a)",
        color: "#fff",
        marginTop: "200px"
      }}
    >
      <div className="container">
        <div className="row text-center text-md-start">
          {/* Logo + giới thiệu */}
          <div className="col-md-4 mb-4">
            <h5
              className="fw-bold mb-3 d-flex justify-content-center justify-content-md-start align-items-center gap-2"
              style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.7)", cursor: "pointer" }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <span style={{ color: "#ffc107", fontSize: "1.4rem" }}>PhuStore</span>
            </h5>
            <p
              className="text-white-50"
              style={{
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                fontSize: "1.05rem" // tăng font size
              }}
            >
              Nơi mua sắm điện thoại, laptop, phụ kiện chính hãng với giá tốt nhất. Cam kết chất lượng & dịch vụ hàng đầu.
            </p>
          </div>

          {/* Liên kết nhanh */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold mb-3" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>Liên kết nhanh</h6>
            <ul className="list-unstyled d-flex flex-column align-items-center align-items-md-start">
              {[
                { name: "Điện thoại", href: "/phones" },
                { name: "Laptop", href: "/laptops" },
                { name: "Giỏ hàng", href: "/cart" },
              ].map((link) => (
                <li key={link.href} className="mb-1">
                  <a
                    href={link.href}
                    className="text-white text-decoration-none"
                    style={{
                      transition: "color 0.2s",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                      fontSize: "1rem" // tăng font size
                    }}
                    onMouseEnter={(e) => iconHoverEffect(e)}
                    onMouseLeave={iconLeaveEffect}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Liên hệ + mạng xã hội */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold mb-3" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>Liên hệ</h6>

            {/* Icon liên hệ với hover glow */}
            <p
              className="text-white-50 d-flex align-items-center justify-content-center justify-content-md-start mb-2"
              style={{
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                gap: "0.5rem",
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "1rem" // tăng font size
              }}
              onMouseEnter={(e) => iconHoverEffect(e)}
              onMouseLeave={iconLeaveEffect}
            >
              <FaMapMarkerAlt /> 35c đường 109, Phước Long B
            </p>

            <p
              className="text-white-50 d-flex align-items-center justify-content-center justify-content-md-start mb-2"
              style={{
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                gap: "0.5rem",
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "1rem" // tăng font size
              }}
              onMouseEnter={(e) => iconHoverEffect(e)}
              onMouseLeave={iconLeaveEffect}
            >
              <FaPhoneAlt /> 0123 456 789
            </p>

            <p
              className="text-white-50 d-flex align-items-center justify-content-center justify-content-md-start mb-2"
              style={{
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                gap: "0.5rem",
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "1rem" // tăng font size
              }}
              onMouseEnter={(e) => iconHoverEffect(e)}
              onMouseLeave={iconLeaveEffect}
            >
              <FaEnvelope /> support@phustore.com
            </p>

            {/* Mạng xã hội */}
            <div className="d-flex justify-content-center justify-content-md-start gap-3 mt-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
                style={{ fontSize: "1.8rem", transition: "all 0.2s" }}
                onMouseEnter={(e) => iconHoverEffect(e, "#4267B2")}
                onMouseLeave={iconLeaveEffect}
              >
                <FaFacebook />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
                style={{ fontSize: "1.8rem", transition: "all 0.2s" }}
                onMouseEnter={(e) => iconHoverEffect(e, "#E1306C")}
                onMouseLeave={iconLeaveEffect}
              >
                <FaInstagram />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
                style={{ fontSize: "1.8rem", transition: "all 0.2s" }}
                onMouseEnter={(e) => iconHoverEffect(e, "#FF0000")}
                onMouseLeave={iconLeaveEffect}
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        <hr className="border-light" />
        <p className="text-center text-white-50 mb-0" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)", fontSize: "1rem" }}>
          © {new Date().getFullYear()} PhuStore. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
