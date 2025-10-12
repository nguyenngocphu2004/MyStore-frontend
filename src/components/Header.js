import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { toast} from "react-toastify";
import { BiSearch,BiCart } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";

function Header() {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Load user
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUser(storedUser);

    const handleLoginSuccess = () => {
      const newUser = localStorage.getItem("username");
      setUser(newUser);
    };
    window.addEventListener("loginSuccess", handleLoginSuccess);

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

  // Reset search khi rời trang /search
  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setSearch("");
    }
  }, [location.pathname]);

  // Fetch cart count
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
  }, [token]);

  useEffect(() => {
    fetchCartCount();
    const handleCartUpdated = () => fetchCartCount();
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, [fetchCartCount]);

  const handleSearch = () => {
    if (search.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToChangePassword = () => {
    setDropdownOpen(false);
    navigate("/change-password");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToProfile = () => {
    setDropdownOpen(false);
    navigate("/profile");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    setDropdownOpen(false);
    setCartCount(0);

    toast.success("Đăng xuất thành công!", { autoClose: 2000 });
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header className="bg-warning sticky-top shadow-sm" style={{ zIndex: 1020 }}>
        <div className="container d-flex align-items-center justify-content-between py-2">
          {/* Logo */}
          <Link
            to="/"
            className="text-decoration-none me-4"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <h1
              className="m-0"
              style={{
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                fontWeight: 700,
                fontSize: "1.8rem",
                color: "#000",
                letterSpacing: "1px",
              }}
            >
              PhuStore
            </h1>
          </Link>

          {/* Menu */}
          <nav className="d-none d-md-flex gap-3 fw-medium me-4">
            <Link
              to="/phones"
              className="text-dark text-decoration-none"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Điện thoại
            </Link>
            <Link
              to="/laptops"
              className="text-dark text-decoration-none"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Laptop
            </Link>
            <Link
              to="/aboutus"
              className="text-dark text-decoration-none"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Về chúng tôi
            </Link>
          </nav>

          {/* Search + Icons */}
          <div className="d-flex align-items-center gap-3 position-relative" ref={dropdownRef}>
            {/* Search */}
            <div className="position-relative" style={{ width: "300px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm sản phẩm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{
                  height: "42px",
                  borderRadius: "50px",
                  paddingLeft: "40px",
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                }}
              />
              <BiSearch
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "15px",
                  transform: "translateY(-50%)",
                  color: "#888",
                  fontSize: "20px",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* User */}
            {user ? (
              <div className="position-relative">
                <button
  className="btn btn-outline-dark"
  onClick={() => setDropdownOpen(!dropdownOpen)}
  title={user}
>
  {user.length > 6 ? user.slice(0, 6) + "..." : user} ▼
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
                    <button className="dropdown-item" onClick={goToProfile}>
                      Thông tin hồ sơ
                    </button>
                    <button className="dropdown-item" onClick={goToChangePassword}>
                      Đổi mật khẩu
                    </button>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-outline-dark"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Đăng nhập
              </Link>
            )}

            {/* Cart */}
            <button
              className="btn position-relative btn-outline-dark cart-icon"
              onClick={() => {
                navigate("/cart");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              title="Giỏ hàng"
            >
              <BiCart size={25}/>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Tra cứu đơn hàng */}
            <button
              className="btn btn-outline-dark"
              onClick={() => {
                navigate("/guest-orders");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              title="Tra cứu đơn hàng"
            >
              Tra cứu đơn hàng
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
