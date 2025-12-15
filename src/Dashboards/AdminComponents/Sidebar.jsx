import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    BarChart3,
    Settings,
    FileText,
    Image,
    Upload,
    LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const navigationItems = [
        {
            name: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard,
            current: location.pathname === "/admin",
        },
        {
            name: "Products",
            href: "/admin/products",
            icon: Package,
            current: location.pathname.includes("/admin/products"),
        },
        {
            name: "Orders",
            href: "/admin/orders",
            icon: ShoppingCart,
            current: location.pathname.includes("/admin/orders"),
        },
        {
            name: "Users",
            href: "/admin/user-manage",
            icon: Users,
            current: location.pathname.includes("/admin/users"),
        },
        {
            name: "Branding",
            href: "/admin/branding",
            icon: Image,
            current: location.pathname.includes("/admin/branding"),
        },
        {
            name: "Reports",
            href: "/admin/reports",
            icon: BarChart3,
            current: location.pathname.includes("/admin/reports"),
        },
    ];

    return (
        <div className="w-64 h-screen bg-white shadow-xl flex flex-col fixed left-0 top-0">
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                            {user?.role}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <nav className="px-4 py-6 space-y-1">
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
            </div>

            <div className="px-4 py-4 border-t border-gray-200 flex-shrink-0">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                    <h3 className="text-sm font-semibold mb-2">Quick Upload</h3>
                    <p className="text-xs text-green-100 mb-3">
                        Upload product data via Excel files
                    </p>
                    <Link
                        to="/admin/products"
                        className="flex items-center justify-center w-full bg-white text-green-600 text-sm font-medium py-2 px-3 rounded-lg hover:bg-green-50 transition-colors duration-200"
                    >
                        <Upload size={16} className="mr-2" />
                        Upload Files
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
