import { useEffect, useRef, useState } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Quản lý mở/đóng
  const chatRef = useRef(null);

  const quickReplies = [
    "Gặp quản trị viên",
    "Hỗ trợ kỹ thuật",
  ];

  const sendMessage = async (msgText) => {
    if (!msgText.trim()) return;

    const userMessage = { sender: "user", text: msgText };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    if (msgText === "Gặp quản trị viên") {
      setLoading(false);
      const adminReply = {
        sender: "bot",
        text: "Xin chào, tôi là quản trị viên, tôi có thể giúp gì cho bạn?",
      };
      setMessages((prev) => [...prev, adminReply]);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msgText }),
      });

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.response || "Bot không phản hồi." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: "bot", text: "Lỗi kết nối server!" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    sendMessage(input);
    setInput("");
  };

  // Scroll xuống cuối khi có tin nhắn mới hoặc đang loading
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <>
      {/* Nút mở chatbot */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            fontSize: "24px",
            zIndex: 1000,
            cursor: "pointer",
          }}
          title="Mở chatbot"
        >
          💬
        </button>
      )}

      {/* Giao diện chatbot */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            PhuStore
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          <div className="chatbot-messages" ref={chatRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender}`}>
                <div className="message-bubble">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="message-bubble typing">Đang trả lời...</div>
              </div>
            )}
          </div>

          {/* Nút chọn tin nhắn mẫu */}
          <div className="quick-replies">
            {quickReplies.map((text, i) => (
              <button
                key={i}
                className="quick-reply-btn"
                onClick={() => sendMessage(text)}
                disabled={loading}
              >
                {text}
              </button>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              value={input}
              placeholder="Gõ tin nhắn..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading}>
              ➤
            </button>
          </div>
        </div>
      )}

      {/* CSS nội tuyến hoặc bạn chuyển vào file .css */}

    </>
  );
}

export default Chatbot;
