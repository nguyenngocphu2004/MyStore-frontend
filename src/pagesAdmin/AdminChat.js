import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

let socket;

function AdminChat() {
  const [connected, setConnected] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [allMessages, setAllMessages] = useState({});
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Giữ currentRoom để dùng trong socket listener
  const currentRoomRef = useRef(currentRoom);
  useEffect(() => {
    currentRoomRef.current = currentRoom;
  }, [currentRoom]);
  useEffect(() => {
  // Gọi API để lấy danh sách khách đang kết nối
  fetch("http://localhost:5000/connected-clients")
    .then((res) => res.json())
    .then((data) => {
      setRooms(data);
    })
    .catch((err) => {
      console.error("Lỗi khi lấy danh sách khách đang kết nối:", err);
    });
}, []);
  useEffect(() => {
    socket = io("http://localhost:5000");

    socket.on("connect", () => {
      setConnected(true);
      console.log("Admin connected");
    });

    socket.on("admin-notify", ({ roomId, msg }) => {
      console.log(`New client in room: ${roomId}`);
      setRooms((prev) => (prev.includes(roomId) ? prev : [...prev, roomId]));
    });

    socket.on("admin-notify-disconnect", ({ roomId }) => {
      setRooms((prev) => prev.filter((r) => r !== roomId));
      setAllMessages((prev) => {
        const newMessages = { ...prev };
        delete newMessages[roomId];
        return newMessages;
      });
      if (currentRoomRef.current === roomId) {
        setCurrentRoom(null);
      }
    });

    socket.on("admin-message", ({ room, text }) => {
      setAllMessages((prev) => {
        const updatedRoomMessages = [...(prev[room] || []), { sender: "client", text }];
        localStorage.setItem("adminMessages_" + room, JSON.stringify(updatedRoomMessages));
        return {
          ...prev,
          [room]: updatedRoomMessages,
        };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Load tin nhắn cũ từ localStorage khi chuyển phòng
  useEffect(() => {
    if (currentRoom) {
      const savedMessages = localStorage.getItem("adminMessages_" + currentRoom);
      setAllMessages((prev) => ({
        ...prev,
        [currentRoom]: savedMessages ? JSON.parse(savedMessages) : [],
      }));
    }
  }, [currentRoom]);

  const joinRoom = (roomId) => {
    setCurrentRoom(roomId);
    socket.emit("admin-join-room", { room: roomId });
  };

  const sendMessage = () => {
    if (!input.trim() || !currentRoom) return;

    const msg = { sender: "admin", text: input };
    setAllMessages((prev) => {
      const updatedRoomMessages = [...(prev[currentRoom] || []), msg];
      localStorage.setItem("adminMessages_" + currentRoom, JSON.stringify(updatedRoomMessages));
      return {
        ...prev,
        [currentRoom]: updatedRoomMessages,
      };
    });

    socket.emit("admin-message", { room: currentRoom, msg: input });
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, currentRoom]);

  // ----- Styles -----
  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f9f9f9",
      color: "#333",
    },
    sidebar: {
      width: "250px",
      borderRight: "1px solid #ddd",
      backgroundColor: "#fff",
      display: "flex",
      flexDirection: "column",
      padding: "20px 15px",
      boxSizing: "border-box",
    },
    sidebarTitle: {
      fontWeight: "700",
      fontSize: "1.2rem",
      marginBottom: "15px",
      color: "#444",
    },
    roomItem: {
      padding: "12px 15px",
      marginBottom: "8px",
      borderRadius: "8px",
      cursor: "pointer",
      userSelect: "none",
      transition: "background-color 0.2s",
      fontWeight: "600",
      fontSize: "0.95rem",
      color: "#555",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    },
    roomItemActive: {
      backgroundColor: "#4caf50",
      color: "#fff",
      boxShadow: "0 2px 8px rgba(76,175,80,0.4)",
    },
    mainChat: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#e5e5e5",
    },
    chatHeader: {
      padding: "15px 20px",
      borderBottom: "1px solid #ccc",
      fontWeight: "700",
      fontSize: "1.3rem",
      color: "#4caf50",
      backgroundColor: "#f0f9f1",
      boxShadow: "inset 0 -1px 0 #a5d6a7",
    },
    messagesContainer: {
      flex: 1,
      padding: "15px 20px",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    messageItem: {
      maxWidth: "70%",
      padding: "10px 15px",
      borderRadius: "20px",
      wordBreak: "break-word",
      fontSize: "1rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      lineHeight: 1.4,
    },
    adminMessage: {
      alignSelf: "flex-end",
      backgroundColor: "#4caf50",
      color: "#fff",
      borderBottomRightRadius: "4px",
    },
    clientMessage: {
      alignSelf: "flex-start",
      backgroundColor: "#fff",
      color: "#333",
      borderBottomLeftRadius: "4px",
      border: "1px solid #ddd",
    },
    inputArea: {
      display: "flex",
      padding: "12px 20px",
      borderTop: "1px solid #ccc",
      backgroundColor: "#fff",
    },
    inputBox: {
      flex: 1,
      padding: "10px 15px",
      borderRadius: "25px",
      border: "1px solid #ccc",
      outline: "none",
      fontSize: "1rem",
    },
    sendButton: {
      marginLeft: "12px",
      backgroundColor: "#4caf50",
      color: "#fff",
      border: "none",
      borderRadius: "25px",
      padding: "0 20px",
      fontSize: "1.1rem",
      cursor: "pointer",
      userSelect: "none",
    },
    noRoomSelected: {
      textAlign: "center",
      marginTop: "40px",
      fontSize: "1.1rem",
      color: "#999",
    },
  };

  return (
    <div style={styles.container}>
      {/* Sidebar: Danh sách khách */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>
          Danh sách khách {connected ? "🟢" : "🔴"}
        </div>
        {rooms.length === 0 && <div>Chưa có khách nào kết nối</div>}
        {rooms.map((room) => (
          <div
            key={room}
            style={{
              ...styles.roomItem,
              ...(room === currentRoom ? styles.roomItemActive : {}),
            }}
            onClick={() => joinRoom(room)}
            tabIndex={0}
            role="button"
            aria-pressed={room === currentRoom}
          >
            Khách {room}
          </div>
        ))}
      </div>

      {/* Main Chat Area */}
      <div style={styles.mainChat}>
        <div style={styles.chatHeader}>
          {currentRoom ? `Chat với Khách ${currentRoom}` : "Chọn khách để chat"}
        </div>

        <div style={styles.messagesContainer}>
          {currentRoom ? (
            <>
              {(allMessages[currentRoom] || []).map((msg, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.messageItem,
                    ...(msg.sender === "admin"
                      ? styles.adminMessage
                      : styles.clientMessage),
                  }}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div style={styles.noRoomSelected}>Vui lòng chọn khách để bắt đầu chat</div>
          )}
        </div>

        {currentRoom && (
          <div style={styles.inputArea}>
            <input
              type="text"
              style={styles.inputBox}
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              autoFocus
            />
            <button
              style={styles.sendButton}
              onClick={sendMessage}
              aria-label="Gửi tin nhắn"
            >
              Gửi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminChat;
