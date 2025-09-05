import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../components/Toast";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
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
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", form.username);
        localStorage.setItem("role", data.role);  // ← lưu role

        setToast({ show: true, message: "Đăng nhập thành công!", type: "success" });
        window.dispatchEvent(new Event("loginSuccess"));

        // Redirect sau 1s
        setTimeout(() => navigate("/"), 1000);
      } else {
        setToast({ show: true, message: data.error || "Đăng nhập thất bại", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: "Không thể kết nối tới server", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Tên đăng nhập"
          onChange={handleChange}
          className="form-control my-2"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
          className="form-control my-2"
          required
        />
        <button className="btn btn-success" type="submit" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <p className="mt-3">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="text-primary">
          Đăng ký ngay
        </Link>
      </p>

      <Toast
        message={toast.message}
        show={toast.show}
        type={toast.type} // bạn có thể dùng type để đổi màu toast
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}

export default Login;
