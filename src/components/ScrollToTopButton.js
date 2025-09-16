import { useState, useEffect } from "react";

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  // Hiển thị nút khi scroll > 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // cuộn mượt
    });
  };

  return (
    <>
      {visible && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            backgroundColor: "white",
            color: "black",
            border: "none",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            cursor: "pointer",
            fontSize: "24px",
            zIndex: 1000,
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
          }}
          title="Lên đầu trang"
        >
          ↑
        </button>
      )}
    </>
  );
}

export default ScrollToTopButton;
