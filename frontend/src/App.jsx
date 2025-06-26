import { Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import Auth from "./pages/auth";
import Signup from "./pages/auth/signup";
import Login from "./pages/auth/login";
import Verify from "./pages/auth/verify";
import ForgetPassword from "./pages/auth/forget_password";
import ResetPassword from "./pages/auth/reset_password";
import Home from "./pages/home";
import Profile from "./pages/profile";

function App() {
  return (
    <div className="font-roboto">
      <Toaster />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/auth" element={<Auth />}>
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="verify" element={<Verify />} />
            <Route path="forget-password" element={<ForgetPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
