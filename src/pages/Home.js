import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi khi fetch products:", err));
  }, []);

  const slides = [
    {
      img: "https://res.cloudinary.com/dbnra16ca/image/upload/v1757226918/pexels-pixabay-4158_xkfapw.jpg",
      title: "Hệ sinh thái  Apple",
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

  // Auto slide every 3s
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
      {/* Banner carousel */}
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

        {/* Controls */}
        <button className="carousel-control prev" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="carousel-control next" onClick={nextSlide}>
          &#10095;
        </button>

        {/* Indicators */}
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
