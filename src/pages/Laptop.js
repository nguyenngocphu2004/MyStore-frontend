import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const priceOptions = [
  { label: "Tất cả", value: "" },
  { label: "10 - 20 triệu", value: "10000000-20000000" },
  { label: "20 - 40 triệu", value: "20000000-40000000" },
  { label: "40 - 70 triệu", value: "40000000-70000000" },
  { label: "Trên 70 triệu", value: "70000000-999999999" },
];

function Laptop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [screenSizes, setScreenSizes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("Tất cả");
  const [selectedScreen, setSelectedScreen] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const extractScreenSizes = (products) => {
  const sizes = new Set();

  products.forEach((p) => {
    const match = p.screen?.match(/^\d{2}(\.\d+)? inch/);
    if (match) {
      sizes.add(match[0]);
    }
  });

  return Array.from(sizes).sort();
  };

  // Phân trang
  const [page, setPage] = useState(1);
  const perPage = 8;

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

        // Lọc ra những brand có laptop
        const laptopBrands = [...new Set(laptops.map((p) => p.brand))];
        setBrands(laptopBrands);
        const sizes = extractScreenSizes(laptops);
        setScreenSizes(sizes);
      })
      .catch((err) => console.error(err));
  }, []);
  useEffect(() => {
  window.scrollTo({ top: 100, behavior: "smooth" });
}, [page]);

  // Lọc sản phẩm khi filter thay đổi
  useEffect(() => {
    let filtered = [...products];

    if (selectedBrand !== "Tất cả") {
      filtered = filtered.filter(
        (p) => p.brand && p.brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    if (selectedScreen) {
  filtered = filtered.filter((p) => p.screen.includes(selectedScreen));
    }

    if (selectedPrice) {
      const [min, max] = selectedPrice.split("-").map(Number);
      filtered = filtered.filter((p) => p.price >= min && p.price <= max);
    }

    setFilteredProducts(filtered);
    setPage(1); // reset về trang 1 khi filter
  }, [selectedBrand, selectedScreen, selectedPrice, products]);

  // Tính phân trang
  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const indexOfLast = page * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4">Laptop</h2>

      {/* Filter brand */}
      <div className="d-flex align-items-center gap-2 mb-3 overflow-auto">
        <button
          className={`btn btn-sm ${selectedBrand === "Tất cả" ? "btn-warning" : "btn-outline-dark"}`}
          onClick={() => setSelectedBrand("Tất cả")}
        >
          Tất cả
        </button>
        {brands.map((brand) => (
          <button
            key={brand}
            className={`btn btn-sm ${selectedBrand === brand ? "btn-warning" : "btn-outline-dark"}`}
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
        {currentProducts.map((p) => (
          <div key={p.id} className="col-6 col-md-3">
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {/* Pagination giống Home */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className={`btn btn-sm ${page === 1 ? "btn-secondary" : "btn-warning"} me-2`}
                  onClick={() => setPage(page - 1)}
                >
                  Trước
                </button>
              </li>

              {[...Array(totalPages)].map((_, idx) => (
                <li key={idx} className="page-item">
                  <button
                    className={`btn btn-sm ${page === idx + 1 ? "btn-warning" : "btn-outline-warning"} me-2`}
                    onClick={() => setPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                <button
                  className={`btn btn-sm ${page === totalPages ? "btn-secondary" : "btn-warning"}`}
                  onClick={() => setPage(page + 1)}
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

export default Laptop;
