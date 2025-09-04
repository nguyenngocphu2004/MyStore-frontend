import { BrowserRouter, useLocation } from "react-router-dom";
import Header from "./components/Header";
import AppRoutes from "./routes";
import Footer from "./components/Footer";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin"); // check nếu là trang admin

  return (
    <>
      {!isAdmin && <Header />}
      <AppRoutes />
      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
