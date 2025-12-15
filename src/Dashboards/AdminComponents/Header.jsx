import React, { useState, useRef, useEffect } from "react";
import {
    Bell,
    ChevronDown,
    Search,
    LogOut,
    User,
    Settings,
    X,
    CheckCheck,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../Store/slices/authSlice.js";
import axios from "axios";

function Header() {
    const { user, role } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
        useState(false);
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsUserDropdownOpen(false);
            }
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setIsNotificationDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/orders/getAllOrderNotification",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const orders = response.data.orders || [];
            setNotifications(orders);
            const unread = orders.filter((n) => !n.read).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [token]);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/");
        setIsUserDropdownOpen(false);
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const toggleNotificationDropdown = () => {
        setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    };

    const markAsRead = async (orderId) => {
        try {
            setNotifications((prev) =>
                prev.map((n) => (n.id === orderId ? { ...n, read: true } : n)),
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));

            await axios.patch(
                `http://127.0.0.1:8000/api/orders/${orderId}/mark-read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
            setNotifications((prev) =>
                prev.map((n) => (n.id === orderId ? { ...n, read: false } : n)),
            );
            setUnreadCount((prev) => prev + 1);
        }
    };

    const markAllAsRead = async () => {
        try {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            setUnreadCount(0);

            await axios.patch(
                "http://127.0.0.1:8000/api/orders/mark-all-read",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            setIsNotificationDropdownOpen(false);
            setNotifications([]);
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    const getNotificationIcon = (status) => {
        const icons = {
            pending: "⏳",
            contacted: "💬",
            processing: "🔄",
            shipped: "🚚",
            completed: "✅",
            cancelled: "❌",
            default: "🛒",
        };
        return icons[status] || icons.default;
    };

    const getNotificationMessage = (order) => {
        const messages = {
            pending: `New order #${order.order_code} received`,
            contacted: `Order #${order.order_code} has been contacted`,
            processing: `Order #${order.order_code} is being processed`,
            shipped: `Order #${order.order_code} has been shipped`,
            completed: `Order #${order.order_code} has been completed`,
            cancelled: `Order #${order.order_code} has been cancelled`,
        };
        return messages[order.status] || `Order #${order.order_code} updated`;
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: "text-yellow-600 bg-yellow-50",
            contacted: "text-blue-600 bg-blue-50",
            processing: "text-purple-600 bg-purple-50",
            shipped: "text-orange-600 bg-orange-50",
            completed: "text-green-600 bg-green-50",
            cancelled: "text-red-600 bg-red-50",
        };
        return colors[status] || "text-gray-600 bg-gray-50";
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-64 right-0 z-50">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1 max-w-2xl">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Search products, orders, users..."
                                className="w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 ml-6">
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={toggleNotificationDropdown}
                                className={`relative p-2 rounded-lg transition-all duration-200 ${
                                    isNotificationDropdownOpen
                                        ? "bg-green-50 text-green-600"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-white font-medium">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </button>

                            {isNotificationDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Notifications
                                                </h3>
                                                {unreadCount > 0 && (
                                                    <p className="text-sm text-gray-600">
                                                        {unreadCount} unread{" "}
                                                        {unreadCount === 1
                                                            ? "message"
                                                            : "messages"}
                                                    </p>
                                                )}
                                            </div>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                                >
                                                    <CheckCheck size={14} />
                                                    <span>Mark all read</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                                                <Bell
                                                    size={48}
                                                    className="text-gray-300 mb-3"
                                                />
                                                <p className="text-gray-500 font-medium">
                                                    No notifications
                                                </p>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    You're all caught up!
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-gray-100">
                                                {notifications.map(
                                                    (notification) => (
                                                        <div
                                                            key={
                                                                notification.id
                                                            }
                                                            className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                                                                !notification.read
                                                                    ? "bg-blue-50 hover:bg-blue-100"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <div className="flex items-start space-x-3">
                                                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                                    {getNotificationIcon(
                                                                        notification.status,
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {getNotificationMessage(
                                                                            notification,
                                                                        )}
                                                                    </p>
                                                                    <div className="flex items-center space-x-2 mt-1">
                                                                        <span
                                                                            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(notification.status)}`}
                                                                        >
                                                                            {
                                                                                notification.status
                                                                            }
                                                                        </span>
                                                                        <span className="text-xs text-gray-500">
                                                                            {formatTime(
                                                                                notification.created_at,
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs font-medium text-green-600 mt-1">
                                                                        Rs:
                                                                        {parseFloat(
                                                                            notification.total_amount,
                                                                        ).toFixed(
                                                                            2,
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center space-x-1">
                                                                    {!notification.read && (
                                                                        <button
                                                                            onClick={() =>
                                                                                markAsRead(
                                                                                    notification.id,
                                                                                )
                                                                            }
                                                                            className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                                                                            title="Mark as read"
                                                                        >
                                                                            <CheckCheck
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {notifications.length > 0 && (
                                        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                                            <button
                                                onClick={() => {
                                                    navigate("/admin/orders");
                                                    setIsNotificationDropdownOpen(
                                                        false,
                                                    );
                                                }}
                                                className="w-full text-center text-sm font-medium text-green-600 hover:text-green-700 py-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
                                            >
                                                View all orders
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleUserDropdown}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.name}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {user?.role}
                                    </p>
                                </div>
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-medium">
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={`text-gray-400 transition-transform duration-200 ${
                                        isUserDropdownOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                            {isUserDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user?.name}
                                        </p>
                                        <p className="text-sm text-gray-500 capitalize">
                                            {user?.role}
                                        </p>
                                    </div>
                                    {(role === "admin" ||
                                        role === "super_admin") && (
                                        <Link
                                            to={"/"}
                                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            onClick={() =>
                                                setIsUserDropdownOpen(false)
                                            }
                                        >
                                            <User
                                                size={16}
                                                className="mr-3 text-gray-400"
                                            />
                                            User Dashboard
                                        </Link>
                                    )}
                                    {(role !== "admin" || role === "super_admin") && (
                                        <Link
                                            to={"/admin"}
                                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            onClick={() => setIsUserDropdownOpen(false)}
                                        >
                                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    {(role !== "admin" || role === "super_admin") && (
                                        <Link
                                            to={"/super-admin"}
                                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            onClick={() => setIsUserDropdownOpen(false)}
                                        >
                                            <svg className="w-4 h-4 mr-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 14l1.5 1.5L9 12m10-1l-1.5 1.5L15 12" />
                                            </svg>
                                            SuperAdmin Dashboard
                                        </Link>
                                    )}
                                    {role !== "admin" &&
                                        role !== "super_admin" && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        navigate("/profile");
                                                        setIsUserDropdownOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    <User
                                                        size={16}
                                                        className="mr-3 text-gray-400"
                                                    />
                                                    Your Profile
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate(
                                                            "/admin/settings",
                                                        );
                                                        setIsUserDropdownOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    <Settings
                                                        size={16}
                                                        className="mr-3 text-gray-400"
                                                    />
                                                    Settings
                                                </button>
                                            </>
                                        )}
                                    <div className="border-t border-gray-100 mt-2 pt-2">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                        >
                                            <LogOut
                                                size={16}
                                                className="mr-3"
                                            />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
