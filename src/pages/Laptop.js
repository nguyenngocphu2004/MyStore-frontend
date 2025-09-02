import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

// Danh sách thương hiệu có thể lọc
const brands = ["Tất cả", "Asus", "Hp", "Dell", "Macbook", "Lenovo", "Acer", "Gigabyte"];

function Phone() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("Tất cả");

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => {
        const phones = data.filter((item) => item.category === "Laptop");
        setProducts(phones);
        setFilteredProducts(phones);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedBrand === "Tất cả") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) =>
          p.brand.toLowerCase() === selectedBrand.toLowerCase()
        )
      );
    }
  }, [selectedBrand, products]);

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4">Laptop</h2>

      {/* --- Bộ lọc thương hiệu --- */}
      <div className="mb-4">
        <div className="d-flex overflow-auto gap-2 pb-2">
          {brands.map((brand) => (
            <button
              key={brand}
              className={`btn btn-sm ${
                selectedBrand === brand ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setSelectedBrand(brand)}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* --- Hiển thị sản phẩm --- */}
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
