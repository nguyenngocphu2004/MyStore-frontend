import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("pending"); // "pending" | "success" | "failed"
  const [message, setMessage] = useState("Đang xử lý thanh toán...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const orderId = searchParams.get("orderId"); // Momo
    const resultCode = searchParams.get("resultCode"); // Momo
    const appTransId = searchParams.get("app_trans_id"); // ZaloPay

    // Animation progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 10 : prev));
    }, 300);

    // ===== Momo xử lý =====
    if (orderId && resultCode) {
      fetch(`http://localhost:5000/api/payment_callback/${orderId}?resultCode=${resultCode}`, {
        method: "POST"
      })
        .then(res => res.json())
        .then(data => {
          clearInterval(progressInterval);
          setProgress(100);
          console.log("Momo callback result:", data);

          if (data.status && data.status.toLowerCase() === "paid") {
            setStatus("success");
            setMessage("Thanh toán thành công!");
          } else {
            setStatus("failed");
            setMessage("Thanh toán thất bại (Momo). Vui lòng thử lại.");
          }

          setTimeout(() => navigate("/"), 3000);
        })
        .catch(() => {
          clearInterval(progressInterval);
          setProgress(100);
          setStatus("failed");
          setMessage("Có lỗi xảy ra khi xử lý thanh toán Momo.");
          setTimeout(() => navigate("/"), 3000);
        });

      return () => clearInterval(progressInterval);
    }

    // ===== ZaloPay xử lý =====
    if (appTransId) {
      fetch(`http://localhost:5000/api/zalopay_payment_status/${appTransId}`)
        .then(res => res.json())
        .then(data => {
          clearInterval(progressInterval);
          setProgress(100);
          console.log("ZaloPay status result:", data);

          if (data.status && data.status.toLowerCase() === "paid") {
            setStatus("success");
            setMessage("Thanh toán thành công (ZaloPay)!");
          } else if (data.status && data.status.toLowerCase() === "failed") {
            setStatus("failed");
            setMessage("Thanh toán thất bại (ZaloPay).");
          } else {
            setStatus("pending");
            setMessage("Đang xử lý thanh toán ZaloPay...");
          }

          setTimeout(() => navigate("/"), 3000);
        })
        .catch(() => {
          clearInterval(progressInterval);
          setProgress(100);
          setStatus("failed");
          setMessage("Có lỗi xảy ra khi xử lý thanh toán ZaloPay.");
          setTimeout(() => navigate("/"), 3000);
        });

      return () => clearInterval(progressInterval);
    }

    // Không có tham số phù hợp
    navigate("/");
  }, [navigate, searchParams]);

  return (
    <div className="container my-5 d-flex flex-column align-items-center justify-content-center">
      {status === "pending" && (
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <h4 className="mb-3 text-center">{message}</h4>
          <div className="progress" style={{ height: "25px", borderRadius: "12px" }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      )}

      {status === "success" && (
        <div style={{ textAlign: "center", animation: "fadeScale 0.5s ease-out" }}>
          <h3 className="mt-3 text-success">{message}</h3>
        </div>
      )}

      {status === "failed" && (
        <div style={{ textAlign: "center", animation: "shake 0.5s" }}>
          <h3 className="mt-3 text-danger">{message}</h3>
        </div>
      )}
    </div>
  );
}

export default PaymentSuccess;
