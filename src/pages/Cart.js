import { useEffect, useState } from "react";
import axios from "axios";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Lấy giỏ hàng từ API khi component mount
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

    if (token) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Cập nhật số lượng lên backend
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

  // Xóa sản phẩm khỏi giỏ hàng qua API
  const removeItem = async (itemId) => {
  try {
    await axios.delete(`http://localhost:5000/cart/delete/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCart(prevCart => prevCart.filter(i => i.id !== itemId));
  } catch (err) {
    console.error("Lỗi xóa sản phẩm:", err);
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
         src={
            item.images && item.images.length > 0
             ? `${item.images[0]}?v=${new Date().getTime()}`
              : "https://via.placeholder.com/300"
             }
          alt={item.name || "Sản phẩm"}
          className="card-img-top"
          style={{
            width: "100%",
            height: "50px",
            objectFit: "contain",
            backgroundColor: "#fff",
          }}
      />
                  </td>
                  <td>{item.name}</td>
                  <td>{Number(item.unit_price).toLocaleString("vi-VN")}₫</td>
                  <td>
                    <div className="d-flex gap-2 align-items-center">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        -
                      </button>
                      {item.quantity}
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{(item.unit_price * item.quantity).toLocaleString("vi-VN")}₫</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeItem(item.id)}
                    >
                      Xóa
                    </button>
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
    </div>
  );
}

export default Cart;
