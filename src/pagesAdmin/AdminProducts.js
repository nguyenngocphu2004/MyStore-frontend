import React, { useEffect, useState } from "react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "", price: "", brand: "", category_id: "",
    cpu: "", ram: "", storage: "", screen: "",
    battery: "", os: "", camera_front: "", camera_rear: "",
    weight: "", color: "", dimensions: "", release_date: "",
    graphics_card: "", ports: "", warranty: ""
  });
  const [images, setImages] = useState([]);
  const token = localStorage.getItem("adminToken");

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/products");
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
    }
  };

  // Lấy danh sách categories
  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5000/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImages(e.target.files);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Tạo sản phẩm
    const res = await fetch("http://localhost:5000/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      const err = await res.json();
      return alert(err.error);
    }

    const product = await res.json();

    // 2️⃣ Upload ảnh lên Cloudinary
    if (images.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < images.length; i++) formData.append("images", images[i]);

      const imgRes = await fetch(`http://localhost:5000/admin/products/${product.id}/images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!imgRes.ok) {
        const imgErr = await imgRes.json();
        alert(imgErr.error);
      }
    }

    alert("Thêm sản phẩm thành công!");
    setForm({
      name: "", price: "", brand: "", category_id: "",
      cpu: "", ram: "", storage: "", screen: "",
      battery: "", os: "", camera_front: "", camera_rear: "",
      weight: "", color: "", dimensions: "", release_date: "",
      graphics_card: "", ports: "", warranty: ""
    });
    setImages([]);
    fetchProducts();
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Thêm sản phẩm mới</h3>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-3"><input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="form-control" required /></div>
          <div className="col-md-2"><input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" className="form-control" required /></div>
          <div className="col-md-3"><input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="form-control" required /></div>
          <div className="col-md-4">
            <select name="category_id" value={form.category_id} onChange={handleChange} className="form-select" required>
              <option value="">Chọn danh mục</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <h5>Thông số kỹ thuật</h5>
        <div className="row mb-3">
          {["cpu","ram","storage","screen","battery","os","camera_front","camera_rear","weight","color","dimensions","release_date","graphics_card","ports","warranty"].map(f => (
            <div className="col-md-3 mb-2" key={f}>
              <input
                name={f}
                type={f==="release_date"?"date":"text"}
                value={form[f]}
                onChange={handleChange}
                placeholder={f.replace("_", " ").toUpperCase()}
                className="form-control"
              />
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label>Upload images</label>
          <input type="file" multiple onChange={handleFileChange} className="form-control" />
        </div>

        <button type="submit" className="btn btn-primary mb-4">Thêm sản phẩm</button>
      </form>

      <h3>Danh sách sản phẩm</h3>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th><th>Name</th><th>Price</th><th>Brand</th><th>Category</th><th>Images</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.brand}</td>
              <td>{p.category}</td>
              <td>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                    {p.images && p.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={p.name}
                        style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                      />
                    ))}
                  </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
