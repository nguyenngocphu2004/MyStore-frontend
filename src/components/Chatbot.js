import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

let socket = null;

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isChatWithAdmin, setIsChatWithAdmin] = useState(false);
  const chatRef = useRef(null);

  const quickReplies = ["Gặp quản trị viên", "Hỗ trợ kỹ thuật"];

  // Kết nối socket khi cần
  const connectToSocket = () => {
    if (!socket) {
      socket = io("http://localhost:5000");

      socket.on("connect", () => {
        console.log("Connected to socket server");

        if (isChatWithAdmin) {
          socket.emit("client-join-admin-chat");
        }
      });

      socket.on("client-message", ({ text }) => {
        setMessages((prev) => [...prev, { sender: "bot", text }]);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from socket");
        socket = null;
      });
    }
  };

  const sendMessage = async (msgText) => {
    if (!msgText.trim()) return;

    const userMessage = { sender: "user", text: msgText };
    setMessages((prev) => [...prev, userMessage]);

    if (msgText === "Gặp quản trị viên" || msgText === "Hỗ trợ kỹ thuật") {
      setIsChatWithAdmin(true);
      setMessages((prev) => [...prev, { sender: "bot", text: "PhuStore xin chào! Đợi ít phút có nhân viên hỗ trợ bạn nha" }]);
      if (!socket) {
        connectToSocket();
        socket.once("connect", () => {
          socket.emit("client-join-admin-chat");
          socket.emit("client-message", "Khách hàng muốn gặp quản trị viên");
        });
      } else if (socket.connected) {
        socket.emit("client-join-admin-chat");
        socket.emit("client-message", "Khách hàng muốn gặp quản trị viên");
      } else {
        socket.once("connect", () => {
          socket.emit("client-join-admin-chat");
          socket.emit("client-message", "Khách hàng muốn gặp quản trị viên");
        });
      }
      return;
    }

    if (isChatWithAdmin) {
      if (socket && socket.connected) {
        socket.emit("client-message", msgText);
      } else {
        connectToSocket();
        socket.once("connect", () => {
          socket.emit("client-join-admin-chat");
          socket.emit("client-message", msgText);
        });
      }
      return;
    }

    // Xử lý bot trả lời khi không chat admin (gọi API backend)
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msgText }),
      });
      const data = await res.json();
      const botMessage = {
        sender: "bot",
        text: data.response || "Bot không phản hồi.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Lỗi kết nối server!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    sendMessage(input);
    setInput("");
  };

  useEffect(() => {
  if (isOpen && chatRef.current) {
    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }
}, [messages, loading, isOpen]);


  return (
    <>
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
            backgroundColor: "#facc15",
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
    </>
  );
}

export default Chatbot;
