import React, { useEffect, useState } from "react";
import axios from "axios";

function RecentActivity() {
    const [recentOrders, setRecentOrders] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            completed:
                "bg-emerald-100 text-emerald-800 border border-emerald-200",
            pending: "bg-amber-100 text-amber-800 border border-amber-200",
            processing: "bg-blue-100 text-blue-800 border border-blue-200",
            cancelled: "bg-red-100 text-red-800 border border-red-200",
        };

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusColors[status] || "bg-gray-100 text-gray-800"
                }`}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const ordersResponse = await axios.get(
                    "http://127.0.0.1:8000/api/admin/recentOrders",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );

                const ordersData = ordersResponse.data;
                setRecentOrders(ordersData.recent_orders || []);

                const usersResponse = await axios.get(
                    "http://127.0.0.1:8000/api/admin/recentUsers",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                setRecentUsers(usersResponse.data.recentUsers || []);
            } catch (error) {
                console.error("Error fetching recent activity:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <p className="text-center text-emerald-700">
                Loading recent activity...
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-emerald-900">
                        Recent Orders
                    </h3>
                    <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                        View All →
                    </button>
                </div>
                <div className="space-y-4">
                    {recentOrders.length > 0 ? (
                        recentOrders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between p-3 border border-emerald-100 rounded-lg hover:bg-emerald-50 transition-colors"
                            >
                                <div>
                                    <p className="font-medium text-emerald-900">
                                        {order.order_code}
                                    </p>
                                    <p className="text-sm text-emerald-600">
                                        {order.customer_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {order.items_count} item
                                        {order.items_count !== 1 ? "s" : ""}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-emerald-900">
                                        {formatCurrency(order.total_amount)}
                                    </p>
                                    <div className="mt-1">
                                        {getStatusBadge(order.status)}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {order.formatted_date}{" "}
                                        {order.formatted_time}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">
                            No recent orders.
                        </p>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-emerald-900">
                        Recent Users
                    </h3>
                    <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                        View All →
                    </button>
                </div>
                <div className="space-y-4">
                    {recentUsers.length > 0 ? (
                        recentUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-3 border border-emerald-100 rounded-lg hover:bg-emerald-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-medium text-emerald-700">
                                            {user.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-emerald-900">
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-emerald-600">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm text-emerald-600">
                                    {formatDate(user.date)}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">
                            No recent users.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RecentActivity;
