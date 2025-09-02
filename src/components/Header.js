import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

function Header() {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
    }

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
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={goToProfile}
                  >
                    Thông tin hồ sơ
                  </button>
                  <button
                    className="dropdown-item text-danger"
                    type="button"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link to="/Login" className="btn btn-outline-dark">
              Đăng nhập
            </Link>
          )}
          <button className="btn btn-dark">Giỏ hàng</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
