import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const alerted = useRef(false);
  useEffect(() => {
    if (alerted.current) return; // nếu đã alert thì bỏ qua
    alerted.current = true;
    const orderId = searchParams.get("orderId");
    const resultCode = searchParams.get("resultCode");

    if (orderId && resultCode) {
      fetch(`http://localhost:5000/api/payment_callback_confirm/${orderId}?resultCode=${resultCode}`, {
        method: "POST"
      }).finally(() => {
        alert(resultCode === "0" ? "🎉 Thanh toán thành công!" : "❌ Thanh toán thất bại!");
        navigate("/");
      });
    } else {
      navigate("/");
    }
  }, [navigate, searchParams]);

  return <div className="container my-5"><h3>Đang xử lý thanh toán...</h3></div>;
}

export default PaymentSuccess;
