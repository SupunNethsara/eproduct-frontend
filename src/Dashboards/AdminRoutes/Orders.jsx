import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import OrderViewModal from "./Common/OrderComponents/OrderViewModal.jsx";
import StatusUpdateModal from "./Common/OrderComponents/StatusUpdateModal.jsx";

export default function Orders() {
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: "",
    });
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewData, setViewData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const handleOrderData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/orders/getAllOrder",
                    { headers: { Authorization: `Bearer ${token}` } },
                );
                const normalizedOrders = (
                    response.data.orders ||
                    response.data[0] ||
                    []
                ).map((o) => ({
                    ...o,
                    status: o.status?.toLowerCase(),
                }));
                setOrders(normalizedOrders);
            } catch (e) {
                console.error("Error fetching orders:", e);
            } finally {
                setLoading(false);
            }
        };

        if (token) handleOrderData();
    }, []);

    const handleOrderView = async (orderCode) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/orders/getUserOrder",
                {
                    params: { order_code: orderCode },
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            setViewData(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error(
                "Error fetching order:",
                error.response?.data || error.message,
            );
        }
    };

    const handleStatusUpdate = (orderId, newStatus) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order,
            ),
        );
    };

    const handleEditStatus = (order) => {
        setSelectedOrder(order);
        setIsStatusModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setViewData(null);
    };

    const closeStatusModal = () => {
        setIsStatusModalOpen(false);
        setSelectedOrder(null);
    };

    const handleDateRangeChange = (field, value) => {
        setDateRange((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const clearDateRange = () => {
        setDateRange({
            startDate: "",
            endDate: "",
        });
    };

    const clearAllFilters = () => {
        setQuery("");
        setStatusFilter("all");
        clearDateRange();
        setShowDateFilter(false);
    };

    const isDateInRange = (dateString, startDate, endDate) => {
        if (!startDate && !endDate) return true;

        const orderDate = dayjs(dateString);
        const start = startDate ? dayjs(startDate) : null;
        const end = endDate ? dayjs(endDate) : null;

        if (start && end) {
            return (
                orderDate.isAfter(start.subtract(1, "day")) &&
                orderDate.isBefore(end.add(1, "day"))
            );
        } else if (start) {
            return orderDate.isAfter(start.subtract(1, "day"));
        } else if (end) {
            return orderDate.isBefore(end.add(1, "day"));
        }

        return true;
    };

    const filtered = orders.filter((o) => {
        const matchesQuery =
            o.id.toString().toLowerCase().includes(query.toLowerCase()) ||
            o.order_code?.toLowerCase().includes(query.toLowerCase()) ||
            o.user?.name?.toLowerCase().includes(query.toLowerCase()) ||
            o.user?.email?.toLowerCase().includes(query.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || o.status === statusFilter.toLowerCase();

        const matchesDateRange = isDateInRange(
            o.created_at,
            dateRange.startDate,
            dateRange.endDate,
        );

        return matchesQuery && matchesStatus && matchesDateRange;
    });

    const statusColor = (s) => {
        switch (s) {
            case "pending":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "contacted":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "completed":
                return "bg-green-50 text-green-700 border-green-200";
            case "cancelled":
                return "bg-red-50 text-red-700 border-red-200";
            case "processing":
                return "bg-indigo-50 text-indigo-700 border-indigo-200";
            case "shipped":
                return "bg-purple-50 text-purple-700 border-purple-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const statusIcon = (s) => {
        switch (s) {
            case "pending":
                return (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                );
            case "contacted":
                return (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                );
            case "completed":
                return (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                );
            case "cancelled":
                return (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                );
            case "processing":
                return (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                );
            case "shipped":
                return (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                        />
                    </svg>
                );
            default:
                return (
                    <svg
                        className="w-4 h-4"
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
                );
        }
    };

    const getTotalOrdersValue = () => {
        return orders.reduce(
            (total, order) => total + parseFloat(order.total_amount || 0),
            0,
        );
    };

    const getStatusCount = (status) => {
        return orders.filter((o) => o.status === status).length;
    };

    const getFilteredOrdersValue = () => {
        return filtered.reduce(
            (total, order) => total + parseFloat(order.total_amount || 0),
            0,
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Orders Management
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage and track customer orders
                            </p>
                        </div>
                        <div className="flex items-center gap-6 mt-4 lg:mt-0">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">
                                    Total Orders
                                </p>
                                <p className="text-xl font-semibold text-gray-900">
                                    {orders.length}
                                </p>
                            </div>
                            <div className="w-px h-8 bg-gray-300"></div>
                            <div className="text-center">
                                <p className="text-sm text-gray-500">
                                    Total Value
                                </p>
                                <p className="text-xl font-semibold text-green-600">
                                    Rs. {getTotalOrdersValue().toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                        { status: "pending", label: "Pending" },
                        { status: "processing", label: "Processing" },
                        { status: "shipped", label: "Shipped" },
                        { status: "completed", label: "Completed" },
                    ].map(({ status, label }) => (
                        <div
                            key={status}
                            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        {label}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {getStatusCount(status)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {Math.round(
                                            (getStatusCount(status) /
                                                orders.length) *
                                                100,
                                        ) || 0}
                                        % of total
                                    </p>
                                </div>
                                <div
                                    className={`p-3 rounded-lg ${statusColor(status).split(" ")[0]}`}
                                >
                                    {statusIcon(status)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                        <div className="flex-1 w-full relative">
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search orders by ID, code, customer name or email..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                            />
                        </div>

                        <div className="w-full lg:w-48">
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="contacted">Contacted</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="flex gap-2 w-full lg:w-auto">
                            <button
                                onClick={() =>
                                    setShowDateFilter(!showDateFilter)
                                }
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors text-sm font-medium ${
                                    showDateFilter ||
                                    dateRange.startDate ||
                                    dateRange.endDate
                                        ? "bg-blue-50 text-blue-700 border-blue-300"
                                        : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                                }`}
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                Date Range
                                {(dateRange.startDate || dateRange.endDate) && (
                                    <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                        ✓
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={clearAllFilters}
                                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>

                    {showDateFilter && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-4 items-end">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            From Date
                                        </label>
                                        <input
                                            type="date"
                                            value={dateRange.startDate}
                                            onChange={(e) =>
                                                handleDateRangeChange(
                                                    "startDate",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            To Date
                                        </label>
                                        <input
                                            type="date"
                                            value={dateRange.endDate}
                                            onChange={(e) =>
                                                handleDateRangeChange(
                                                    "endDate",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {(dateRange.startDate ||
                                        dateRange.endDate) && (
                                        <button
                                            onClick={clearDateRange}
                                            className="px-3 py-2 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-medium"
                                        >
                                            Clear Dates
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowDateFilter(false)}
                                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {(query ||
                        statusFilter !== "all" ||
                        dateRange.startDate ||
                        dateRange.endDate) && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {query && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
                                    Search: "{query}"
                                    <button
                                        onClick={() => setQuery("")}
                                        className="ml-1 hover:text-blue-900"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {statusFilter !== "all" && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800 border border-purple-200">
                                    Status: {statusFilter}
                                    <button
                                        onClick={() => setStatusFilter("all")}
                                        className="ml-1 hover:text-purple-900"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {dateRange.startDate && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                                    From:{" "}
                                    {dayjs(dateRange.startDate).format(
                                        "MMM D, YYYY",
                                    )}
                                    <button
                                        onClick={() =>
                                            handleDateRangeChange(
                                                "startDate",
                                                "",
                                            )
                                        }
                                        className="ml-1 hover:text-green-900"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {dateRange.endDate && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-800 border border-orange-200">
                                    To:{" "}
                                    {dayjs(dateRange.endDate).format(
                                        "MMM D, YYYY",
                                    )}
                                    <button
                                        onClick={() =>
                                            handleDateRangeChange("endDate", "")
                                        }
                                        className="ml-1 hover:text-orange-900"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {filtered.length > 0 && (
                    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                                <p className="text-sm font-medium text-blue-900">
                                    Showing {filtered.length} of {orders.length}{" "}
                                    orders
                                    {dateRange.startDate &&
                                        dateRange.endDate && (
                                            <span>
                                                {" "}
                                                between{" "}
                                                {dayjs(
                                                    dateRange.startDate,
                                                ).format("MMM D, YYYY")}{" "}
                                                and{" "}
                                                {dayjs(
                                                    dateRange.endDate,
                                                ).format("MMM D, YYYY")}
                                            </span>
                                        )}
                                </p>
                                <p className="text-sm text-blue-700">
                                    Filtered orders value:{" "}
                                    <span className="font-semibold">
                                        Rs.{" "}
                                        {getFilteredOrdersValue().toLocaleString()}
                                    </span>
                                </p>
                            </div>
                            <button
                                onClick={clearAllFilters}
                                className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <svg
                                                    className="w-16 h-16 mb-4 text-gray-300"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1}
                                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                    />
                                                </svg>
                                                <p className="font-medium text-lg">
                                                    No orders found
                                                </p>
                                                <p className="text-sm mt-1 max-w-md">
                                                    {query ||
                                                    statusFilter !== "all" ||
                                                    dateRange.startDate ||
                                                    dateRange.endDate
                                                        ? "No orders match your search criteria. Try adjusting your filters."
                                                        : "No orders have been placed yet. Orders will appear here once customers start placing orders."}
                                                </p>
                                                {(query ||
                                                    statusFilter !== "all" ||
                                                    dateRange.startDate ||
                                                    dateRange.endDate) && (
                                                    <button
                                                        onClick={
                                                            clearAllFilters
                                                        }
                                                        className="mt-4 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                    >
                                                        Clear All Filters
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-gray-50 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">
                                                        #{order.order_code}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">
                                                        {order.user?.name ||
                                                            "N/A"}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                                        {order.user?.email ||
                                                            ""}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {dayjs(
                                                        order.created_at,
                                                    ).format("MMM D, YYYY")}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {dayjs(
                                                        order.created_at,
                                                    ).format("h:mm A")}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900 text-sm">
                                                    Rs.{" "}
                                                    {parseFloat(
                                                        order.total_amount || 0,
                                                    ).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Delivery: Rs.{" "}
                                                    {parseFloat(
                                                        order.delivery_fee || 0,
                                                    ).toLocaleString()}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor(order.status)}`}
                                                >
                                                    {statusIcon(order.status)}
                                                    <span className="capitalize">
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleOrderView(
                                                                order.order_code,
                                                            )
                                                        }
                                                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-1"
                                                    >
                                                        <svg
                                                            className="w-3 h-3"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                            />
                                                        </svg>
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleEditStatus(
                                                                order,
                                                            )
                                                        }
                                                        className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors flex items-center gap-1"
                                                    >
                                                        <svg
                                                            className="w-3 h-3"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            />
                                                        </svg>
                                                        Status
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                    <p>
                        Showing{" "}
                        <span className="font-medium">{filtered.length}</span>{" "}
                        of <span className="font-medium">{orders.length}</span>{" "}
                        orders
                        {query && (
                            <span className="ml-2">
                                for "
                                <span className="font-medium">{query}</span>"
                            </span>
                        )}
                        {statusFilter !== "all" && (
                            <span className="ml-2">
                                with status "
                                <span className="font-medium capitalize">
                                    {statusFilter}
                                </span>
                                "
                            </span>
                        )}
                        {(dateRange.startDate || dateRange.endDate) && (
                            <span className="ml-2">in date range</span>
                        )}
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs">Completed</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span className="text-xs">Pending</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-xs">Processing</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-xs">Cancelled</span>
                        </div>
                    </div>
                </div>

                <OrderViewModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    orderData={viewData}
                />

                <StatusUpdateModal
                    isOpen={isStatusModalOpen}
                    onClose={closeStatusModal}
                    order={selectedOrder}
                    onStatusUpdate={handleStatusUpdate}
                />
            </div>
        </div>
    );
}
