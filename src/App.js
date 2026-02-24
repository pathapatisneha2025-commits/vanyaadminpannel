import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import VanyaLayout from "./component/VanyaLayout";
import AdminProductManager from "./Pages/ProductInventory";
import AdminOrders from "./Pages/AdminOrders";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminContactPage from "./Pages/AdminContactPage";
import AddCouponForm from "./Pages/AdminCoupons";
import AdminLoginPage from "./Pages/AdminLoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="login" element={<AdminLoginPage />} />

        {/* Admin layout */}
        <Route path="/admin" element={<VanyaLayout />}>
          
          {/* Default dashboard */}
          <Route index element={<div>Dashboard Page</div>} />

          {/* Products page */}

          <Route path="products" element={<AdminProductManager />} />
           <Route path="orders" element={<AdminOrders />} />
            <Route path="dashboard" element={<AdminDashboard/>} />
             <Route path="contact" element={<AdminContactPage/>} />
           <Route path="coupons" element={<AddCouponForm/>} />





        </Route>

        {/* 404 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}