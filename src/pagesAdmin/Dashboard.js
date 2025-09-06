import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("adminRole");
    const storedUser = localStorage.getItem("adminUsername");
    setRole(storedRole);
    setUsername(storedUser);
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Trang quản trị</h2>
      <div className="card shadow-sm p-3">
        <h4>Xin chào, <span className="text-primary">{username}</span></h4>
        <p>
          Vai trò của bạn:{" "}
          <span className="badge bg-info text-dark">{role}</span>
        </p>
      </div>
    </div>
  );
}
