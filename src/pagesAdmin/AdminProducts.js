import React, { useEffect, useState } from "react";
import {BiTrash, BiEdit,BiDetail,BiSearch } from "react-icons/bi";
import { toast } from "react-toastify";
export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filterCategoryInput, setFilterCategoryInput] = useState("");
  const [filterBrandInput, setFilterBrandInput] = useState("");
  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    brand_id: "",
    category_id: "",
    cost_price: "",
    stock: "",
    cpu: "",
    ram: "",
    storage: "",
    screen: "",
    battery: "",
    os: "",
    camera_front: "",
    camera_rear: "",
    weight: "",
    color: "",
    dimensions: "",
    release_date: "",
    graphics_card: "",
    ports: "",
    warranty: "",
  });
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState("list"); // list | add | edit
  const token = localStorage.getItem("adminToken");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalTitle, setModalTitle] = useState("");

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBrand, setFilterBrand] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 8;

  // Fetch products
  const fetchProducts = async (pageNumber = 1) => {
    const params = new URLSearchParams({
      page: pageNumber,
      per_page: perPage,
      search,
      category: filterCategory,
      brand: filterBrand,
    });

    const res = await fetch(`http://localhost:5000/products?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products || []);
      setPage(data.page);
      setTotalPages(data.pages);
    }
  };

  const fetchBrands = async () => {
    const res = await fetch("http://localhost:5000/brandss");
    if (res.ok) {
      const data = await res.json();
      setBrands(data);
    }
  };

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5000/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page, search, filterCategory, filterBrand]);
  useEffect(() => {
  fetchBrands();
  fetchCategories();
  }, []);

  // Handle form change
  const handleChange = (e) => {
  const { name, value } = e.target;

  // Các trường chỉ cho phép giá trị >= 0
  const numericFields = ["price", "cost_price", "stock"];
  if (numericFields.includes(name) && value < 0) {
    const fieldName =
      name === "price"
        ? "Giá"
        : name === "cost_price"
        ? "Giá nhập"
        : "Số lượng";

    toast.error(`${fieldName} phải lớn hơn 0!`);
    return;
  }

  setForm({ ...form, [name]: value });
};
  const handleFileChange = (e) => setImages(e.target.files);

  // Add / Edit product
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = form.id
      ? `http://localhost:5000/admin/products/${form.id}`
      : "http://localhost:5000/admin/products";
    const method = form.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const err = await res.json();
      return alert(err.error);
    }

    const product = await res.json();

    // Upload images
    if (images.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < images.length; i++) formData.append("images", images[i]);
      const imgRes = await fetch(
        `http://localhost:5000/admin/products/${product.id}/images`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!imgRes.ok) {
        const imgErr = await imgRes.json();
        alert(imgErr.error);
      }
    }

    alert(form.id ? "Cập nhật sản phẩm thành công!" : "Thêm sản phẩm thành công!");
    setForm({
      id: null,
      name: "",
      price: "",
      brand_id: "",
      category_id: "",
      cost_price: "",
      stock: "",
      cpu: "",
      ram: "",
      storage: "",
      screen: "",
      battery: "",
      os: "",
      camera_front: "",
      camera_rear: "",
      weight: "",
      color: "",
      dimensions: "",
      release_date: "",
      graphics_card: "",
      ports: "",
      warranty: "",
    });
    setImages([]);
    setActiveTab("list");
    fetchProducts(page);
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    const res = await fetch(`http://localhost:5000/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json();
      return alert(err.error);
    }
    alert("Xóa sản phẩm thành công!");
    fetchProducts(page);
  };

  // Edit product
  const handleEdit = (p) => {
    setForm({
      id: p.id,
      name: p.name,
      price: p.price,
      cost_price: p.cost_price,
      stock: p.stock,
      brand_id: p.brand_id,
      category_id: p.category_id,
      cpu: p.cpu,
      ram: p.ram,
      storage: p.storage,
      screen: p.screen,
      battery: p.battery,
      os: p.os,
      camera_front: p.camera_front,
      camera_rear: p.camera_rear,
      weight: p.weight,
      color: p.color,
      dimensions: p.dimensions,
      release_date: p.release_date,
      graphics_card: p.graphics_card,
      ports: p.ports,
      warranty: p.warranty,
    });
    setActiveTab("edit");
  };

  // Modal
  const openModal = (title, imgs) => {
    setModalTitle(title);
    setModalImages(imgs);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const openDetail = (p) => {
    setDetailProduct(p);
    setDetailOpen(true);
  };
  const closeDetail = () => setDetailOpen(false);

  // Render form
  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="row mb-3">
        <div className="col-md-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Tên sản phẩm"
            className="form-control"
            required
          />
        </div>
        <div className="col-md-2">
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Giá"
            className="form-control"
            required
            min="1"
            step="10000"
          />
        </div>
        <div className="col-md-3">
          <select
            name="brand_id"
            value={form.brand_id}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Chọn thương hiệu</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <input
            name="cost_price"
            type="number"
            value={form.cost_price}
            onChange={handleChange}
            placeholder="Giá nhập"
            className="form-control"
            required
          />
        </div>
        <div className="col-md-2">
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Số lượng"
            className="form-control"
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Danh mục</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h5>Thông số kỹ thuật</h5>
      <div className="row mb-3">
        {[
          "CPU","RAM","Bộ nhớ","Màn hình","Pin","Hệ điều hành","Camera trước","Camera sau",
          "Trọng lượng","Màu sắc","Kích thước","Ngày phát hành","Thẻ đồ họa","Cổng","Bảo hành"
        ].map((f) => (
          <div className="col-md-3 mb-2" key={f}>
            <input
              name={f}
              type={f === "release_date" ? "date" : "text"}
              value={form[f] || ""}
              onChange={handleChange}
              placeholder={f.replace("_", " ")}
              className="form-control"
            />
          </div>
        ))}
      </div>

      <div className="mb-3">
        <label>Tải hình ảnh</label>
        <input type="file" multiple onChange={handleFileChange} className="form-control" />
      </div>

      <button type="submit" className="btn btn-primary mb-4">
        {form.id ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
      </button>
    </form>
  );

  return (
    <div className="container mt-5">
      <div className="mb-3">
        <button
          className={`btn me-2 ${activeTab === "list" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveTab("list")}
        >
          Danh sách sản phẩm
        </button>
        <button
          className={`btn me-2 ${activeTab === "add" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => {
            setActiveTab("add");
            setForm({
              id: null,
              name: "",
              price: "",
              brand_id: "",
              category_id: "",
              cost_price: "",
              stock: "",
              cpu: "",
              ram: "",
              storage: "",
              screen: "",
              battery: "",
              os: "",
              camera_front: "",
              camera_rear: "",
              weight: "",
              color: "",
              dimensions: "",
              release_date: "",
              graphics_card: "",
              ports: "",
              warranty: "",
            });
          }}
        >
          Thêm sản phẩm
        </button>
      </div>

      {activeTab === "list" && (
        <>
          <h3>Danh sách sản phẩm</h3>
          {/* Search + Filter */}
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm sản phẩm..."
                value={searchInput}
                onChange={(e) => {
  setSearchInput(e.target.value);
  setPage(1);
}}
onKeyDown={(e) => {
    if (e.key === "Enter") {
      setSearch(searchInput);
      setFilterCategory(filterCategoryInput);
      setFilterBrand(filterBrandInput);
      fetchProducts(1);
    }
  }}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterCategoryInput}
                onChange={(e) => {
  setFilterCategoryInput(e.target.value);
  setPage(1); // thêm dòng này
}}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterBrandInput}
                onChange={(e) => setFilterBrandInput(e.target.value)}
              >
                <option value="">Tất cả thương hiệu</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-primary w-40"
                onClick={() => {
                  setSearch(searchInput);
                  setFilterCategory(filterCategoryInput);
                  setFilterBrand(filterBrandInput);
                  fetchProducts(1);
                }}
              >
                <BiSearch/>
              </button>
            </div>
          </div>
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Tên sản phẩm</th>
                <th>Giá </th>
                <th>Thương hiệu</th>
                <th>Danh mục</th>
                <th>Hình ảnh</th>
                <th>Phương thức</th>
              </tr>
            </thead>
            <tbody>
  {products.length > 0 ? (
    products.map((p) => (
      <tr key={p.id}>
        <td>{p.id}</td>
        <td>{p.name}</td>
        <td>{Number(p.price).toLocaleString("vi-VN")} đ</td>
        <td>{p.brand}</td>
        <td>{p.category}</td>
        <td>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {p.images && p.images.length > 0 && (
              <>
                <img
                  src={p.images[0]}
                  alt={p.name}
                  style={{
                    width: "80px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
                {p.images.length > 1 && (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => openModal(p.name, p.images)}
                  >
                    Xem tất cả ({p.images.length})
                  </button>
                )}
              </>
            )}
          </div>
        </td>
        <td>
          <button
            className="btn btn-sm btn-info me-2"
            onClick={() => openDetail(p)}
          >
            <BiDetail />
          </button>
          <button
            className="btn btn-sm btn-warning me-2"
            onClick={() => handleEdit(p)}
          >
            <BiEdit />
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(p.id)}
          >
            <BiTrash />
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="text-center text-muted">
        Không tìm thấy sản phẩm nào.
      </td>
    </tr>
  )}
</tbody>
          </table>

          {/* Pagination */}
          {/* Pagination */}
<div className="d-flex justify-content-center mt-4">
  <button
    className="btn btn-sm btn-outline-secondary me-2"
    onClick={() => setPage(page - 1)}
    disabled={page === 1}
  >
    Trước
  </button>

  {Array.from({ length: totalPages }, (_, i) => {
    const pageNumber = i + 1;
    return (
      <button
        key={pageNumber}
        className={`btn btn-sm me-2 ${page === pageNumber ? "btn-dark" : "btn-outline-secondary"}`}
        onClick={() => setPage(pageNumber)}
      >
        {pageNumber}
      </button>
    );
  })}

  <button
    className="btn btn-sm btn-outline-secondary me-2"
    onClick={() => setPage(page + 1)}
    disabled={page === totalPages}
  >
    Sau
  </button>
</div>

        </>
      )}

      {activeTab === "add" && (
        <>
          <h3>Thêm sản phẩm mới</h3>
          {renderForm()}
        </>
      )}

      {activeTab === "edit" && (
        <>
          <h3>Chỉnh sửa sản phẩm</h3>
          {renderForm()}
        </>
      )}

      {/* Modal images */}
      {modalOpen && (
        <div
          className="modal-backdrop"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
          onClick={closeModal}
        >
          <div
            className="modal-content"
            style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", maxWidth: "80%", maxHeight: "80%", overflowY: "auto", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5>{modalTitle} - Tất cả ảnh</h5>
            <button onClick={closeModal} style={{ position: "absolute", top: "10px", right: "10px", border: "none", background: "transparent", fontSize: "20px", cursor: "pointer" }}>×</button>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
              {modalImages.map((img, idx) => (
                <img key={idx} src={img} alt={`${modalTitle}-${idx}`} style={{ width: "150px", height: "100px", objectFit: "cover", borderRadius: "4px", transition: "transform 0.3s ease", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal detail */}
      {detailOpen && detailProduct && (
        <div className="modal-backdrop" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 }} onClick={closeDetail}>
          <div className="modal-content" style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", maxWidth: "700px", maxHeight: "80%", overflowY: "auto", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <h5>Chi tiết sản phẩm - {detailProduct.name}</h5>
            <button onClick={closeDetail} style={{ position: "absolute", top: "10px", right: "10px", border: "none", background: "transparent", fontSize: "20px", cursor: "pointer" }}>×</button>
            <table className="table table-bordered mt-3">
              <tbody>
                {Object.entries(detailProduct).map(([key, value]) => {
                  if (key === "images") return null;
                  const fieldLabels = {
                      id: "Mã sản phẩm",
                      name: "Tên sản phẩm",
                      camera_front: "Camera trước",
                      camera_rear: "Camera sau",
                      color: "Màu sắc",
                      cpu: "CPU",
                      dimensions: "Kích thước",
                      graphics_card: "Card đồ họa",
                      os: "Hệ điều hành",
                      ports: "Cổng sạc",
                      ram: "RAM",
                      release_date : "Ngày sản xuất",
                      screen:"Màn hình",
                      sold: "Đã bán",
                      storage: "Bộ nhớ",
                      warranty: "Bảo hành",
                      weight: "Khối lượng",
                      price: "Giá bán",
                      cost_price: "Giá nhập",
                      stock: "Số lượng tồn",
                      category: "Danh mục",
                      brand: "Thương hiệu",
                      battery: "Pin"
                  };
                  return (
                    <tr key={key}>
                      <th style={{ width: "30%" }}>{fieldLabels[key] || key}</th>
                      <td>{value || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
