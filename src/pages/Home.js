import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi khi fetch products:", err));
  }, []);

  return (
    <div>
      {/* Banner */}
      <section className="bg-danger text-white text-center py-5">
        <h1 className="display-5 fw-bold">Sale Quốc Khánh</h1>
        <p className="lead">Ngàn deal sốc đến 50%</p>
        <button className="btn btn-warning text-dark fw-semibold mt-3">
          Mua ngay
        </button>
      </section>

      {/* Danh sách sản phẩm */}
      <main className="container my-5">
        <div className="row g-4">
          {products.map((p) => (
            <div key={p.id} className="col-6 col-md-3">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;
