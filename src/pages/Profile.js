import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", phone: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const navigate = useNavigate();

  // Lấy thông tin hồ sơ
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Lỗi khi lấy thông tin");
        }
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setForm({
          username: data.username,
          email: data.email,
          phone: data.phone || "",
        });
      })
      .catch((err) => {
        setError(err.message);
        if (
          err.message === "Token has expired" ||
          err.message === "User không tồn tại"
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          navigate("/login");
        }
      });
  }, [navigate]);

  // Lấy danh sách đơn hàng
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Lỗi khi lấy đơn hàng");
        }
        return res.json();
      })
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    setEditing(true);
    setSuccessMsg(null);
    setError(null);
  };

  const handleCancel = () => {
    setEditing(false);
    setForm({
      username: profile.username,
      email: profile.email,
      phone: profile.phone || "",
    });
    setError(null);
    setSuccessMsg(null);
  };

  const handleSave = () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Cập nhật thất bại");
        }
        return res.json();
      })
      .then(() => {
        setProfile((prev) => ({ ...prev, ...form }));
        setEditing(false);
        setSuccessMsg("Cập nhật thành công!");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  if (!profile) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        {/* Thông tin hồ sơ */}
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm rounded-4 border-0">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Thông tin hồ sơ</h5>
              {!editing && (
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={handleEditClick}
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
            <div className="card-body">
              {successMsg && (
                <div className="alert alert-success">{successMsg}</div>
              )}
              {error && editing && (
                <div className="alert alert-danger">{error}</div>
              )}
              {!editing ? (
                <>
                  <p><strong>Tên đăng nhập:</strong> {profile.username}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Số điện thoại:</strong> {profile.phone || "Chưa có"}</p>
                </>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!loading) handleSave();
                  }}
                >
                  <div className="mb-3">
                    <label className="form-label">Tên đăng nhập</label>
                    <input
                      name="username"
                      className="form-control"
                      value={form.username}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      name="email"
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      name="phone"
                      className="form-control"
                      value={form.phone}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Đơn hàng đã mua */}
        <div className="col-md-7">
          <div className="card shadow-sm rounded-4 border-0">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Đơn hàng đã mua</h5>
            </div>
            <div className="card-body">
              {orders.length === 0 ? (
                <p>Bạn chưa có đơn hàng nào.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {orders.map((order) => (
                    <li key={order.id} className="list-group-item">
                      <div className="fw-semibold">Mã đơn: #{order.id}</div>
                      <div>Ngày đặt: {new Date(order.created_at).toLocaleString()}</div>
                      <div>Tổng tiền: {order.total_price?.toLocaleString()} VND</div>
                      {/* Bạn có thể thêm chi tiết sản phẩm nếu muốn */}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
