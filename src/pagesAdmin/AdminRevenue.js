import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import {BiSearch } from "react-icons/bi";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [salesByProduct, setSalesByProduct] = useState([]);
  const [activeTab, setActiveTab] = useState("month_stats");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [currentPageMonth, setCurrentPageMonth] = useState(1);
  const itemsPerPageMonth = 3; // mỗi trang 3 tháng
  const [pagination, setPagination] = useState({}); // lưu thông tin phân trang từ backend

  const token = localStorage.getItem("adminToken");

  const months = Array.from({ length: 12 }, (_, i) => i + 1); // 1 -> 12
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i); // 5 năm gần đây

  // Gọi API dashboard với page
  const fetchStats = async (page = 1, monthQuery = "") => {
  try {
    const url = new URL("http://localhost:5000/admin/dashboard");
    url.searchParams.append("page", page);
    url.searchParams.append("per_page", itemsPerPageMonth);
    if (monthQuery) url.searchParams.append("month", monthQuery); // thêm query month

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setStats(data);
      setPagination(data.pagination || {});
      setCurrentPageMonth(data.pagination?.page || 1);
    } else {
      console.error("Không lấy được dữ liệu dashboard");
    }
  } catch (error) {
    console.error("Lỗi fetch:", error);
  }
};


  const fetchSalesByProduct = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/sales_by_product", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSalesByProduct(data);
      }
    } catch (err) {
      console.error("Lỗi fetch sales:", err);
    }
  };

  useEffect(() => {
    fetchStats(1);
    fetchSalesByProduct();
  }, [token]);

  const createBarData = (labels, values, label, color) => ({
    labels: labels || [],
    datasets: [{ label, data: values || [], backgroundColor: color }]
  });

  return (
    <div className="container mt-5">
      <h2>Thống kê</h2>
      <div className="mb-3">
        <strong>Tổng doanh thu:</strong>{" "}
        {Number(stats.total_revenue).toLocaleString("vi-VN")} VNĐ
      </div>
      <div className="mb-3">
        <strong>Tổng đơn hàng:</strong> {stats.total_orders || 0}
      </div>

      {/* Tabs menu */}
      <div className="mb-4">
        <button
          className={`btn btn-outline-primary me-4 ${
            activeTab === "month_stats" ? "active" : ""
          }`}
          onClick={() => setActiveTab("month_stats")}
        >
          Doanh thu & Đơn hàng theo tháng
        </button>
        <button
          className={`btn btn-outline-primary me-4 ${
            activeTab === "brand_stats" ? "active" : ""
          }`}
          onClick={() => setActiveTab("brand_stats")}
        >
          Theo thương hiệu
        </button>
        <button
          className={`btn btn-outline-primary me-4 ${
            activeTab === "category_stats" ? "active" : ""
          }`}
          onClick={() => setActiveTab("category_stats")}
        >
          Theo danh mục
        </button>
        <button
          className={`btn btn-outline-primary me-4 ${
            activeTab === "product_stats" ? "active" : ""
          }`}
          onClick={() => setActiveTab("product_stats")}
        >
          Theo sản phẩm
        </button>
      </div>

      {/* Tab content */}
      <div className="mb-5">
        {/* Doanh thu & đơn hàng theo tháng */}
        {activeTab === "month_stats" && (
          <div>
            <div className="mb-3 d-flex align-items-center">
  <select
    className="form-select me-2"
    value={selectedMonth}
    onChange={(e) => setSelectedMonth(e.target.value)}
  >
    <option value="">Chọn tháng</option>
    {months.map((m) => (
      <option key={m} value={m.toString().padStart(2, '0')}>
        {m}
      </option>
    ))}
  </select>

  <select
    className="form-select me-2"
    value={selectedYear}
    onChange={(e) => setSelectedYear(e.target.value)}
  >
    <option value="">Chọn năm</option>
    {years.map((y) => (
      <option key={y} value={y}>{y}</option>
    ))}
  </select>

  <button
  className="btn btn-primary"
  onClick={() => {
    const monthQuery = selectedMonth && selectedYear ? `${selectedYear}-${selectedMonth}` : "";
    fetchStats(1, monthQuery);
  }}
>
  <BiSearch/>
</button>

</div>
            <h5>Doanh thu & Đơn hàng theo tháng</h5>
            <div className="row">
              <div className="col-md-6">
                <h6>Doanh thu theo tháng</h6>
                <Bar
                  data={createBarData(
                    stats.revenue_by_month?.map((r) => r[0]),
                    stats.revenue_by_month?.map((r) => r[1]),
                    "Doanh thu (VNĐ)",
                    "rgba(54, 162, 235, 0.6)"
                  )}
                />
              </div>
              <div className="col-md-6">
                <h6>Đơn hàng theo tháng</h6>
                <Bar
                  data={createBarData(
                    stats.orders_by_month?.map((r) => r[0]),
                    stats.orders_by_month?.map((r) => r[1]),
                    "Số đơn hàng",
                    "rgba(255, 99, 132, 0.6)"
                  )}
                />
              </div>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-secondary me-2"
                disabled={currentPageMonth <= 1}
                onClick={() => fetchStats(currentPageMonth - 1)}
              >
                &lt;
              </button>
              <span className="align-self-center mx-2">
                Trang {pagination.page || 1} / {pagination.total_pages || 1}
              </span>
              <button
                className="btn btn-secondary ms-2"
                disabled={
                  !pagination.total_pages ||
                  currentPageMonth >= pagination.total_pages
                }
                onClick={() => fetchStats(currentPageMonth + 1)}
              >
                &gt;
              </button>
            </div>
          </div>
        )}

        {/* Theo thương hiệu */}
        {activeTab === "brand_stats" && (
          <div>
            <h5>Sản phẩm & Doanh thu theo thương hiệu</h5>
            <div className="row">
              <div className="col-md-6">
                <h6>Số lượng sản phẩm theo thương hiệu</h6>
                <Bar
                  data={createBarData(
                    stats.products_by_brand?.map((r) => r[0]),
                    stats.products_by_brand?.map((r) => r[1]),
                    "Số sản phẩm",
                    "rgba(75, 192, 192, 0.6)"
                  )}
                />
              </div>
              <div className="col-md-6">
                <h6>Doanh thu theo thương hiệu</h6>
                <Bar
                  data={createBarData(
                    stats.revenue_by_brand?.map((r) => r[0]),
                    stats.revenue_by_brand?.map((r) => r[1]),
                    "Doanh thu (VNĐ)",
                    "rgba(255, 159, 64, 0.6)"
                  )}
                />
              </div>
            </div>
          </div>
        )}

        {/* Theo danh mục */}
        {activeTab === "category_stats" && (
          <div>
            <h5>Sản phẩm & Doanh thu theo danh mục</h5>
            <div className="row">
              <div className="col-md-6">
                <h6>Số lượng sản phẩm theo danh mục</h6>
                <Bar
                  data={createBarData(
                    stats.products_by_category?.map((r) => `${r[0]}`),
                    stats.products_by_category?.map((r) => r[1]),
                    "Số sản phẩm",
                    "rgba(153, 102, 255, 0.6)"
                  )}
                />
              </div>
              <div className="col-md-6">
                <h6>Doanh thu theo danh mục</h6>
                <Bar
                  data={createBarData(
                    stats.revenue_by_category?.map((r) => `${r[0]}`),
                    stats.revenue_by_category?.map((r) => r[1]),
                    "Doanh thu (VNĐ)",
                    "rgba(255, 206, 86, 0.6)"
                  )}
                />
              </div>
            </div>
          </div>
        )}

        {/* Theo sản phẩm */}
        {activeTab === "product_stats" && (
          <div>
            <h5 className="mb-4">Thống kê theo sản phẩm theo danh mục</h5>
            {salesByProduct && Object.keys(salesByProduct).length > 0 ? (
              Object.entries(salesByProduct).map(([category, products]) => (
                <div key={category} className="mb-5">
                  <h4 className="mb-3 text-primary">{category}</h4>
                  <div className="row">
                    {products.map((item, idx) => (
                      <div key={idx} className="col-md-4 mb-4">
                        <div className="card shadow-sm h-100">
                          <div className="card-body">
                            <h5 className="card-title">{item.name}</h5>
                            <p className="card-text">
                              <strong>Đã bán:</strong> {item.total_sold} <br />
                              <strong>Tồn kho:</strong> {item.stock}
                            </p>
                            <span
                              className={`badge ${
                                item.status === "Bán chạy"
                                  ? "bg-success"
                                  : item.status === "Bình thường"
                                  ? "bg-warning text-dark"
                                  : "bg-danger"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">Chưa có dữ liệu bán hàng</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
