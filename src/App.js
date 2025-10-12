import { BrowserRouter, useLocation } from "react-router-dom";
import Header from "./components/Header";
import AppRoutes from "./routes";
import Footer from "./components/Footer";
import "./App.css";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Chatbot from "./components/Chatbot";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin"); // check nếu là trang admin

  return (
    <>
      {!isAdmin && <Header />}
      <AppRoutes />
      {!isAdmin && <Footer />}
      {!isAdmin && <Chatbot />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <ScrollToTopButton />

    </BrowserRouter>
  );
}

export default App;
