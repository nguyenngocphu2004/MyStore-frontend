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

export default function MonthlyProfitWithExtraCosts() {
  const [profitData, setProfitData] = useState({});
  const token = localStorage.getItem("adminToken");

  // Lưu chi phí bổ sung theo tháng và theo loại (string để bind input)
  const [extraCostsByMonth, setExtraCostsByMonth] = useState({});

  useEffect(() => {
    const fetchProfit = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin/profit", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfitData(data);

          // Khởi tạo extraCostsByMonth với các tháng có trong dữ liệu
          if (data.profit_by_month) {
            const initialCosts = {};
            data.profit_by_month.forEach(([month]) => {
              initialCosts[month] = { staff: "", rent: "", living: "", other: "" };
            });
            setExtraCostsByMonth(initialCosts);
          }
        } else {
          console.error("Không lấy được dữ liệu lợi nhuận");
        }
      } catch (err) {
        console.error("Lỗi fetch:", err);
      }
    };

    fetchProfit();
  }, [token]);

  // Tính tổng chi phí bổ sung cho 1 tháng
  const calcTotalExtraCost = (month) => {
    if (!extraCostsByMonth[month]) return 0;
    return Object.values(extraCostsByMonth[month]).reduce((acc, val) => {
      const num = Number(val);
      return acc + (isNaN(num) ? 0 : num);
    }, 0);
  };

  // Tạo data cho Bar chart: doanh thu, chi phí (gốc + bổ sung), lợi nhuận (cập nhật)
  const createBarData = () => {
    if (!profitData.profit_by_month) return { labels: [], datasets: [] };

    const labels = profitData.profit_by_month.map(([month]) => month);
    const revenues = [];
    const costs = [];
    const profits = [];

    profitData.profit_by_month.forEach(([month, revenue, cost, profit]) => {
      const extra = calcTotalExtraCost(month);
      revenues.push(revenue);
      costs.push(cost + extra);
      profits.push(revenue - (cost + extra));
    });

    return {
      labels,
      datasets: [
        {
          label: "Doanh thu",
          data: revenues,
          backgroundColor: "rgba(54, 162, 235, 0.6)"
        },
        {
          label: "Tổng chi phí (gốc + bổ sung)",
          data: costs,
          backgroundColor: "rgba(255, 99, 132, 0.6)"
        },
        {
          label: "Lợi nhuận mới",
          data: profits,
          backgroundColor: "rgba(75, 192, 192, 0.6)"
        }
      ]
    };
  };

  // Xử lý thay đổi input chi phí bổ sung
  const handleExtraCostChange = (month, key, value) => {
    setExtraCostsByMonth((prev) => ({
      ...prev,
      [month]: {
        ...prev[month],
        [key]: value
      }
    }));
  };

  return (
    <div className="container mt-5">
      <h2>Lợi nhuận theo tháng với chi phí bổ sung</h2>

      {/* Bảng nhập chi phí bổ sung theo tháng */}
      <table className="table table-bordered mb-4">
        <thead>
          <tr>
            <th>Tháng</th>
            <th>Nhân viên</th>
            <th>Mặt bằng</th>
            <th>Sinh hoạt</th>
            <th>Khác</th>
            <th>Tổng chi phí bổ sung</th>
            <th>Doanh thu</th>
            <th>Chi phí gốc</th>
            <th>Tổng chi phí</th>
            <th>Lợi nhuận mới</th>
          </tr>
        </thead>
        <tbody>
          {profitData.profit_by_month?.map(([month, revenue, cost]) => {
            const extraTotal = calcTotalExtraCost(month);
            const totalCost = cost + extraTotal;
            const newProfit = revenue - totalCost;

            return (
              <tr key={month}>
                <td>{month}</td>
                {["staff", "rent", "living", "other"].map((key) => (
                  <td key={key}>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={extraCostsByMonth[month]?.[key] || ""}
                      onChange={(e) =>
                        handleExtraCostChange(month, key, e.target.value)
                      }
                    />
                  </td>
                ))}
                <td>{extraTotal.toLocaleString()}</td>
                <td>{revenue.toLocaleString()}</td>
                <td>{cost.toLocaleString()}</td>
                <td>{totalCost.toLocaleString()}</td>
                <td>{newProfit.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Biểu đồ */}
      <Bar data={createBarData()} />
    </div>
  );
}
