import React, { useState, useEffect } from "react";
import axios from "axios";
import useToast from "../../../UserInterFaceComponents/Common/useToast.jsx";
import ReportHeader from "./components/ReportHeader";
import FilterSection from "./components/FilterSection";
import TabNavigation from "./components/TabNavigation";
import OverviewTab from "./components/OverviewTab";
import OrdersTab from "./components/OrdersTab";
import ProductViewsTab from "./components/ProductViewsTab";
import QuotationsTab from "./components/QuotationsTab";

const Reports = () => {
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 30))
            .toISOString()
            .split("T")[0],
        end: new Date().toISOString().split("T")[0],
    });
    const [activeTab, setActiveTab] = useState("overview");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({});
    const [mostViewedProducts, setMostViewedProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);

    const { success, error: showError } = useToast();

    useEffect(() => {
        if (activeTab === "orders" || activeTab === "overview") {
            fetchOrders();
            fetchStats();
        }
        if (activeTab === "overview" || activeTab === "product-views") {
            fetchMostViewedProducts();
        }
    }, [dateRange, statusFilter, activeTab]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                start_date: dateRange.start,
                end_date: dateRange.end,
                ...(statusFilter !== "all" && { status: statusFilter }),
            });

            const response = await axios.get(
                `http://127.0.0.1:8000/api/reports/orders?${params}`,
            );
            if (response.data.success) {
                const filteredOrders = response.data.orders || [];
                setOrders(filteredOrders);

                if (filteredOrders.length === 0) {
                    showError(
                        "No orders found for the selected date range and filters",
                    );
                }
            } else {
                showError(response.data.message || "Failed to load orders");
                setOrders([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            showError("Failed to load orders");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const params = new URLSearchParams({
                start_date: dateRange.start,
                end_date: dateRange.end,
            });

            const response = await axios.get(
                `http://127.0.0.1:8000/api/reports/stats?${params}`,
            );
            if (response.data.success) {
                setStats(response.data.stats || {});
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
            showError("Failed to load statistics");
        }
    };

    const fetchMostViewedProducts = async () => {
        setProductsLoading(true);
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/products/most-viewed",
            );
            if (response.data.success) {
                const products =
                    response.data.products !== undefined
                        ? response.data.products
                        : response.data.product
                          ? [response.data.product]
                          : [];

                setMostViewedProducts(products);
            } else {
                showError(
                    response.data.message ||
                        "Failed to load most viewed products",
                );
                setMostViewedProducts([]);
            }
        } catch (error) {
            console.error("Error fetching most viewed products:", error);
            showError("Failed to load most viewed products");
            setMostViewedProducts([]);
        } finally {
            setProductsLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchOrders();
        fetchStats();
        if (activeTab === "overview" || activeTab === "product-views") {
            fetchMostViewedProducts();
        }
    };

    const handleDateRangeChange = (type, value) => {
        setDateRange((prev) => {
            const newDateRange = { ...prev, [type]: value };

            if (newDateRange.start && newDateRange.end) {
                const startDate = new Date(newDateRange.start);
                const endDate = new Date(newDateRange.end);

                if (startDate > endDate) {
                    showError("Start date cannot be after end date");
                    return prev;
                }
            }

            return newDateRange;
        });
    };

    const renderActiveTab = () => {
        const tabProps = {
            loading,
            orders,
            stats,
            mostViewedProducts,
            productsLoading,
            dateRange,
            statusFilter,
            fetchMostViewedProducts,
            setStatusFilter,
        };

        switch (activeTab) {
            case "overview":
                return <OverviewTab {...tabProps} />;
            case "orders":
                return <OrdersTab {...tabProps} />;
            case "product-views":
                return <ProductViewsTab {...tabProps} />;
            case "quotations":
                return <QuotationsTab />;
            default:
                return <OverviewTab {...tabProps} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <ReportHeader loading={loading} onRefresh={handleRefresh} />

                <FilterSection
                    dateRange={dateRange}
                    statusFilter={statusFilter}
                    onDateRangeChange={handleDateRangeChange}
                    onStatusFilterChange={setStatusFilter}
                    onQuickDateRange={setDateRange}
                />

                <TabNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {renderActiveTab()}
            </div>
        </div>
    );
};

export default Reports;
