import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BiUser, BiLock,BiErrorCircle } from "react-icons/bi";
import { toast,ToastContainer } from "react-toastify";
import { GoogleLogin } from '@react-oauth/google';
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");   // Thêm state cho lỗi
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // reset lỗi trước khi submit

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", form.username);
        localStorage.setItem("role", data.role);
        localStorage.setItem("provider", data.provider)
        toast.success("Đăng nhập thành công!");
        window.dispatchEvent(new Event("loginSuccess"));
        navigate("/");
      } else {
        setError(data.error || "Đăng nhập thất bại: sai tên tài khoản hoặc mật khẩu");
      }
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối tới server");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(""); // reset lỗi khi login gg
    try {
      const res = await fetch("http://localhost:5000/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: credentialResponse.credential }),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);

        toast.success("Đăng nhập Google thành công!");
        window.dispatchEvent(new Event("loginSuccess"));
        navigate("/");
      } else {
        setError(data.error || "Đăng nhập Google thất bại");
      }
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối tới server");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    setError("Đăng nhập Google thất bại");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh", background: "#f5f5f5" }}
    >
      <div className="card shadow-lg p-5 rounded" style={{ maxWidth: "500px", width: "100%" }}>
      <ToastContainer position="top-right" autoClose={3000} />
        <h2 className="text-center mb-4 fw-bold">Đăng nhập</h2>

        <form onSubmit={handleSubmit}>
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

          <div className="d-flex justify-content-end mb-3">
            <Link to="/forgot-password" className="text-danger fw-bold" style={{ fontSize: "0.9rem" }}>
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold mb-2"
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

          {/* Hiển thị lỗi dưới nút đăng nhập */}
          {error && (
            <div
              className="text-danger text-center mb-3 d-flex align-items-center justify-content-center"
              style={{ fontSize: "1rem" }}
            >
              <BiErrorCircle className="me-1" size={18} /> {error}
            </div>
          )}
        </form>

        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
        />

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
