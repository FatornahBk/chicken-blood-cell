import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Prediction from "./pages/Prediction";
import Profile from "./pages/Profile"; // ✅ เพิ่มตรงนี้

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/prediction" element={<ProtectedRoute><Prediction /></ProtectedRoute>} />
        {/* ✅ เพิ่ม route นี้ */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;