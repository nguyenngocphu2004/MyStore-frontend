import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "../components/ConfirmModal";
import { BiTrash, BiEdit, BiSearch } from "react-icons/bi";

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const perPage = 3;

  const token = localStorage.getItem("adminToken");
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [replyInput, setReplyInput] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = (msg, type = "success") => {
    type === "success"
      ? toast.success(msg, { position: "top-right", autoClose: 3000 })
      : toast.error(msg, { position: "top-right", autoClose: 3000 });
  };

  const fetchComments = async (pageNum = page) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/admin/comments?page=${pageNum}&per_page=${perPage}&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data.comments);
      setPages(res.data.pages);
      setPage(res.data.page);
    } catch (err) {
      console.error(err);
      showToast("Không thể tải danh sách bình luận", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [token, page]);

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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, admin_reply: replyInput } : c
        )
      );
      setEditingReplyId(null);
      setReplyInput("");
      showToast("Cập nhật trả lời thành công");
    } catch (err) {
      console.error(err);
      showToast("Cập nhật trả lời thất bại", "error");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/admin/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      showToast("Xóa bình luận thành công");
    } catch (err) {
      console.error(err);
      showToast("Xóa bình luận thất bại", "error");
    }
  };

  // Nhóm bình luận theo sản phẩm
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

  if (loading) return <p className="text-center mt-5">Đang tải...</p>;

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <h3 className="mb-4 font-bold">Quản lý bình luận</h3>

      {/* Search */}
      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Tìm theo tên sản phẩm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => fetchComments(1)}>
          <BiSearch />
        </button>
      </div>

      {groupedArray.length === 0 ? (
        <p className="text-center">Chưa có bình luận nào</p>
      ) : (
        groupedArray.map((group) => (
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
                          ({new Date(c.created_at).toLocaleString("vi-VN")})
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
                              <BiEdit />
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
                        onClick={() => setConfirmDeleteId(c.id)}
                      >
                        <BiTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => fetchComments(page - 1)}
                disabled={page === 1}
              >
                Trước
              </button>
            </li>

            {[...Array(pages)].map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <li key={idx} className="page-item">
                  <button
                    className={`btn btn-sm me-2 ${
                      page === pageNumber ? "btn-dark" : "btn-outline-secondary"
                    }`}
                    onClick={() => fetchComments(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </li>
              );
            })}

            <li className={`page-item ${page === pages ? "disabled" : ""}`}>
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => fetchComments(page + 1)}
                disabled={page === pages}
              >
                Sau
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        show={confirmDeleteId !== null}
        message="Bạn có chắc muốn xóa bình luận này?"
        onConfirm={() => {
          handleDeleteComment(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
