import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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

  const updateQuantity = async (itemId, delta) => {
    const item = cart.find((i) => i.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;

    try {
      await axios.put(
        `http://localhost:5000/cart/update/${item.product_id}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart((prevCart) =>
        prevCart.map((i) =>
          i.id === itemId
            ? {
                ...i,
                quantity: newQuantity,
                total_price: newQuantity * i.unit_price,
              }
            : i
        )
      );
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/cart/delete/${itemToDelete.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCart((prevCart) =>
        prevCart.filter((i) => i.id !== itemToDelete.id)
      );
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== itemToDelete.id)
      );
      window.dispatchEvent(
        new CustomEvent("cartUpdated", { detail: -itemToDelete.quantity })
      );
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
    } finally {
      setShowModal(false);
      setItemToDelete(null);
    }
  };

  const toggleSelectItem = (itemId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const isAllSelected = cart.length > 0 && selectedItems.length === cart.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((item) => item.id));
    }
  };

  const handleCheckout = () => {
    const selectedProducts = cart.filter((item) =>
      selectedItems.includes(item.id)
    );

    if (selectedProducts.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để đặt hàng.");
      return;
    }

    navigate("/checkout-cart-info", { state: { selectedProducts } });
  };

  const totalPrice = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.total_price, 0);

  if (loading)
    return <div className="container py-4">Đang tải giỏ hàng...</div>;

  return (
    <div className="container py-4">
      <h2>Giỏ hàng</h2>
      {cart.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Hình ảnh</th>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                    />
                  </td>
                  <td>
                    <img
                      src={
                        item.images?.[0] || "https://via.placeholder.com/300"
                      }
                      alt={item.name}
                      className="card-img-top"
                      style={{
                        width: "100%",
                        height: "50px",
                        objectFit: "contain",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/product/${item.product_id}`)}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{Number(item.unit_price).toLocaleString("vi-VN")}₫</td>
                  <td>
  <div className="d-flex flex-column">
    <div className="d-flex gap-2 align-items-center">
      <button
        className="btn btn-sm btn-outline-secondary"
        onClick={() => updateQuantity(item.id, -1)}
        disabled={item.quantity <= 1}
      >
        -
      </button>
      {item.quantity}
      <button
        className="btn btn-sm btn-outline-secondary"
        onClick={() => updateQuantity(item.id, 1)}
        disabled={item.quantity >= 5}
      >
        +
      </button>
    </div>
    {/* Không thay đổi layout dù chưa hiển thị thông báo */}
    <small
      className="mt-1"
      style={{
        minHeight: "1em", // đảm bảo luôn chiếm chiều cao
        color: item.quantity >= 5 ? "red" : "transparent",
        transition: "color 0.3s",
      }}
    >
      Tối đa 5 sản phẩm.
    </small>
  </div>
</td>
                  <td
  style={{
    width: "130px",       // hoặc chỉnh theo ý bạn
    whiteSpace: "nowrap", // không xuống dòng, giữ nguyên trên 1 dòng
    textAlign: "left",   // canh phải cho tiền nhìn đẹp
  }}
>
  {(item.unit_price * item.quantity).toLocaleString("vi-VN")}₫
</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteClick(item)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="text-end">
            Tổng cộng:{" "}
            <span className="text-danger">
              {totalPrice.toLocaleString("vi-VN")}₫
            </span>
          </h4>
          <div className="text-end">
            <button
              className="btn btn-success"
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
            >
              Đặt hàng
            </button>
          </div>
        </>
      )}

      {/* Modal xác nhận xóa */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác nhận xóa</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Bạn có chắc muốn xóa sản phẩm "{itemToDelete?.name}" khỏi giỏ
                  hàng?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;


