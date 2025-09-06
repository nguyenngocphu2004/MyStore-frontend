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

export default function ProfitDashboard() {
  const [profitData, setProfitData] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const token = localStorage.getItem("adminToken");

  // Lấy dữ liệu từ backend
  useEffect(() => {
    const fetchProfit = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin/profit", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfitData(data);
        } else {
          console.error("Không lấy được dữ liệu lợi nhuận");
        }
      } catch (err) {
        console.error("Lỗi fetch:", err);
      }
    };

    fetchProfit();
  }, [token]);

  // Hàm tạo dữ liệu cho Bar Chart
  const createBarData = (labels, revenues, costs, profits) => ({
    labels: labels || [],
    datasets: [
      {
        label: "Doanh thu",
        data: revenues || [],
        backgroundColor: "rgba(54, 162, 235, 0.6)"
      },
      {
        label: "Chi phí",
        data: costs || [],
        backgroundColor: "rgba(255, 99, 132, 0.6)"
      },
      {
        label: "Lợi nhuận",
        data: profits || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      }
    ]
  });

  // Hàm tính tổng


  return (
    <div className="container mt-5">
      <h2>Lợi nhuận</h2>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Tổng quan
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "month" ? "active" : ""}`}
            onClick={() => setActiveTab("month")}
          >
            Theo tháng
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "brand" ? "active" : ""}`}
            onClick={() => setActiveTab("brand")}
          >
            Theo thương hiệu
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "category" ? "active" : ""}`}
            onClick={() => setActiveTab("category")}
          >
            Theo danh mục
          </button>
        </li>
      </ul>

      {/* Tổng quan */}
      {activeTab === "overview" && (
        <div>
          <h5>Tổng quan:</h5>
          <p>
            <b>Doanh thu:</b>{" "}
            {(profitData.totals?.revenue || 0).toLocaleString()} VNĐ
          </p>
          <p>
            <b>Tổng chi phí:</b>{" "}
            {(profitData.totals?.cost || 0).toLocaleString()} VNĐ
          </p>
          <p>
            <b>Lợi nhuận:</b>{" "}
            {(profitData.totals?.profit || 0).toLocaleString()} VNĐ
          </p>
        </div>
      )}

      {/* Theo tháng */}
      {activeTab === "month" && (
        <div>
          <h5>Doanh thu - Chi phí - Lợi nhuận theo tháng</h5>
          {(() => {


            return
          })()}
          <Bar
            data={createBarData(
              profitData.profit_by_month?.map((r) => r[0]),
              profitData.profit_by_month?.map((r) => r[1]),
              profitData.profit_by_month?.map((r) => r[2]),
              profitData.profit_by_month?.map((r) => r[3])
            )}
          />
        </div>
      )}

      {/* Theo brand */}
      {activeTab === "brand" && (
        <div>
          <h5>Doanh thu - Chi phí - Lợi nhuận theo brand</h5>
          {(() => {

            return
          })()}
          <Bar
            data={createBarData(
              profitData.profit_by_brand?.map((r) => r[0]),
              profitData.profit_by_brand?.map((r) => r[1]),
              profitData.profit_by_brand?.map((r) => r[2]),
              profitData.profit_by_brand?.map((r) => r[3])
            )}
          />
        </div>
      )}

      {/* Theo category */}
      {activeTab === "category" && (
        <div>
          <h5>Doanh thu - Chi phí - Lợi nhuận theo category</h5>
          {(() => {

            return

          })()}
          <Bar
            data={createBarData(
              profitData.profit_by_category?.map((r) => `${r[0]}`),
              profitData.profit_by_category?.map((r) => r[1]),
              profitData.profit_by_category?.map((r) => r[2]),
              profitData.profit_by_category?.map((r) => r[3])
            )}
          />
        </div>
      )}
    </div>
  );
}
