import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // validate từng field
  const validateField = (name, value) => {
    let error = "";
    if (name === "newPassword") {
      if (value.length < 8) {
        error = "Mật khẩu mới phải từ 8 kí tự";
      }
    }
    if (name === "confirmPassword") {
      if (value !== form.newPassword) {
        error = "Mật khẩu xác nhận không khớp";
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // kiểm tra tất cả field
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/change-password",
        {
          old_password: form.oldPassword,
          new_password: form.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        toast.success("Đổi mật khẩu thành công!");
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Đổi mật khẩu thất bại");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="mb-4 text-center fw-bold">Đổi mật khẩu</h3>
        <form onSubmit={handleSubmit}>
          {/* Old password */}
          <div className="mb-3">
            <label className="form-label">Mật khẩu cũ</label>
            <input
              type="password"
              name="oldPassword"
              className="form-control"
              value={form.oldPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* New password */}
          <div className="mb-3">
            <label className="form-label">Mật khẩu mới</label>
            <input
              type="password"
              name="newPassword"
              className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
              value={form.newPassword}
              onChange={handleChange}
              required
            />
            {errors.newPassword && <div className="text-danger">{errors.newPassword}</div>}
          </div>

          {/* Confirm password */}
          <div className="mb-3">
            <label className="form-label">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
          </div>

          <button type="submit" className="btn btn-warning w-100 fw-bold">
            Đổi mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
