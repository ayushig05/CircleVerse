import { Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import Navbar from "./pages/navbar";
import Footer from "./pages/footer";
import Home from "./pages/home";
import Product from "./pages/product/product";
import ProductDetails from "./pages/product/product_details";
import Auth from "./pages/auth";
import Signup from "./pages/auth/signup";
import Login from "./pages/auth/login";
import Verify from "./pages/auth/verify";
import ForgetPassword from "./pages/auth/forget_password";
import ResetPassword from "./pages/auth/reset_password";

function App() {
  return (
    <div className="font-roboto">
      <Toaster />
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />}>
            <Route path=":id" element={<ProductDetails />} />
          </Route>
          <Route path="/auth" element={<Auth />}>
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="verify" element={<Verify />} />
            <Route path="forget-password" element={<ForgetPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
