import React from "react";
import SuperAdminSidebar from "../Dashboards/SuperAdminComponents/SuperAdminSidebar.jsx";
import Header from "../Dashboards/AdminComponents/Header.jsx";

function SuperAdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="fixed left-0 top-0 h-screen z-30">
                <SuperAdminSidebar />
            </div>

            <div className="flex-1 ml-64 p-4">
                <Header />
                <div className="pt-12 mt-8">
                    <div className="">{children}</div>
                </div>
            </div>
        </div>
    );
}

export default SuperAdminLayout;
