import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Search() {
  const query = useQuery();
  const keyword = query.get("q") || "";
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (keyword.trim() === "") return;

      try {
        const res = await axios.get(`http://localhost:5000/products/search?q=${keyword}`);
        setResults(res.data);
      } catch (err) {
        console.error("Lỗi khi tìm kiếm:", err);
      }
    };

    fetchResults();
  }, [keyword]);

  return (
    <div className="container mt-4">
      <h3>Kết quả tìm kiếm cho: "{keyword}"</h3>
      <div className="row mt-3">
        {results.length === 0 ? (
          <p>Không tìm thấy sản phẩm nào.</p>
        ) : (
          results.map((product) => (
            <div className="col-md-4" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Search;
