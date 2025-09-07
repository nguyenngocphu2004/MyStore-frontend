import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BiUser, BiLock, BiEnvelope, BiPhone } from "react-icons/bi";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [message, setMessage] = useState(""); // state để hiển thị thông báo
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp!");
      setMessageType("error");
      return;
    }

    const sendData = { ...form };
    delete sendData.confirmPassword;
    if (!sendData.phone) delete sendData.phone;

    fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sendData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Đăng ký thành công") {
          setMessage(data.message);
          setMessageType("success");
          setTimeout(() => navigate("/login"), 2000); // tự động chuyển hướng sau 2s
        } else {
          setMessage(data.error || "Đăng ký thất bại");
          setMessageType("error");
        }
      })
      .catch(() => {
        setMessage("Lỗi server");
        setMessageType("error");
      });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh", background: "#f5f5f5" }}
    >
      <div
        className="card shadow-lg p-5 rounded"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <h2 className="text-center mb-4 fw-bold">Đăng ký</h2>

        {/* Thông báo */}
        {message && (
          <div
            className={`alert ${
              messageType === "success" ? "alert-success" : "alert-danger"
            } text-center`}
            role="alert"
          >
            {message}
          </div>
        )}

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
              value={form.username}
              className="form-control border-start-0"
              style={{ height: "45px" }}
              required
            />
          </div>

          {/* Email */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-white border-end-0">
              <BiEnvelope size={20} />
            </span>
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              value={form.email}
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
              value={form.password}
              className="form-control border-start-0"
              style={{ height: "45px" }}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-white border-end-0">
              <BiLock size={20} />
            </span>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Xác nhận mật khẩu"
              onChange={handleChange}
              value={form.confirmPassword}
              className="form-control border-start-0"
              style={{ height: "45px" }}
              required
            />
          </div>

          {/* Phone */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-white border-end-0">
              <BiPhone size={20} />
            </span>
            <input
              name="phone"
              type="tel"
              placeholder="Số điện thoại"
              onChange={handleChange}
              value={form.phone}
              className="form-control border-start-0"
              style={{ height: "45px" }}
            />
          </div>

          {/* Submit Button */}
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
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#ffdb4d")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ffcc00")}
          >
            Đăng ký
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-warning fw-bold">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
