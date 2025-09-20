import React, { useEffect, useState, useMemo } from "react";
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
  const [profitData, setProfitData] = useState([]);
  const [extraCostsByMonth, setExtraCostsByMonth] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null); // { msg, type }
  const itemsPerPage = 2;
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchProfit = async () => {
      const res = await fetch("http://localhost:5000/admin/profit", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfitData(data.profit_by_month);
        const initialCosts = {};
        data.profit_by_month.forEach(([month, , , , staff, rent, living, other]) => {
          initialCosts[month] = { staff, rent, living, other };
        });
        setExtraCostsByMonth(initialCosts);
      }
    };
    fetchProfit();
  }, [token]);

  const paginatedData = useMemo(() => {
    return profitData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [profitData, currentPage]);

  const chartData = useMemo(() => {
    const labels = paginatedData.map(([month]) => month);
    const revenues = paginatedData.map(([month, revenue]) => revenue);
    const totalCosts = paginatedData.map(([month, _, cost]) => {
      const extra = extraCostsByMonth[month] || {};
      return cost + (extra.staff || 0) + (extra.rent || 0) + (extra.living || 0) + (extra.other || 0);
    });
    const profits = paginatedData.map(([month, revenue, cost]) => {
      const extra = extraCostsByMonth[month] || {};
      return revenue - (cost + (extra.staff || 0) + (extra.rent || 0) + (extra.living || 0) + (extra.other || 0));
    });

    return {
      labels,
      datasets: [
        { label: "Doanh thu", data: revenues, backgroundColor: "rgba(54, 162, 235, 0.6)" },
        { label: "Tổng chi phí (gốc + bổ sung)", data: totalCosts, backgroundColor: "rgba(255, 99, 132, 0.6)" },
        { label: "Lợi nhuận mới", data: profits, backgroundColor: "rgba(75, 192, 192, 0.6)" },
      ],
    };
  }, [paginatedData, extraCostsByMonth]);

  const handleExtraCostChange = (month, costType, value) => {
    setExtraCostsByMonth((prev) => ({
      ...prev,
      [month]: { ...prev[month], [costType]: Number(value) || 0 },
    }));
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveExtraCosts = async () => {
    const res = await fetch("http://localhost:5000/admin/extra_costs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(extraCostsByMonth),
    });
    if (res.ok) {
      showToast("Lưu chi phí thành công!", "success");
    } else {
      showToast("Lưu thất bại!", "danger");
    }
  };

  const totalPages = Math.ceil(profitData.length / itemsPerPage);

  return (
    <div className="container mt-5">
      <h2>Lợi nhuận theo tháng với chi phí bổ sung</h2>

      {/* Toast hiển thị góc trên bên phải */}
      {toast && (
        <div
          className={`toast show position-fixed top-0 end-0 m-3 text-white border-0 ${
            toast.type === "success" ? "bg-success" : "bg-danger"
          }`}
          role="alert"
          style={{ zIndex: 9999 }}
        >
          <div className="d-flex">
            <div className="toast-body">{toast.msg}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setToast(null)}
            ></button>
          </div>
        </div>
      )}

      <button className="btn btn-primary mb-3" onClick={saveExtraCosts}>
        Lưu chi phí
      </button>

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
          {paginatedData.map(([month, revenue, cost]) => {
            const extra = extraCostsByMonth[month] || {};
            const extraTotal =
              (extra.staff || 0) +
              (extra.rent || 0) +
              (extra.living || 0) +
              (extra.other || 0);
            const totalCost = cost + extraTotal;
            const profitNew = revenue - totalCost;

            return (
              <tr key={month}>
                <td>{month}</td>
                {["staff", "rent", "living", "other"].map((key) => (
                  <td key={key}>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={extra[key] || 0}
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
                <td>{profitNew.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="d-flex justify-content-center mb-4">
        <button
          className="btn btn-secondary me-2"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          &lt; Trước
        </button>
        <span className="align-self-center">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="btn btn-secondary ms-2"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Tiếp &gt;
        </button>
      </div>

      <Bar data={chartData} />
    </div>
  );
}
