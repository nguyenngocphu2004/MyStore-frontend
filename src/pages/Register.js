import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BiUser,
  BiLock,
  BiEnvelope,
  BiPhone,
  BiErrorCircle,
} from "react-icons/bi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // validate từng field
  const validateField = (name, value) => {
    let error = "";

    if (name === "username") {
      if (value.length < 6) {
        error = "Tên tài khoản phải có từ 6 kí tự";
      }
    }

    if (name === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Định dạng email không hợp lệ";
      }
    }

    if (name === "password") {
      if (value.length < 8) {
        error = "Mật khẩu từ 8 kí tự trở lên";
      }
    }

    if (name === "confirmPassword") {
      if (value !== form.password) {
        error = "Mật khẩu xác nhận không khớp";
      }
    }

    if (name === "phone") {
      if (!/^\d{10}$/.test(value)) {
        error = "Số điện thoại phải đủ 10 chữ số";
      }
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // chỉ cho phone nhập số
    const newValue = name === "phone" ? value.replace(/\D/g, "") : value;

    setForm({ ...form, [name]: newValue });

    const error = validateField(name, newValue);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const sendData = { ...form };
    delete sendData.confirmPassword;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendData),
      });

      const data = await res.json();

      if (res.ok && data.message === "Đăng ký thành công") {
        toast.success(data.message);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.error || "Đăng ký thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh", background: "#f5f5f5" }}
    >
      <div
        className="card shadow-lg p-5 rounded"
        style={{ maxWidth: "500px", width: "100%" }}
      ><ToastContainer position="top-right" autoClose={3000} />

        <h2 className="text-center mb-4 fw-bold">Đăng ký</h2>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <BiUser size={20} />
              </span>
              <input
                name="username"
                placeholder="Tên đăng nhập"
                onChange={handleChange}
                value={form.username}
                className={`form-control border-start-0 ${
                  errors.username ? "is-invalid" : ""
                }`}
                style={{ height: "45px" }}
                required
              />
            </div>
            {errors.username && (
              <div className="text-danger mb-2 d-flex align-items-center">
                <BiErrorCircle size={18} className="me-2" />
                {errors.username}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <BiEnvelope size={20} />
              </span>
              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                value={form.email}
                className={`form-control border-start-0 ${
                  errors.email ? "is-invalid" : ""
                }`}
                style={{ height: "45px" }}
                required
              />
            </div>
            {errors.email && (
              <div className="text-danger mb-2 d-flex align-items-center">
                <BiErrorCircle size={18} className="me-2" />
                {errors.email}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <BiLock size={20} />
              </span>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                onChange={handleChange}
                value={form.password}
                className={`form-control border-start-0 ${
                  errors.password ? "is-invalid" : ""
                }`}
                style={{ height: "45px" }}
                required
              />
              <span
                className="input-group-text bg-white"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            {errors.password && (
              <div className="text-danger mb-2 d-flex align-items-center">
                <BiErrorCircle size={18} className="me-2" />
                {errors.password}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <BiLock size={20} />
              </span>
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                onChange={handleChange}
                value={form.confirmPassword}
                className={`form-control border-start-0 ${
                  errors.confirmPassword ? "is-invalid" : ""
                }`}
                style={{ height: "45px" }}
                required
              />
              <span
                className="input-group-text bg-white"
                style={{ cursor: "pointer" }}
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            {errors.confirmPassword && (
              <div className="text-danger mb-2 d-flex align-items-center">
                <BiErrorCircle size={18} className="me-2" />
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <BiPhone size={20} />
              </span>
              <input
                name="phone"
                type="tel"
                placeholder="Số điện thoại"
                onChange={handleChange}
                value={form.phone}
                className={`form-control border-start-0 ${
                  errors.phone ? "is-invalid" : ""
                }`}
                style={{ height: "45px" }}
                maxLength={10}
                required
              />
            </div>
            {errors.phone && (
              <div className="text-danger mb-2 d-flex align-items-center">
                <BiErrorCircle size={18} className="me-2" />
                {errors.phone}
              </div>
            )}
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
            disabled={loading}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#ffdb4d")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ffcc00")}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
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
