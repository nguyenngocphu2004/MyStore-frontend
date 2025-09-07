import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("pending"); // "pending" | "success" | "failed"
  const [message, setMessage] = useState("Đang xử lý thanh toán...");
  const [progress, setProgress] = useState(0); // % progress bar

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const resultCode = searchParams.get("resultCode");

    // Animation progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 10 : prev)); // dừng ở 90% trước khi kết quả
    }, 300);

    if (orderId && resultCode) {
      fetch(`http://localhost:5000/api/payment_callback_confirm/${orderId}?resultCode=${resultCode}`, {
        method: "POST",
      })
        .then(res => res.json())
        .then(data => {
          clearInterval(progressInterval);
          setProgress(100);

          if (data.status === "PAID") {
            setStatus("success");
            setMessage("Thanh toán thành công!");
          } else {
            setStatus("failed");
            setMessage("Thanh toán thất bại!");
          }

          setTimeout(() => navigate("/"), 2000);
        })
        .catch(() => {
          clearInterval(progressInterval);
          setProgress(100);
          setStatus("failed");
          setMessage("Có lỗi xảy ra khi xử lý thanh toán.");
          setTimeout(() => navigate("/"), 2000);
        });
    } else {
      navigate("/");
    }

    return () => clearInterval(progressInterval);
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
          <h3 className="mt-3">{message}</h3>
        </div>
      )}

      {status === "failed" && (
        <div style={{ textAlign: "center", animation: "shake 0.5s" }}>
          <h3 className="mt-3">{message}</h3>
        </div>
      )}


    </div>
  );
}

export default PaymentSuccess;
