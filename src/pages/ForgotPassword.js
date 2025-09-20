import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");

  // Bước 1: Gửi OTP
  const handleSendOtp = async () => {
    if (!phone) return toast.error("Vui lòng nhập số điện thoại");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, type: "password_reset" }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Mã OTP đã được gửi đến email " + data.masked_email);
        setMaskedEmail(data.masked_email);
        setStep(2);
      } else {
        toast.error(data.error || "Gửi OTP thất bại");
      }
    } catch (err) {
      toast.error("Lỗi kết nối tới server");
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Xác thực OTP
  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Vui lòng nhập mã OTP");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Xác thực OTP thành công");
        setStep(3);
      } else {
        toast.error(data.error || "OTP không hợp lệ");
      }
    } catch (err) {
      toast.error("Lỗi kết nối tới server");
    } finally {
      setLoading(false);
    }
  };

  // Bước 3: Đổi mật khẩu
  const handleResetPassword = async () => {
    if (!password) return toast.error("Vui lòng nhập mật khẩu mới");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Đổi mật khẩu thành công! Bạn có thể đăng nhập lại.");
        navigate("/login");
      } else {
        toast.error(data.error || "Đổi mật khẩu thất bại");
      }
    } catch (err) {
      toast.error("Lỗi kết nối tới server");
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
        style={{ maxWidth: "400px", width: "100%" }}
      >
        {step === 1 && (
          <>
            <h2 className="text-center mb-4 fw-bold">Quên mật khẩu</h2>
            <div className="input-group mb-3">
              <input
                type="text"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className="form-control"
                style={{ height: "45px" }}
              />
            </div>
            <button
              onClick={handleSendOtp}
              disabled={loading}
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
              {loading ? "Đang gửi OTP..." : "Gửi mã OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-center mb-4 fw-bold">Xác thực OTP</h2>
            <p className="text-center mb-3">
              Đã gửi mã OTP đến email: <b>{maskedEmail}</b>
            </p>
            <div className="input-group mb-3">
              <input
                type="text"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                className="form-control"
                style={{ height: "45px" }}
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="btn w-100 fw-bold mb-2"
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
              {loading ? "Đang xác thực..." : "Xác thực OTP"}
            </button>
            <button
              onClick={() => setStep(1)}
              disabled={loading}
              className="btn w-100 fw-bold"
              style={{
                backgroundColor: "lightgray",
                color: "#000",
                height: "45px",
                fontSize: "1rem",
                transition: "all 0.3s",
              }}
            >
              Quay lại
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-center mb-4 fw-bold">Đổi mật khẩu mới</h2>
            <div className="input-group mb-3">
              <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="form-control"
                style={{ height: "45px" }}
              />
            </div>
            <button
              onClick={handleResetPassword}
              disabled={loading}
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
              {loading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
