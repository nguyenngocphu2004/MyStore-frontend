import { useEffect, useState } from "react";
import axios from "axios";

function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const perPage = 3;

  const token = localStorage.getItem("adminToken");

  // State để lưu id bình luận đang sửa và nội dung reply sửa
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [replyInput, setReplyInput] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/comments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setComments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
        setLoading(false);
      });
  }, [token]);

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;

    try {
      await axios.delete(`http://localhost:5000/admin/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments((prev) => prev.filter((c) => c.id !== commentId));
      alert("Xóa bình luận thành công.");
    } catch (err) {
      console.error("Lỗi khi xóa bình luận:", err);
      alert("Xóa bình luận thất bại.");
    }
  };

  const handleStartEditReply = (comment) => {
    setEditingReplyId(comment.id);
    setReplyInput(comment.admin_reply || "");
  };

  const handleCancelEdit = () => {
    setEditingReplyId(null);
    setReplyInput("");
  };

  const handleSaveReply = async (commentId) => {
    try {
      await axios.put(
        `http://localhost:5000/admin/comments/${commentId}/reply`,
        { admin_reply: replyInput },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, admin_reply: replyInput } : c
        )
      );
      setEditingReplyId(null);
      setReplyInput("");
      alert("Cập nhật trả lời thành công.");
    } catch (err) {
      console.error("Lỗi khi cập nhật trả lời:", err);
      alert("Cập nhật trả lời thất bại.");
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Đang tải...</p>;
  }

  const grouped = comments.reduce((acc, c) => {
    if (!acc[c.product_id]) {
      acc[c.product_id] = {
        product_id: c.product_id,
        product_name: c.product_name,
        product_image: c.product_image,
        comments: [],
      };
    }
    acc[c.product_id].comments.push(c);
    return acc;
  }, {});

  const groupedArray = Object.values(grouped);

  const indexOfLast = page * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentProducts = groupedArray.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(groupedArray.length / perPage);

  return (
    <div className="p-4">
      <h3 className="mb-4 font-bold">Quản lý bình luận</h3>
        {totalPages > 1 && (
      <div className="d-flex justify-content-center mb-4">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Trước
              </button>
            </li>

            {[...Array(totalPages)].map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <li key={idx} className="page-item">
                  <button
                    className={`btn btn-sm me-2 ${
                      page === pageNumber ? "btn-dark" : "btn-outline-secondary"
                    }`}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </li>
              );
            })}

            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Sau
              </button>
            </li>
          </ul>
        </nav>
      </div>
    )}
      {currentProducts.length === 0 ? (
        <p className="text-center">Chưa có bình luận nào</p>
      ) : (
        currentProducts.map((group) => (
          <div
            key={group.product_id}
            className="border rounded-lg p-4 mb-6 shadow-sm bg-white"
          >
            <div className="d-flex">
              <div className="flex-shrink-0">
                {group.product_image ? (
                  <img
                    src={group.product_image}
                    alt={group.product_name}
                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    className="rounded border"
                  />
                ) : (
                  <div className="w-14 h-14 d-flex align-items-center justify-content-center bg-gray-200 rounded border text-gray-500 text-xs">
                    No Img
                  </div>
                )}
              </div>

              <div className="ms-3 flex-grow-1">
                <h4 className="text-base fw-bold mb-2">
                  {group.product_name || "Không rõ"}
                </h4>

                <div className="space-y-3">
                  {group.comments.map((c) => (
                    <div
                      key={c.id}
                      className="border-top pt-2 text-sm text-dark d-flex justify-content-between align-items-start"
                    >
                      <div>
                        <p>
                          <span className="fw-semibold">
                            {c.username || c.guest_name || "Guest"}
                          </span>{" "}
                          ({c.created_at})
                        </p>
                        <p>{c.content}</p>
                        <p>
                          Đánh giá: {c.rating ? "⭐".repeat(c.rating) : "-"} | Thích:{" "}
                          {c.likes}
                        </p>

                        {editingReplyId === c.id ? (
                          <div className="mt-1">
                            <textarea
                              value={replyInput}
                              onChange={(e) => setReplyInput(e.target.value)}
                              rows={3}
                              className="form-control"
                            />
                            <button
                              className="btn btn-sm btn-primary mt-2 me-2"
                              onClick={() => handleSaveReply(c.id)}
                            >
                              Lưu
                            </button>
                            <button
                              className="btn btn-sm btn-secondary mt-2"
                              onClick={handleCancelEdit}
                            >
                              Hủy
                            </button>
                          </div>
                        ) : c.admin_reply ? (
                          <p className="text-primary mt-1">
                            PhuStore trả lời: {c.admin_reply}{" "}
                            <button
                              className="btn btn-sm btn-outline-primary ms-2"
                              onClick={() => handleStartEditReply(c)}
                            >
                              Sửa
                            </button>
                          </p>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-success mt-1"
                            onClick={() => handleStartEditReply(c)}
                          >
                            Thêm trả lời
                          </button>
                        )}
                      </div>

                      <button
                        className="btn btn-sm btn-danger ms-3"
                        onClick={() => handleDeleteComment(c.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))
      )}


    </div>
  );
}

export default AdminComments;
