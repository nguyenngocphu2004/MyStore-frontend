import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    avatar: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu xác thực
    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    const sendData = { ...form };
    delete sendData.confirmPassword; // backend không cần confirmPassword
    if (!sendData.avatar) delete sendData.avatar;
    if (!sendData.phone) delete sendData.phone;

    fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sendData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Đăng ký thành công") {
          alert(data.message);
          navigate("/login");
        } else {
          alert(data.error || "Đăng ký thất bại");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Lỗi server");
      });
  };

  return (
    <div className="container my-5">
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Tên đăng nhập"
          onChange={handleChange}
          value={form.username}
          className="form-control my-2"
          required
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          className="form-control my-2"
          type="email"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
          value={form.password}
          className="form-control my-2"
          required
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Xác nhận mật khẩu"
          onChange={handleChange}
          value={form.confirmPassword}
          className="form-control my-2"
          required
        />
        <input
          name="phone"
          placeholder="Số điện thoại (tuỳ chọn)"
          onChange={handleChange}
          value={form.phone}
          className="form-control my-2"
          type="tel"
        />
        <button className="btn btn-primary">Đăng ký</button>
      </form>
    </div>
  );
}

export default Register;
