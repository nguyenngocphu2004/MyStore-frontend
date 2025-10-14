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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {BiSearch} from "react-icons/bi";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ProfitDashboard() {
  const [profitData, setProfitData] = useState([]);
  const [extraCostsByMonth, setExtraCostsByMonth] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 2;
  const token = localStorage.getItem("adminToken");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const fetchProfit = async (page = 1) => {
  try {
    let url = `http://localhost:5000/admin/profit?page=${page}&per_page=${itemsPerPage}`;
    if (selectedMonth && selectedYear) {
      const monthStr = String(selectedMonth).padStart(2, "0");
      url += `&month=${selectedYear}-${monthStr}`;
    }

    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      if (!data.profit_by_month || data.profit_by_month.length === 0) {
        toast.info("Không tìm thấy dữ liệu!");
      }
      setProfitData(data.profit_by_month || []);
      setTotalPages(data.pagination?.total_pages || 1);

      // khởi tạo extraCosts
      const initialCosts = {};
      (data.profit_by_month || []).forEach(([month, , , , staff, rent, living, other]) => {
        initialCosts[month] = { staff, rent, living, other };
      });
      setExtraCostsByMonth(initialCosts);
    } else {
      toast.error("Lấy dữ liệu thất bại!");
    }
  } catch (err) {
    console.error(err);
    toast.error("Lỗi khi fetch dữ liệu!");
  }
};


  useEffect(() => {
    fetchProfit(currentPage);
  }, [token, currentPage]);

  const chartData = useMemo(() => {
    const labels = profitData.map(([month]) => month);
    const revenues = profitData.map(([month, revenue]) => revenue);
    const totalCosts = profitData.map(([month, _, cost]) => {
      const extra = extraCostsByMonth[month] || {};
      return cost + (extra.staff || 0) + (extra.rent || 0) + (extra.living || 0) + (extra.other || 0);
    });
    const profits = profitData.map(([month, revenue, cost]) => {
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
  }, [profitData, extraCostsByMonth]);

  const handleExtraCostChange = (month, costType, value) => {
    setExtraCostsByMonth((prev) => ({
      ...prev,
      [month]: { ...prev[month], [costType]: Number(value) || 0 },
    }));
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
      toast.success("Lưu chi phí thành công!");
      fetchProfit(currentPage); // reload dữ liệu
    } else {
      toast.error("Lưu thất bại!");
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2>Lợi nhuận theo tháng với chi phí bổ sung</h2>

      <button className="btn btn-primary mb-3" onClick={saveExtraCosts}>
        Lưu chi phí
      </button>
      <div className="mb-3 d-flex align-items-center">
  <select
    className="form-select me-2"
    value={selectedMonth}
    onChange={(e) => setSelectedMonth(e.target.value)}
  >
    <option value="">Chọn tháng</option>
    {months.map((m) => (
      <option key={m} value={m}>{m}</option>
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
      setCurrentPage(1);
      fetchProfit(1);
    }}
  >
    <BiSearch/>
  </button>
</div>

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
            <th>Lợi nhuận</th>
          </tr>
        </thead>
        <tbody>
          {profitData.map(([month, revenue, cost]) => {
            const extra = extraCostsByMonth[month] || {};
            const extraTotal = (extra.staff || 0) + (extra.rent || 0) + (extra.living || 0) + (extra.other || 0);
            const totalCost = cost + extraTotal;
            const profitNew = revenue - totalCost;

            return (
              <tr key={month}>
                <td style={{ whiteSpace: "nowrap" }}>
  {(() => {
    const [year, monthPart] = month.split("-");
    return `${monthPart}/${year}`;
  })()}
</td>
                {["staff", "rent", "living", "other"].map((key) => (
                  <td key={key}>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={extra[key] || 0}
                      onChange={(e) => handleExtraCostChange(month, key, e.target.value)}
                    />
                  </td>
                ))}
                <td style={{ whiteSpace: "nowrap", textAlign: "right" }}>
  {Number(extraTotal).toLocaleString("vi-VN")} đ
</td>
<td style={{ whiteSpace: "nowrap", textAlign: "right" }}>
  {Number(revenue).toLocaleString("vi-VN")} đ
</td>
<td style={{ whiteSpace: "nowrap", textAlign: "right" }}>
  {Number(cost).toLocaleString("vi-VN")} đ
</td>
<td style={{ whiteSpace: "nowrap", textAlign: "right" }}>
  {Number(totalCost).toLocaleString("vi-VN")} đ
</td>
<td style={{ whiteSpace: "nowrap", textAlign: "right" }}>
  {Number(profitNew).toLocaleString("vi-VN")} đ
</td>

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
          &lt;
        </button>
        <span className="align-self-center">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="btn btn-secondary ms-2"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          &gt;
        </button>
      </div>

      <Bar data={chartData} />
    </div>
  );
}
