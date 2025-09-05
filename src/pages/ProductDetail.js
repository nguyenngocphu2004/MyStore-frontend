import React, { useEffect, useState,useCallback } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import { FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp,FaStar,FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [adding, setAdding] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [fade, setFade] = useState(false); // 👈 trạng thái để tạo hiệu ứng fade
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [guestInfo, setGuestInfo] = useState({ name: "", phone: "" });
  const token = localStorage.getItem("token");
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
  axios.get(`http://localhost:5000/products/${id}/comments`)
    .then(res => {
      setComments(res.data.comments);
      setAverageRating(res.data.average_rating);
    })
    .catch(() => setComments([]));
}, [id]);

// Gửi bình luận
const handleSubmitComment = async (e) => {
  e.preventDefault();
  if (!newComment.trim()|| rating === 0){
   alert("Vui lòng nhập bình luận và chọn số sao");
   return;
   }

  try {
    const payload = token
      ? { content: newComment, rating }
      : { content: newComment,rating, guest_name: guestInfo.name, guest_phone: guestInfo.phone };

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.post(
      `http://localhost:5000/products/${id}/comments`,
      payload,
      { headers }
    );

    setComments((prev) => [...prev, res.data.comment]);
    setNewComment("");
    setGuestInfo({ name: "", phone: "" });
    setRating(0);
  } catch (err) {
    alert(err.response?.data?.error || "Lỗi khi gửi bình luận");
  }
};

  useEffect(() => {
    axios
      .get(`http://localhost:5000/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setCurrentIndex(0);
      })
      .catch((err) => console.error("Lỗi khi lấy chi tiết sản phẩm:", err));
  }, [id]);
  const handleNext = useCallback(() => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
      setFade(false);
    }, 500);
  },[product]);

  // 👇 Auto chuyển ảnh sau 10 giây
  useEffect(() => {
    if (product && product.images && product.images.length > 1) {
      const interval = setInterval(() => {
        handleNext();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [product, currentIndex,handleNext]);

  const handlePrev = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
      setFade(false);
    }, 500); // thời gian hiệu ứng fade
  };
  // Vote comment
const handleVote = async (commentId, action) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.post(
      `http://localhost:5000/comments/${commentId}/vote`,
      { action },
      { headers, withCredentials: true } // 👈 để cookie session_id lưu với guest
    );

    // Cập nhật lại comments sau khi vote
    setComments((prev) =>
      prev.map((cmt) =>
        cmt.id === commentId
          ? { ...cmt, likes: res.data.likes }
          : cmt
      )
    );
  } catch (err) {
    alert(err.response?.data?.error || "Lỗi khi vote");
  }
};

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    setAdding(true);
    try {
      await axios.post(
        "http://localhost:5000/cart/add",
        { product_id: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("🛒 Đã thêm vào giỏ hàng!");
      navigate("/");

    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      if (error.response?.status === 401) {
        alert("Bạn cần đăng nhập lại!");
      } else {
        alert("Thêm vào giỏ hàng thất bại!");
      }
    } finally {
      setAdding(false);
    }
  };

  if (!product) return <p>Đang tải...</p>;

  // Chuẩn bị dữ liệu specs thành array để dễ cắt 10 dòng
  const specs = [
    { label: "Hãng", value: product.brand },
    { label: "CPU", value: product.cpu || "Chưa rõ" },
    { label: "RAM", value: product.ram },
    { label: "Bộ nhớ", value: product.storage },
    { label: "Màn hình", value: product.screen },
    { label: "Pin", value: product.battery },
    { label: "Hệ điều hành", value: product.os },
    { label: "Camera trước", value: product.camera_front },
    { label: "Camera sau", value: product.camera_rear },
    { label: "Màu sắc", value: product.color },
    { label: "Kích thước", value: product.dimensions },
    { label: "Trọng lượng", value: product.weight },
    { label: "Cổng kết nối", value: product.ports },
    { label: "Bảo hành", value: product.warranty },
    { label: "Ngày phát hành", value: product.release_date },
  ];

  const visibleSpecs = showAllSpecs ? specs : specs.slice(0, 10);

  return (
    <div className="container py-4">
      <div className="row">
        {/* Ảnh sản phẩm */}
        <div className="col-md-5 text-center">
          <div className="position-relative" style={{ maxWidth: "400px", margin: "0 auto" }}>
            <img
              src={product.images[currentIndex]}
              alt={product.name}
              className={`img-fluid fade-image ${fade ? "fade-out" : "fade-in"}`}
              style={{ borderRadius: "8px", maxHeight: "400px", objectFit: "contain" }}
            />
            <button
              onClick={handlePrev}
              className="btn shadow-sm"
              style={{
                position: "absolute",
                left: "-50px",
                top: "50%",
                transform: "translateY(-50%)",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #ddd",
              }}
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={handleNext}
              className="btn shadow-sm"
              style={{
                position: "absolute",
                right: "-50px",
                top: "50%",
                transform: "translateY(-50%)",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #ddd",
              }}
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Thumbnail */}
          <div className="d-flex gap-2 justify-content-center flex-wrap mt-3">
            {product.images &&
              product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  className="img-thumbnail"
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    cursor: "pointer",
                    border: currentIndex === idx ? "2px solid #f60" : "1px solid #ddd",
                  }}
                  onClick={() => setCurrentIndex(idx)}
                />
              ))}
          </div>
          {/* Bình luận */}
<div className="mt-4">
   <h3>Đánh giá trung bình</h3>
      <div className="d-flex align-items-center mb-2">
      {[1, 2, 3, 4, 5].map((star) => {
        if (averageRating >= star) {
          return <FaStar key={star} size={20} color="#ffc107" />;
        } else if (averageRating >= star - 0.5) {
          return <FaStarHalfAlt key={star} size={20} color="#ffc107" />;
        } else {
          return <FaRegStar key={star} size={20} color="#e4e5e9" />;
        }
      })}
      <span className="ms-2">({averageRating.toFixed(1)})</span>
    </div>
  <h5>Bình luận</h5>

  <ul className="list-group">
  {comments.map((cmt) => (
    <li
      key={cmt.id}
      className="list-group-item d-flex align-items-center justify-content-between"
      style={{ gap: "10px" }}
    >
      {/* Bên trái: tên + sao + nội dung */}
      <div className="d-flex align-items-center" style={{ gap: "8px" }}>
        <strong>{cmt.username || cmt.guest_name || "Ẩn danh"}</strong>
        <span>:</span>
        <div className="d-flex align-items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={16}
              color={cmt.rating >= star ? "#ffc107" : "#e4e5e9"}
            />
          ))}
        </div>
        <span>{cmt.content}</span>
      </div>

      {/* Bên phải: nút vote + thời gian */}
      <div className="d-flex align-items-center" style={{ gap: "10px" }}>
        <button
          className="btn btn-sm btn-outline-success"
          onClick={() => handleVote(cmt.id, "like")}
        >
          👍 Hữu ích ({cmt.likes || 0})
        </button>
        <small className="text-muted">{cmt.created_at}</small>
      </div>
    </li>
  ))}
</ul>

</div>
<form onSubmit={handleSubmitComment} className="comment-form">
    {!token && (
      <>
        <input
          type="text"
          placeholder="Họ tên"
          className="form-control mb-2"
          value={guestInfo.name}
          onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Số điện thoại"
          className="form-control mb-2"
          value={guestInfo.phone}
          onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
          required
        />
      </>
    )}

    {/* Chọn số sao */}
              <div className="mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={24}
                    onClick={() => setRating(star)}
                    style={{
                      cursor: "pointer",
                      color: rating >= star ? "#ffc107" : "#e4e5e9",
                      marginRight: "4px",
                    }}
                  />
                ))}
              </div>
    <textarea
      className="form-control mb-2"
      placeholder="Nhập bình luận..."
      rows="3"
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      required
    />
    <button type="submit" className="btn btn-primary">
      Gửi bình luận
    </button>
  </form>

        </div>

        {/* Thông tin sản phẩm */}
        <div className="col-md-7">
          <h2>{product.name}</h2>
          <h4 className="text-danger">{Number(product.price).toLocaleString("vi-VN")}₫</h4>

          <table className="table mt-3">
            <tbody>
              {visibleSpecs.map((spec, idx) => (
                <tr key={idx}>
                  <th>{spec.label}</th>
                  <td>{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Nút xem thêm / thu gọn */}
          {specs.length > 10 && (
            <button
              className="btn btn-light d-flex align-items-center gap-2"
              onClick={() => setShowAllSpecs(!showAllSpecs)}
            >
              {showAllSpecs ? (
                <>
                  Thu gọn <FaChevronUp />
                </>
              ) : (
                <>
                  Xem thêm <FaChevronDown />
                </>
              )}
            </button>
          )}

          <button
            onClick={handleAddToCart}
            className="btn btn-warning mt-3"
            disabled={adding}
          >
            {adding ? "Đang thêm..." : "Thêm vào giỏ"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;