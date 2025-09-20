import { useEffect, useState } from "react";
import axios from "axios";

function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const perPage = 3; // 3 sản phẩm mỗi trang

  const token = localStorage.getItem("adminToken");

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

  if (loading) {
    return <p className="text-center mt-5">Đang tải...</p>;
  }

  // Gom nhóm comments theo product_id
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

  // Phân trang theo sản phẩm
  const indexOfLast = page * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentProducts = groupedArray.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(groupedArray.length / perPage);

  return (
    <div className="p-4">
      <h3 className="mb-4 font-bold">Quản lý bình luận</h3>

      {currentProducts.length === 0 ? (
        <p className="text-center">Chưa có bình luận nào</p>
      ) : (
        currentProducts.map((group) => (
          <div
            key={group.product_id}
            className="border rounded-lg p-4 mb-6 shadow-sm bg-white"
          >
            <div className="d-flex">
              {/* Ảnh sản phẩm */}
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

              {/* Tên + Bình luận */}
              <div className="ms-3 flex-grow-1">
                <h4 className="text-base fw-bold mb-2">
                  {group.product_name || "Không rõ"}
                </h4>

                <div className="space-y-3">
                  {group.comments.map((c) => (
                    <div
                      key={c.id}
                      className="border-top pt-2 text-sm text-dark"
                    >
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
                      {c.admin_reply && (
                        <p className="text-primary mt-1">
                          PhuStore trả lời: {c.admin_reply}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Pagination giống AdminOrders */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
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
                        page === pageNumber
                          ? "btn-dark"
                          : "btn-outline-secondary"
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
    </div>
  );
}

export default AdminComments;
