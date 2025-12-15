import React, { useState } from "react";
import { ShoppingCart, DollarSign, Download } from "lucide-react";
import StatCard from "./StatCard";
import TrendingProductsSection from "./TrendingProductsSection";
import { exportOrdersPDF, exportOrdersExcel } from "./exportUtils";

const OverviewTab = ({
    loading,
    orders,
    stats,
    mostViewedProducts,
    productsLoading,
    dateRange,
    fetchMostViewedProducts,
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

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Orders"
                    value={stats.total_orders || 0}
                    icon={ShoppingCart}
                    description={`${dateRange.start} to ${dateRange.end}`}
                    color="blue"
                    trend={12.5}
                />
                <StatCard
                    title="Pending Orders"
                    value={stats.pending_orders || 0}
                    icon={ShoppingCart}
                    description="Awaiting action"
                    color="yellow"
                    trend={-2.3}
                />
                <StatCard
                    title="Completed Orders"
                    value={stats.completed_orders || 0}
                    icon={ShoppingCart}
                    description="Successfully delivered"
                    color="green"
                    trend={8.7}
                />
                <StatCard
                    title="Total Revenue"
                    value={`Rs. ${stats.total_revenue ? stats.total_revenue.toLocaleString() : "0"}`}
                    icon={DollarSign}
                    description="From completed orders"
                    color="green"
                    trend={15.2}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Order Analytics
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                    Average Order Value:
                                </span>
                                <span className="font-semibold">
                                    Rs.{" "}
                                    {stats.average_order_value
                                        ? stats.average_order_value.toLocaleString(
                                              undefined,
                                              {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                              },
                                          )
                                        : "0.00"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                    Completion Rate:
                                </span>
                                <span className="font-semibold text-green-600">
                                    {stats.completion_rate
                                        ? stats.completion_rate.toFixed(1)
                                        : 0}
                                    %
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                    Contacted Orders:
                                </span>
                                <span className="font-semibold">
                                    {stats.contacted_orders || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                    Cancelled Orders:
                                </span>
                                <span className="font-semibold text-red-600">
                                    {stats.cancelled_orders || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Export Reports
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={handleExportPDF}
                                disabled={
                                    exportLoading ||
                                    loading ||
                                    orders.length === 0
                                }
                                className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download
                                    className={`w-5 h-5 text-green-600 ${exportLoading ? "animate-pulse" : ""}`}
                                />
                                <span>
                                    {exportLoading
                                        ? "Exporting..."
                                        : "Export Orders (PDF)"}
                                </span>
                            </button>
                            <button
                                onClick={handleExportExcel}
                                disabled={
                                    exportLoading ||
                                    loading ||
                                    orders.length === 0
                                }
                                className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download
                                    className={`w-5 h-5 text-blue-600 ${exportLoading ? "animate-pulse" : ""}`}
                                />
                                <span>
                                    {exportLoading
                                        ? "Exporting..."
                                        : "Export Orders (Excel)"}
                                </span>
                            </button>
                            <button
                                className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled
                            >
                                <Download className="w-5 h-5 text-red-600" />
                                <span>Export Quotations (PDF)</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <TrendingProductsSection
                        mostViewedProducts={mostViewedProducts}
                        productsLoading={productsLoading}
                        onRefresh={fetchMostViewedProducts}
                    />
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
