import { Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import Auth from "./pages/auth";
import Signup from "./pages/auth/signup";
import Login from "./pages/auth/login";
import Verify from "./pages/auth/verify";
import ForgetPassword from "./pages/auth/forget_password";
import ResetPassword from "./pages/auth/reset_password";
import Home from "./pages/home";
import UserProfile from "./pages/userProfile";
import Profile from "./pages/profile/profile";
import EditProfile from "./pages/profile/edit_profile";
import ProtectedRoute from "./components/common/protectedRoutes";
import SettingsPage from "./components/common/settings";

function App() {
  return (
    <div className="font-roboto">
      <Toaster />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />}>
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="verify" element={<Verify />} />
            <Route path="forget-password" element={<ForgetPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
          <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          >
            <Route path=":id" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="edit-profile/:id" element={
                <ProtectedRoute allowedRoles={["celebrity", "public"]}>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
