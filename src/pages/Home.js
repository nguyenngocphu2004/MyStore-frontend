import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // phân trang
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const perPage = 16; // số sản phẩm mỗi trang

  useEffect(() => {
    fetch(`http://localhost:5000/products?page=${page}&per_page=${perPage}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setPages(data.pages);
      })
      .catch((err) => console.error("Lỗi khi fetch products:", err));
  }, [page]);

  const slides = [
    {
      img: "https://res.cloudinary.com/dbnra16ca/image/upload/v1757226918/pexels-pixabay-4158_xkfapw.jpg",
      title: "Hệ sinh thái Apple",
      subtitle: "Tận hưởng công nghệ",
    },
    {
      img: "https://res.cloudinary.com/dbnra16ca/image/upload/v1757226917/pexels-bertellifotografia-799443_yemfst.jpg",
      title: "Ngắm nhìn thiên nhiên",
      subtitle: "Camera siêu nét",
    },
    {
      img: "https://res.cloudinary.com/dbnra16ca/image/upload/v1757226916/pexels-jessbaileydesign-788946_dxyrul.jpg",
      title: "Siêu phẩm mới",
      subtitle: "Hàng chính hãng giá tốt",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <div>
      {/* Carousel Banner */}
      <section className="carousel-container my-4">
        <div className="carousel-slides">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`carousel-item ${idx === currentSlide ? "active" : ""}`}
              style={{ backgroundImage: `url(${slide.img})` }}
            >
              <div className="carousel-caption text-slide">
                <h1 className="display-5 fw-bold text-white">{slide.title}</h1>
                <p className="lead text-white">{slide.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button className="carousel-control prev" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="carousel-control next" onClick={nextSlide}>
          &#10095;
        </button>

        {/* Carousel Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`indicator ${idx === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(idx)}
            ></span>
          ))}
        </div>
      </section>

      {/* Product List */}
      <main className="container my-5">
        <div className="row g-4">
          {products.map((p) => (
            <div key={p.id} className="col-6 col-md-3">
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* Pagination */}
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

      {[...Array(pages)].map((_, idx) => (
        <li key={idx} className="page-item">
          <button
            className={`btn btn-sm ${page === idx + 1 ? "btn-warning" : "btn-outline-warning"} me-2`}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </button>
        </li>
      ))}

      <li className={`page-item ${page === pages ? "disabled" : ""}`}>
        <button
          className={`btn btn-sm ${page === pages ? "btn-secondary" : "btn-warning"}`}
          onClick={() => setPage(page + 1)}
        >
          Sau
        </button>
      </li>
    </ul>
  </nav>
</div>

      </main>
    </div>
  );
}

export default Home;
