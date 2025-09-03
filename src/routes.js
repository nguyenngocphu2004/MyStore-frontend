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
    </Routes>
  );
}

export default AppRoutes;
