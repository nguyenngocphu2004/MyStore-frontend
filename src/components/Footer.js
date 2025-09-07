import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
function Footer() {
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
              style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}
            >

              <span>PhuStore</span>
            </h5>
            <p className="small text-white-50" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
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
                { name: "Phụ kiện", href: "/accessories" },
                { name: "Giỏ hàng", href: "/cart" },
              ].map((link) => (
                <li key={link.href} className="mb-1">
                  <a
                    href={link.href}
                    className="text-white text-decoration-none"
                    style={{ transition: "color 0.2s", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ffc107")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
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
            <p className="small mb-2 text-white-50" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>📍 123 Nguyễn Trãi, Hà Nội</p>
            <p className="small mb-2 text-white-50" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>📞 0123 456 789</p>
            <p className="small mb-2 text-white-50" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>✉️ support@phustore.com</p>

            <div className="d-flex justify-content-center justify-content-md-start gap-3 mt-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white" style={{ fontSize: "1.5rem" }}>
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white" style={{ fontSize: "1.5rem" }}>
                <FaInstagram />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white" style={{ fontSize: "1.5rem" }}>
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        <hr className="border-light" />
        <p className="text-center small mb-0 text-white-50" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>
          © {new Date().getFullYear()} PhuStore. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
