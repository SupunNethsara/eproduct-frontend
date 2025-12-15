import React from "react";
import {
    LayoutDashboard,
    Users,
    Settings,
    Shield,
    BarChart3,
    UserPlus,
    UserCheck,
    Building,
    LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function SuperAdminSidebar() {
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const navigationItems = [
        {
            name: "Dashboard",
            href: "/super-admin",
            icon: LayoutDashboard,
            current: location.pathname === "/super-admin",
        },
        {
            name: "Admin Management",
            href: "/super-admin/adminManage",
            icon: UserPlus,
            current: location.pathname.includes("/super-admin/adminManage"),
        },
        {
            name: "System Users",
            href: "/super-admin/userManage",
            icon: Users,
            current: location.pathname.includes("/super-admin/userManage"),
        },
        {
            name: "System Settings",
            href: "/super-admin/settings",
            icon: Settings,
            current: location.pathname.includes("/super-admin/settings"),
        },
        {
            name: "System Reports",
            href: "/super-admin/reports",
            icon: BarChart3,
            current: location.pathname.includes("/super-admin/reports"),
        },
    ];

    return (
        <div className="w-64 h-screen bg-white shadow-xl flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.name}
                        </p>
                        <p className="text-xs text-green-600 font-medium capitalize">
                            Super Administrator
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`
                                flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                                ${
                                    item.current
                                        ? "bg-green-50 text-green-700 border border-green-200"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }
                            `}
                        >
                            <Icon size={20} className="mr-3" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-4 mt-4 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                    <h3 className="text-sm font-semibold mb-2">
                        System Controls
                    </h3>
                    <p className="text-xs text-green-100 mb-3">
                        Manage system-wide settings and access
                    </p>
                    <Link
                        to="/super-admin/userManage"
                        className="flex items-center justify-center w-full bg-white text-green-600 text-sm font-medium py-2 px-3 rounded-lg hover:bg-green-50 transition-colors duration-200"
                    >
                        <UserPlus size={16} className="mr-2" />
                        Manage Admins
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SuperAdminSidebar;
