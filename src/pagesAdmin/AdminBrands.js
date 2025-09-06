import React, { useEffect, useState } from "react";

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ id: null, name: "" });
  const [activeTab, setActiveTab] = useState("list");
  const token = localStorage.getItem("adminToken");

  const fetchBrands = async () => {
    const res = await fetch("http://localhost:5000/brands");
    if (res.ok) {
      const data = await res.json();
      setBrands(data);
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = form.id
      ? `http://localhost:5000/admin/brands/${form.id}`
      : "http://localhost:5000/admin/brands";
    const method = form.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
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

    alert(form.id ? "Cập nhật brand thành công!" : "Thêm brand thành công!");
    setForm({ id: null, name: "" });
    setActiveTab("list");
    fetchBrands();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa brand này?")) return;
    const res = await fetch(`http://localhost:5000/admin/brands/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) { const err = await res.json(); return alert(err.error); }
    alert("Xóa brand thành công!");
    fetchBrands();
  };

  return (
    <div className="container mt-5">
      <div className="mb-3">
        <button className={`btn me-2 ${activeTab==="list"?"btn-primary":"btn-outline-primary"}`}
          onClick={() => setActiveTab("list")}>Danh sách thương hiệu</button>
        <button className={`btn me-2 ${activeTab==="add"?"btn-primary":"btn-outline-primary"}`}
          onClick={() => { setActiveTab("add"); setForm({id:null,name:""}); }}>Thêm thương hiệu</button>
      </div>

      {activeTab==="list" && (
        <>
          <h3>Danh sách thương hiệu</h3>
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr><th>ID</th><th>Tên thương hiệu</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {brands.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.name}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2"
                      onClick={() => { setForm(b); setActiveTab("edit"); }}>Sửa</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b.id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {(activeTab==="add" || activeTab==="edit") && (
        <>
          <h3>{form.id ? "Chỉnh sửa" : "Thêm"} brand</h3>
          <form onSubmit={handleSubmit}>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="Tên brand" className="form-control mb-3" required />
            <button type="submit" className="btn btn-primary">
              {form.id ? "Cập nhật" : "Thêm mới"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
