import { useEffect } from "react";

function Toast({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // 3 giây tự tắt
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      top: 20,
      right: 20,
      padding: "15px 25px",
      backgroundColor: "#28a745",
      color: "white",
      borderRadius: 8,
      boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      zIndex: 9999,
      fontWeight: "bold",
    }}>
      {message}
    </div>
  );
}

export default Toast;
