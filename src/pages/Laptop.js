import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const screenSizes = ["13 inch", "14 inch", "15.6 inch", "17 inch"];
const priceOptions = [
  { label: "Tất cả", value: "" },
  { label: "Dưới 10 triệu", value: "0-10000000" },
  { label: "10 - 20 triệu", value: "10000000-20000000" },
  { label: "Trên 20 triệu", value: "20000000-999999999" },
];

function Laptop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("Tất cả");
  const [selectedScreen, setSelectedScreen] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  // Lấy sản phẩm laptop
  useEffect(() => {
    fetch("http://localhost:5000/products?page=1&per_page=50")
      .then((res) => res.json())
      .then((data) => {
        const laptops = data.products.filter(
          (item) => item.category && item.category.toLowerCase() === "laptop"
        );
        setProducts(laptops);
        setFilteredProducts(laptops);
      })
      .catch((err) => console.error(err));
  }, []);

  // Lấy brand từ backend
  useEffect(() => {
    fetch("http://localhost:5000/brands")
      .then((res) => res.json())
      .then((data) => {
        const brandNames = data.map((b) => b.name);
        setBrands(brandNames);
      })
      .catch((err) => console.error(err));
  }, []);

  // Lọc dữ liệu khi chọn filter
  useEffect(() => {
    let filtered = [...products];

    if (selectedBrand !== "Tất cả") {
      filtered = filtered.filter(
        (p) => p.brand && p.brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    if (selectedScreen) {
      filtered = filtered.filter((p) => p.screen === selectedScreen);
    }

    if (selectedPrice) {
      const [min, max] = selectedPrice.split("-").map(Number);
      filtered = filtered.filter((p) => p.price >= min && p.price <= max);
    }

    setFilteredProducts(filtered);
  }, [selectedBrand, selectedScreen, selectedPrice, products]);

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4">Laptop</h2>

      {/* Filter buttons */}
      <div className="d-flex align-items-center gap-2 mb-3 overflow-auto">
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

      {/* Advanced filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <label className="form-label">Kích thước màn hình</label>
          <select
            className="form-select"
            value={selectedScreen}
            onChange={(e) => setSelectedScreen(e.target.value)}
          >
            <option value="">Tất cả</option>
            {screenSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Khoảng giá</label>
          <select
            className="form-select"
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
          >
            {priceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List */}
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

export default Laptop;
