import React, { useState } from "react";
import { ShoppingCart, Download } from "lucide-react";
import { exportOrdersPDF, exportOrdersExcel } from "./exportUtils";

const OrdersTab = ({
    loading,
    orders,
    dateRange,
    statusFilter,
    setStatusFilter,
    success,
    error: showError,
}) => {
    const [exportLoading, setExportLoading] = useState(false);

    const handleExportPDF = async () => {
        setExportLoading(true);
        try {
            await exportOrdersPDF(orders, dateRange, success, showError);
        } finally {
            setExportLoading(false);
        }
    };

    const handleExportExcel = async () => {
        setExportLoading(true);
        try {
            await exportOrdersExcel(orders, dateRange, success, showError);
        } finally {
            setExportLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800",
            contacted: "bg-blue-100 text-blue-800",
            completed: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Order Reports
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Showing {orders.length} orders from {dateRange.start} to{" "}
                        {dateRange.end}
                        {statusFilter !== "all" &&
                            ` (Filtered by: ${statusFilter})`}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportPDF}
                        disabled={
                            exportLoading || loading || orders.length === 0
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download
                            className={`w-4 h-4 ${exportLoading ? "animate-pulse" : ""}`}
                        />
                        {exportLoading ? "Exporting..." : "Export PDF"}
                    </button>
                    <button
                        onClick={handleExportExcel}
                        disabled={
                            exportLoading || loading || orders.length === 0
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download
                            className={`w-4 h-4 ${exportLoading ? "animate-pulse" : ""}`}
                        />
                        {exportLoading ? "Exporting..." : "Export Excel"}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">
                        Loading orders...
                    </span>
                </div>
            ) : orders.length > 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.order_code}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.customer_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.customer_email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {order.customer_phone || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(
                                                order.created_at,
                                            ).toLocaleDateString()}
                                            <div className="text-xs text-gray-400">
                                                {new Date(
                                                    order.created_at,
                                                ).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Rs.{" "}
                                            {parseFloat(
                                                order.total_amount || 0,
                                            ).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {order.items_count || 1} item(s)
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                                            >
                                                {order.status
                                                    ? order.status
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                      order.status.slice(1)
                                                    : "Unknown"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No orders found
                    </h3>
                    <p className="text-gray-500 mb-4">
                        {statusFilter !== "all"
                            ? `No ${statusFilter} orders found in the selected date range.`
                            : "No orders found in the selected date range."}
                    </p>
                    <button
                        onClick={() => setStatusFilter("all")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrdersTab;
