import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../components/Toast";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("username", form.username);
          setShowToast(true); // hiện toast thay vì alert
          window.dispatchEvent(new Event("loginSuccess"));
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          alert(data.error);
        }
      })
      .catch((err) => console.error(err));
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
        <button className="btn btn-success">Đăng nhập</button>
      </form>

      <p className="mt-3">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="text-primary">
          Đăng ký ngay
        </Link>
      </p>

      <Toast
        message="Đăng nhập thành công"
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default Login;
