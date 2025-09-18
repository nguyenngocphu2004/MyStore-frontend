import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const brands = ["Apple", "Samsung", "Xiaomi", "Oppo", "Realme"];
const rams = ["4GB", "6GB", "8GB", "12GB"];
const cpus = ["Snapdragon", "MediaTek", "Apple", "Exynos"];

function Phone() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("Tất cả");
  const [showFilters, setShowFilters] = useState(false);

  // Bộ lọc nâng cao
  const [priceRange, setPriceRange] = useState("");
  const [stockOnly, setStockOnly] = useState(false);
  const [selectedRam, setSelectedRam] = useState("");
  const [selectedCpu, setSelectedCpu] = useState("");
  const [minBattery, setMinBattery] = useState("");

  useEffect(() => {
  fetch("http://localhost:5000/products?page=1&per_page=20")
    .then((res) => res.json())
    .then((data) => {
      console.log("API trả về:", data);
      const phones = data.products.filter(
        (item) => item.category && item.category.toLowerCase() === "điện thoại"
      );
      setProducts(phones);
      setFilteredProducts(phones);
    })
    .catch((err) => console.error(err));
}, []);


  useEffect(() => {
    let filtered = [...products];

    // Thương hiệu
    if (selectedBrand !== "Tất cả") {
      filtered = filtered.filter(
        (p) => p.brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // Giá
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((p) => p.price >= min && p.price <= max);
    }

    // Còn hàng
    if (stockOnly) {
      filtered = filtered.filter((p) => p.inStock === true);
    }

    // RAM
    if (selectedRam) {
      filtered = filtered.filter((p) => p.ram === selectedRam);
    }

    // CPU
    if (selectedCpu) {
      filtered = filtered.filter((p) =>
        p.cpu.toLowerCase().includes(selectedCpu.toLowerCase())
      );
    }

    // Dung lượng pin
    if (minBattery) {
      filtered = filtered.filter((p) => p.battery >= parseInt(minBattery));
    }

    setFilteredProducts(filtered);
  }, [
    selectedBrand,
    priceRange,
    stockOnly,
    selectedRam,
    selectedCpu,
    minBattery,
    products
  ]);

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4">Điện thoại nổi bật</h2>

      {/* Bộ lọc: nút lọc và thương hiệu */}
      <div className="d-flex align-items-center gap-2 mb-3 overflow-auto">
  <button
    className="btn btn-outline-secondary btn-sm"
    onClick={() => setShowFilters(!showFilters)}
  >
    <i className="bi bi-funnel-fill me-1"></i>Lọc
  </button>
  <button
    className={`btn btn-sm ${
      selectedBrand === "Tất cả" ? "btn-warning" : "btn-outline-dark"
    }`}
    onClick={() => setSelectedBrand("Tất cả")}
  >
    Tất cả
  </button>
  {brands.map((brand) => (
    <button
      key={brand}
      className={`btn btn-sm ${
        selectedBrand === brand ? "btn-warning" : "btn-outline-dark"
      }`}
      onClick={() => setSelectedBrand(brand)}
    >
      {brand}
    </button>
  ))}
</div>


      {/* Bộ lọc mở rộng */}
      {showFilters && (
        <div className="border rounded p-3 mb-4 bg-light">
          <div className="row g-3">
            {/* Giá */}
            <div className="col-md-4">
              <label className="form-label">Khoảng giá</label>
              <select
                className="form-select"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="0-5000000">Dưới 5 triệu</option>
                <option value="5000000-10000000">5 - 10 triệu</option>
                <option value="10000000-20000000">10 - 20 triệu</option>
                <option value="20000000-100000000">Trên 20 triệu</option>
              </select>
            </div>

            {/* Còn hàng */}
            <div className="col-md-4 d-flex align-items-end">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="stockOnly"
                  checked={stockOnly}
                  onChange={(e) => setStockOnly(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="stockOnly">
                  Còn hàng
                </label>
              </div>
            </div>

            {/* RAM */}
            <div className="col-md-4">
              <label className="form-label">RAM</label>
              <select
                className="form-select"
                value={selectedRam}
                onChange={(e) => setSelectedRam(e.target.value)}
              >
                <option value="">Tất cả</option>
                {rams.map((ram) => (
                  <option key={ram} value={ram}>
                    {ram}
                  </option>
                ))}
              </select>
            </div>

            {/* CPU */}
            <div className="col-md-4">
              <label className="form-label">CPU</label>
              <select
                className="form-select"
                value={selectedCpu}
                onChange={(e) => setSelectedCpu(e.target.value)}
              >
                <option value="">Tất cả</option>
                {cpus.map((cpu) => (
                  <option key={cpu} value={cpu}>
                    {cpu}
                  </option>
                ))}
              </select>
            </div>

            {/* Pin */}
            <div className="col-md-4">
              <label  className="form-label">Dung lượng pin tối thiểu (mAh)</label>
              <input
                step="500"
                type="number"
                className="form-control"
                placeholder="VD: 5000"
                value={minBattery}
                onChange={(e) => setMinBattery(e.target.value)}
              />
            </div>
          </div>
          {/* Nút Đóng */}
            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowFilters(false)}
              >
                Đóng
              </button>
            </div>
        </div>
      )}

      {/* Danh sách sản phẩm */}
      <div className="row g-4">
        {filteredProducts.map((p) => (
          <div key={p.id} className="col-6 col-md-3">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Phone;
