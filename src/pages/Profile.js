import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", phone: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [confirmData, setConfirmData] = useState({
  show: false,
  message: "",
  onConfirm: null,
  onCancel: null,
});
const openConfirm = (message, onConfirm) => {
  setConfirmData({
    show: true,
    message,
    onConfirm: () => {
      onConfirm();
      setConfirmData({ ...confirmData, show: false });
    },
    onCancel: () => setConfirmData({ ...confirmData, show: false }),
  });
};

  const showNotification = (msg) => {
  setNotification(msg);
  setTimeout(() => setNotification(null), 3000); // 3 giây ẩn
};

  const DELIVERY_TEXT = {
    PENDING: "Chờ xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPING: "Đang giao",
    DELIVERED: "Đã giao",
  };

  const STATUS_TEXT = {
    PENDING: "Chưa thanh toán",
    PAID: "Đã thanh toán",
    FAILED: "Thanh toán thất bại",
    CANCELED: "Đã hủy",
  };

  if (!token) navigate("/login");

  const fetchProfile = () => {
    fetch("http://localhost:5000/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setForm({
          username: data.username,
          email: data.email,
          phone: data.phone || "",
        });
      })
      .catch(err => console.error(err));
  };

  const fetchOrders = () => {
    fetch("http://localhost:5000/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setOrders(data.orders || []))
      .catch(err => console.error(err));
  };

  const fetchOrderDetail = (orderId) => {
    fetch(`http://localhost:5000/admin/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setSelectedOrder(data);
        setShowModal(true);
      })
      .catch(err => console.error(err));
  };

  const handleConfirmReceived = (orderId) => {
  openConfirm("Bạn chắc chắn đã nhận được hàng?", () => {
    fetch(`http://localhost:5000/orders/${orderId}/confirm_received`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Cập nhật thất bại");
        return res.json();
      })
      .then(() => fetchOrders())
      .catch(err => showNotification(err.message));
  });
};


  useEffect(() => {
    fetchProfile();
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEditClick = () => {
    setEditing(true);
    setSuccessMsg(null);
    setError(null);
  };
 const handleCancelOrder = (orderId) => {
  openConfirm("Bạn chắc chắn muốn hủy đơn hàng này?", () => {
    fetch(`http://localhost:5000/orders/${orderId}/cancel`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Hủy đơn hàng thất bại");
        return res.json();
      })
      .then(() => {
        showNotification("Đã hủy đơn hàng");
        fetchOrders();
      })
      .catch((err) => showNotification(err.message));
  });
};


  const handleCancel = () => {
    setEditing(false);
    if (profile) {
      setForm({
        username: profile.username,
        email: profile.email,
        phone: profile.phone || "",
      });
    }
    setError(null);
    setSuccessMsg(null);
  };

  const handleSave = () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    fetch("http://localhost:5000/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Cập nhật thất bại");
        }
        return res.json();
      })
      .then(() => {
        setProfile({ ...profile, ...form });
        setEditing(false);
        setSuccessMsg("Cập nhật thành công!");
      })
      .catch(err => setError(err.message))
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
   <>
   <ConfirmModal
  show={confirmData.show}
  message={confirmData.message}
  onConfirm={confirmData.onConfirm}
  onCancel={confirmData.onCancel}
/>

      {notification && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            backgroundColor: "#facc15",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            zIndex: 9999,
          }}
        >
          {notification}
        </div>
      )}
    <div className="container my-5">
      <div className="row">
        {/* Hồ sơ */}
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm rounded-4 border-0">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Thông tin hồ sơ</h5>
              {!editing && (
                <button className="btn btn-sm btn-outline-light" onClick={handleEditClick}>
                  Chỉnh sửa
                </button>
              )}
            </div>
            <div className="card-body">
              {successMsg && <div className="alert alert-success">{successMsg}</div>}
              {error && editing && <div className="alert alert-danger">{error}</div>}
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
                      disabled
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
                    <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={loading}>
                      Hủy
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Đơn hàng */}
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
    <li key={order.id} className="list-group-item position-relative" style={{ minHeight: "140px" }}>
      <div>
        <div><strong>Mã đơn:</strong> {`#${order.order_code}` || `#${order.id}`}</div>
        <div><strong>Ngày đặt:</strong> {new Date(order.created_at).toLocaleString()}</div>
        <div><strong>Tổng tiền:</strong> {order.total_price?.toLocaleString()} VND</div>
        <div><strong>Trạng thái:</strong> {STATUS_TEXT[order.status]}</div>
        <div><strong>Trạng thái giao hàng:</strong> {DELIVERY_TEXT[order.delivery_status]}</div>
      </div>

      {/* Nút nằm góc phải dưới cùng */}
      <div className="position-absolute bottom-0 end-0 p-2 d-flex gap-2">
        {(order.status === "PENDING" || order.status === "PROCESSING") && (
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleCancelOrder(order.id)}
        >
          Hủy đơn hàng
        </button>
      )}

        {order.delivery_status === "SHIPPING" && (
          <button
            className="btn btn-sm btn-success"
            onClick={() => handleConfirmReceived(order.id)}
          >
            Đã nhận được hàng
          </button>
        )}
        <button
          className="btn bg-success text-white"
          onClick={() => fetchOrderDetail(order.id)}
        >
          Xem chi tiết
        </button>
      </div>
    </li>
  ))}
</ul>

              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal chi tiết đơn hàng */}
      {showModal && selectedOrder && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered animate-modal">
            <div className="modal-content shadow-lg rounded-4 border-0">
              <div className="modal-header bg-success text-white">
               <h5 className="modal-title">
  <i className="bi bi-receipt"></i> Chi tiết đơn hàng {`#${selectedOrder.order_code}` || `#${selectedOrder.id}`}
</h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <h6 className="list-unstyled">Thông tin đơn hàng</h6>
                  <ul className="list-unstyled mb-0">
                    <li><strong>Người đặt:</strong> {selectedOrder.user?.username || selectedOrder.guest_name}</li>
                    <li><strong>SĐT:</strong> {selectedOrder.user?.phone || selectedOrder.guest_phone}</li>
                    <li><strong>Địa chỉ:</strong> {selectedOrder.address}</li>
                    <li><strong>Ngày đặt:</strong> {selectedOrder.created_at}</li>
                    <li>
                      <strong>Phương thức thanh toán:</strong>{" "}
                      {selectedOrder.payment_method === "COD" && <span>Thanh toán khi nhận hàng</span>}
                      {selectedOrder.payment_method === "ZALO" && <span>Thanh toán bằng ZALOPAY</span>}
                      {selectedOrder.payment_method === "MOMO" && <span>Thanh toán bằng MoMo</span>}
                    </li>
                    <li>
  <strong>Nhận hàng tại:</strong>{" "}
  {selectedOrder.delivery_method === "store" ? "Nhận tại cửa hàng" : "Giao hàng tận nhà"}
</li>
                    <li><strong>Tổng tiền:</strong> <span className="text-danger fw-bold">{selectedOrder.total_price?.toLocaleString()} VND</span></li>
                  </ul>
                </div>

                <div>
                  <h6 className="text-secondary">Sản phẩm</h6>
                  <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Tên sản phẩm</th>
                          <th className="text-center">Số lượng</th>
                          <th className="text-end">Đơn giá</th>
                          <th className="text-end">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{item.product_name}</td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-end">{item.unit_price.toLocaleString()} VND</td>
                            <td className="text-end">{item.total_price.toLocaleString()} VND</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
     </>
  );
}

export default Profile;
