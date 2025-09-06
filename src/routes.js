import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Phone from "./pages/Phone";
import Laptop from "./pages/Laptop";
import Accessories from "./pages/Accessories";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Cart from './pages/Cart';
import GuestOrders from "./pages/GuestOrders";
import AdminLogin from "./pagesAdmin/AdminLogin";
import AdminLayout from "./pagesAdmin/AdminLayout";
import PrivateRoute from "./components/PrivateRoute";
import AdminUsers from "./pagesAdmin/AdminUsers";
import AdminProducts from "./pagesAdmin/AdminProducts";
import AdminRevenue from "./pagesAdmin/AdminRevenue";
import ProfitDashboard from "./pagesAdmin/ProfitDashboard";
import AdminBrands from "./pagesAdmin/AdminBrands";
import AdminCategories from "./pagesAdmin/AdminCategories";
import AdminOrders from "./pagesAdmin/AdminOrders";
import AdminOrderDetail from "./pagesAdmin/AdminOrderDetail";
import Dashboard from "./pagesAdmin/Dashboard";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/phones" element={<Phone />} />
      <Route path="/laptops" element={<Laptop />} />
      <Route path="/accessories" element={<Accessories />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/search" element={<Search />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/checkout/:productId" element={<Checkout />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/guest-orders" element={<GuestOrders />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={
        <PrivateRoute>
          <AdminLayout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="revenue" element={<AdminRevenue />} />
        <Route path="profit" element={<ProfitDashboard />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetail />} />
      </Route>


    </Routes>
  );
}

export default AppRoutes;
