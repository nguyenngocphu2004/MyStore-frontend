import { useEffect, useState } from "react";
import axios from "axios";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const token = localStorage.getItem("token");

  // Lấy giỏ hàng từ API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:5000/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data);
      } catch (err) {
        console.error("Lỗi lấy giỏ hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchCart();
    else setLoading(false);
  }, [token]);

  // Cập nhật số lượng
  const updateQuantity = async (itemId, delta) => {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;

    try {
      await axios.put(
        `http://localhost:5000/cart/update/${item.product_id}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart(prevCart =>
        prevCart.map(i =>
          i.id === itemId ? { ...i, quantity: newQuantity, total_price: newQuantity * i.unit_price } : i
        )
      );
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
    }
  };

  // Khi nhấn nút Xóa → mở modal
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowModal(true);
  };

  // Xác nhận xóa sản phẩm
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await axios.delete(`http://localhost:5000/cart/delete/${itemToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(prevCart => prevCart.filter(i => i.id !== itemToDelete.id));
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: -itemToDelete.quantity }));
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
    } finally {
      setShowModal(false);
      setItemToDelete(null);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.total_price, 0);

  if (loading) return <div className="container py-4">Đang tải giỏ hàng...</div>;

  return (
    <div className="container py-4">
      <h2>🛒 Giỏ hàng</h2>
      {cart.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>
                    <img
                      src={item.images?.[0] || "https://via.placeholder.com/300"}
                      alt={item.name}
                      className="card-img-top"
                      style={{ width: "100%", height: "50px", objectFit: "contain", backgroundColor: "#fff" }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{Number(item.unit_price).toLocaleString("vi-VN")}₫</td>
                  <td>
                    <div className="d-flex gap-2 align-items-center">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.id, -1)}>-</button>
                      {item.quantity}
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                  </td>
                  <td>{(item.unit_price * item.quantity).toLocaleString("vi-VN")}₫</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(item)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="text-end">
            Tổng cộng: <span className="text-danger">{totalPrice.toLocaleString("vi-VN")}₫</span>
          </h4>
          <div className="text-end">
            <button className="btn btn-success">Tiến hành đặt hàng</button>
          </div>
        </>
      )}

      {/* Modal xác nhận xóa với fade */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác nhận xóa</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc muốn xóa sản phẩm "{itemToDelete?.name}" khỏi giỏ hàng?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                <button className="btn btn-danger" onClick={confirmDelete}>Xác nhận</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
