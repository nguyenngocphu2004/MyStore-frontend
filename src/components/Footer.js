function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          {/* Logo + giới thiệu */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">PhuStore</h5>
            <p className="small">
              Nơi mua sắm điện thoại, laptop, phụ kiện chính hãng với giá tốt
              nhất. Luôn cam kết chất lượng và dịch vụ.
            </p>
          </div>

          {/* Liên kết nhanh */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">Liên kết nhanh</h6>
            <ul className="list-unstyled">
              <li><a href="/phones" className="text-light text-decoration-none">Điện thoại</a></li>
              <li><a href="/laptops" className="text-light text-decoration-none">Laptop</a></li>
              <li><a href="/accessories" className="text-light text-decoration-none">Phụ kiện</a></li>
              <li><a href="/cart" className="text-light text-decoration-none">Giỏ hàng</a></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">Liên hệ</h6>
            <p className="small mb-1">📍 123 Nguyễn Trãi, Hà Nội</p>
            <p className="small mb-1">📞 0123 456 789</p>
            <p className="small mb-1">✉️ support@phustore.com</p>
          </div>
        </div>

        <hr className="border-light" />
        <p className="text-center small mb-0">
          © {new Date().getFullYear()} PhuStore. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
