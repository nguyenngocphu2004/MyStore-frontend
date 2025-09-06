import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

function Header() {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Lấy username và role khi load
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUser(storedUser);

    const handleLoginSuccess = () => {
      const newUser = localStorage.getItem("username");
      setUser(newUser);
    };
    window.addEventListener("loginSuccess", handleLoginSuccess);

    // Click ngoài dropdown để đóng
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("loginSuccess", handleLoginSuccess);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Lấy số lượng giỏ hàng từ backend
  const fetchCartCount = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartCount(res.data.length);
    } catch (err) {
      console.error(err);
    }
  },[token]);

  // Lắng nghe sự kiện khi thêm sản phẩm
  useEffect(() => {
    fetchCartCount();
    const handleCartUpdated = () => fetchCartCount();
    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, [fetchCartCount]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    setDropdownOpen(false);
    setCartCount(0);
    navigate("/");
  };

  const goToProfile = () => {
    setDropdownOpen(false);
    navigate("/profile");
  };

  return (
    <header className="bg-warning sticky-top shadow-sm" style={{ zIndex: 1020 }}>
      <div className="container d-flex align-items-center justify-content-between py-2">
        <div className="d-flex align-items-center gap-4">
          <Link to="/">
            <img
              src="https://www.thegioididong.com/Content/desktop/images/logo.png"
              alt="logo"
              style={{ height: "40px" }}
            />
          </Link>

          <nav className="d-none d-md-flex gap-3 fw-medium">
            <Link to="/phones" className="text-dark text-decoration-none">Điện thoại</Link>
            <Link to="/laptops" className="text-dark text-decoration-none">Laptop</Link>
            <Link to="/smartwatch" className="text-dark text-decoration-none">Smartwatch</Link>
            <Link to="/Tablet" className="text-dark text-decoration-none">Tablet</Link>
          </nav>
        </div>

        <div className="d-flex align-items-center gap-3 position-relative" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="form-control"
            style={{ width: "200px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {user ? (
            <>
              <button
                className="btn btn-outline-dark position-relative"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Chào, {user} <span style={{ marginLeft: 5 }}>▼</span>
              </button>

              {dropdownOpen && (
                <div
                  className="dropdown-menu show"
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    minWidth: "160px",
                    backgroundColor: "white",
                    border: "1px solid rgba(0,0,0,.15)",
                    boxShadow: "0 0.5rem 1rem rgba(0,0,0,.175)",
                    zIndex: 1050,
                  }}
                >
                  <button className="dropdown-item" type="button" onClick={goToProfile}>
                    Thông tin hồ sơ
                  </button>
                  <button className="dropdown-item text-danger" type="button" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link to="/Login" className="btn btn-outline-dark">Đăng nhập</Link>
          )}

          {/* Nút giỏ hàng */}
          <button
            className="btn btn-dark d-flex align-items-center gap-2 position-relative cart-icon"
            onClick={() => navigate("/cart")}
            title="Giỏ hàng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .485.379L2.89 5H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 14H4a.5.5 0 0 1-.491-.408L1.01 2H.5a.5.5 0 0 1-.5-.5zM3.14 6l1.25 6.25a.5.5 0 0 0 .491.375h7.518a.5.5 0 0 0 .491-.408L13.89 6H3.14z"/>
            </svg>
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            )}
          </button>

          {/* Nút tra cứu đơn hàng */}
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={() => navigate("/guest-orders")}
            title="Tra cứu đơn hàng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0
              1.415-1.415l-3.85-3.85zm-5.242.656a5.5 5.5 0 1 1
              0-11 5.5 5.5 0 0 1 0 11z" />
            </svg>
            Tra cứu
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
