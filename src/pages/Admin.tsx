
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkLoginStatus = () => {
      const adminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
      setIsLoggedIn(adminLoggedIn);
      
      // Redirect if logged in but on the login page
      if (adminLoggedIn && window.location.pathname === "/admin") {
        navigate("/admin/dashboard");
      }
    };
    
    checkLoginStatus();
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container py-8 flex-1">
        <Routes>
          <Route path="/" element={
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">Admin Access</h2>
              <AdminLogin />
            </div>
          } />
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
      
      <footer className="bg-muted py-4">
        <div className="container text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} iPhone Resale Admin Panel</p>
        </div>
      </footer>
    </div>
  );
}
