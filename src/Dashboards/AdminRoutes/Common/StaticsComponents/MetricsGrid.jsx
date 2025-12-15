import React, { useState, useEffect } from "react";
import axios from "axios";

function MetricsGrid() {
    const [data, setData] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCategories: 0,
        pendingOrders: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "http://127.0.0.1:8000/api/admin/statistics",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            setData(response.data);
        } catch (error) {
            console.error(
                "Error fetching statistics:",
                error.response?.data || error.message,
            );
            setError(
                error.response?.data?.message || "Failed to load statistics",
            );
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const calculateAdditionalMetrics = () => {
        const completedOrders = data.totalOrders - data.pendingOrders;
        const completionRate =
            data.totalOrders > 0
                ? ((completedOrders / data.totalOrders) * 100).toFixed(0)
                : 0;

        return {
            completionRate,
            completedOrders,
        };
    };

    const additionalMetrics = calculateAdditionalMetrics();

    const metrics = [
        {
            title: "Total Orders",
            value: data.totalOrders,
            change: `${data.pendingOrders} pending • ${additionalMetrics.completedOrders} completed`,
            changeColor: "text-emerald-700",
            icon: (
                <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                </svg>
            ),
            bgColor: "bg-emerald-100",
        },
        {
            title: "Total Revenue",
            value: formatCurrency(data.totalRevenue || 0),
            change: "Based on completed orders",
            changeColor: "text-amber-600",
            icon: (
                <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                </svg>
            ),
            bgColor: "bg-emerald-100",
        },
        {
            title: "Total Products",
            value: data.totalProducts,
            change: `${data.totalCategories} categories`,
            changeColor: "text-emerald-700",
            icon: (
                <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                </svg>
            ),
            bgColor: "bg-emerald-100",
        },
        {
            title: "Registered Users",
            value: data.totalUsers,
            change: `${additionalMetrics.completionRate}% order completion rate`,
            changeColor: "text-emerald-600",
            icon: (
                <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                </svg>
            ),
            bgColor: "bg-emerald-100",
        },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200 animate-pulse"
                    >
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="h-4 bg-emerald-200 rounded w-24"></div>
                                <div className="h-8 bg-emerald-200 rounded w-16"></div>
                                <div className="h-3 bg-emerald-200 rounded w-32"></div>
                            </div>
                            <div className="w-12 h-12 bg-emerald-200 rounded-lg"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-red-600 font-medium">
                            Failed to load statistics
                        </p>
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                    </div>
                    <button
                        onClick={fetchStatistics}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-emerald-700">
                                {metric.title}
                            </p>
                            <p className="text-2xl font-bold text-emerald-900 mt-1">
                                {metric.value}
                            </p>
                            <p className={`text-xs ${metric.changeColor} mt-1`}>
                                {metric.change}
                            </p>
                        </div>
                        <div
                            className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}
                        >
                            {metric.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MetricsGrid;
