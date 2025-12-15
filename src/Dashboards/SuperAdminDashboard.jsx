import Header from "./AdminComponents/Header.jsx";
import { Routes, Route } from "react-router-dom";
import SaStatics from "./SuperAdminRoutes/SaStatics.jsx";
import AdminManagement from "./SuperAdminRoutes/AdminManagement.jsx";
import UserManage from "./SuperAdminRoutes/UserManage.jsx";
import SystemSettings from "./SuperAdminRoutes/SystemSettings.jsx";
import Reports from "./Common/Reports/Reports.jsx";

const SuperAdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
                <Route index element={<SaStatics />} />
                <Route path="sastatics" element={<SaStatics />} />
                <Route path="adminManage" element={<AdminManagement />} />
                <Route path="userManage" element={<UserManage />} />
                <Route path="settings" element={<SystemSettings />} />
                <Route path="reports" element={<Reports />} />
            </Routes>
        </div>
    );
};

export default SuperAdminDashboard;
