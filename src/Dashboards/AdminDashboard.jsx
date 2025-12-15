import Header from "./AdminComponents/Header.jsx";
import Statics from "./AdminRoutes/Statics.jsx";
import { Routes, Route } from "react-router-dom";
import Products from "./AdminRoutes/Products.jsx";
import Orders from "./AdminRoutes/Orders.jsx";
import UserManage from "./AdminRoutes/UserManage.jsx";
import Reports from "./Common/Reports/Reports.jsx";
import Branding from "./AdminRoutes/Branding.jsx";

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
                <Route index element={<Statics />} />
                <Route path="/statics" element={<Statics />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/branding" element={<Branding />} />
                <Route path="/user-manage" element={<UserManage />} />
                <Route path="reports" element={<Reports />} />
            </Routes>
        </div>
    );
};

export default AdminDashboard;
