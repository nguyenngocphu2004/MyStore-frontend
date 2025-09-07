// Login.js
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BiUser, BiLock } from "react-icons/bi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        // Lưu thông tin token & user
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", form.username);
        localStorage.setItem("role", data.role);

        // Hiển thị toast ngay lập tức
        toast.success("Đăng nhập thành công!");

        // Gửi event để Header cập nhật user
        window.dispatchEvent(new Event("loginSuccess"));

        // Chuyển trang về home
        navigate("/");
      } else {
        toast.error(data.error || "Đăng nhập thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể kết nối tới server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh", background: "#f5f5f5" }}
    >
      <div className="card shadow-lg p-5 rounded" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4 fw-bold">Đăng nhập</h2>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-white border-end-0">
              <BiUser size={20} />
            </span>
            <input
              name="username"
              placeholder="Tên đăng nhập"
              onChange={handleChange}
              className="form-control border-start-0"
              style={{ height: "45px" }}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-white border-end-0">
              <BiLock size={20} />
            </span>
            <input
              name="password"
              type="password"
              placeholder="Mật khẩu"
              onChange={handleChange}
              className="form-control border-start-0"
              style={{ height: "45px" }}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="btn w-100 fw-bold"
            style={{
              backgroundColor: "#ffcc00",
              color: "#000",
              height: "45px",
              fontSize: "1rem",
              transition: "all 0.3s",
            }}
            disabled={loading}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#ffdb4d")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ffcc00")}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-warning fw-bold">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
