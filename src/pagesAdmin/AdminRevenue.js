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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState("month_stats"); // mặc định tab đầu
  const token = localStorage.getItem("adminToken");

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        console.error("Không lấy được dữ liệu dashboard");
      }
    } catch (error) {
      console.error("Lỗi fetch:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const createBarData = (labels, values, label, color) => ({
    labels: labels || [],
    datasets: [{ label, data: values || [], backgroundColor: color }]
  });

  return (
    <div className="container mt-5">
      <h2>Dashboard Admin</h2>
      <div className="mb-3">
        <strong>Tổng doanh thu:</strong>{" "}
        {(stats.total_revenue || 0).toLocaleString()} VNĐ
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
          Sản phẩm & Doanh thu theo thương hiệu
        </button>
        <button
          className={`btn btn-outline-primary me-4 ${
            activeTab === "category_stats" ? "active" : ""
          }`}
          onClick={() => setActiveTab("category_stats")}
        >
          Sản phẩm & Doanh thu theo danh mục
        </button>
      </div>

      {/* Tab content */}
      <div className="mb-5">
        {/* Gộp doanh thu & đơn hàng */}
        {activeTab === "month_stats" && (
          <div>
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
          </div>
        )}

        {/* Gộp sản phẩm & doanh thu thương hiệu */}
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

        {/* Gộp sản phẩm & doanh thu danh mục */}
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
      </div>
    </div>
  );
}
