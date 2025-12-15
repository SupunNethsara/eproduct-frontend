import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

function ChartsGrid() {
    const [data, setData] = useState({
        monthlyOrders: [],
        ordersByStatus: [],
        topSellingProducts: [],
        mostViewedProducts: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/admin/chart",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                setData({
                    monthlyOrders: response.data.monthlyOrders || [],
                    ordersByStatus: response.data.ordersByStatus || [],
                    topSellingProducts: response.data.topSellingProducts || [],
                    mostViewedProducts: response.data.mostViewedProducts || [],
                });
            } catch (err) {
                console.error("❌ Error fetching chart data:", err);
                setError("Failed to load chart data.");
                setData({
                    monthlyOrders: [],
                    ordersByStatus: [],
                    topSellingProducts: [],
                    mostViewedProducts: [],
                });
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-emerald-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-emerald-900">{label}</p>
                    {payload.map((entry, index) => (
                        <p
                            key={index}
                            className="text-sm"
                            style={{ color: entry.color }}
                        >
                            {entry.name}:{" "}
                            {entry.name.includes("Revenue") ||
                            entry.dataKey === "revenue"
                                ? formatCurrency(entry.value)
                                : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center text-emerald-700">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p>Loading charts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 py-10 font-semibold">
                {error}
            </div>
        );
    }

    const {
        monthlyOrders,
        ordersByStatus,
        topSellingProducts,
        mostViewedProducts,
    } = data;

    const hasData =
        monthlyOrders.length > 0 ||
        ordersByStatus.length > 0 ||
        topSellingProducts.length > 0 ||
        mostViewedProducts.length > 0;

    if (!hasData) {
        return (
            <div className="text-center py-10">
                <div className="text-emerald-600 mb-4">
                    <svg
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                    No Chart Data Available
                </h3>
                <p className="text-gray-600">
                    There's not enough data to display charts yet.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* ================= Monthly Orders Trend ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {monthlyOrders.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-emerald-900">
                                Monthly Orders Trend
                            </h3>
                            <div className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                Last 12 Months
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyOrders}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#E5E7EB"
                                    />
                                    <XAxis
                                        dataKey="month_short"
                                        stroke="#047857"
                                        fontSize={12}
                                    />
                                    <YAxis stroke="#047857" fontSize={12} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="#059669"
                                        strokeWidth={3}
                                        name="Orders"
                                        dot={{
                                            fill: "#059669",
                                            strokeWidth: 2,
                                            r: 4,
                                        }}
                                        activeDot={{ r: 6, fill: "#047857" }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#8B5CF6"
                                        strokeWidth={2}
                                        name="Revenue"
                                        strokeDasharray="5 5"
                                        dot={{
                                            fill: "#8B5CF6",
                                            strokeWidth: 2,
                                            r: 3,
                                        }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* ================= Orders by Status ================= */}
                {ordersByStatus.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-emerald-900">
                                Orders by Status
                            </h3>
                            <div className="text-sm text-emerald-600">
                                Total:{" "}
                                {ordersByStatus.reduce(
                                    (sum, item) => sum + item.value,
                                    0,
                                )}{" "}
                                orders
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={ordersByStatus}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name} (${(percent * 100).toFixed(0)}%)`
                                        }
                                        outerRadius={80}
                                        innerRadius={40}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {ordersByStatus.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name) => [
                                            value,
                                            name,
                                        ]}
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            border: "1px solid #059669",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                        }}
                                    />
                                    <Legend
                                        layout="vertical"
                                        verticalAlign="middle"
                                        align="right"
                                        wrapperStyle={{
                                            paddingLeft: "20px",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            {/* ================= Top Selling Products ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {topSellingProducts.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-emerald-900">
                                Top Selling Products
                            </h3>
                            <div className="text-sm text-emerald-600">
                                By Quantity Sold
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={topSellingProducts}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 60,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#E5E7EB"
                                    />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#047857"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        fontSize={12}
                                    />
                                    <YAxis stroke="#047857" fontSize={12} />
                                    <Tooltip
                                        formatter={(value, name) => {
                                            if (
                                                name === "Revenue" ||
                                                name === "revenue"
                                            )
                                                return [
                                                    formatCurrency(value),
                                                    name,
                                                ];
                                            return [value, name];
                                        }}
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            border: "1px solid #059669",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="orders"
                                        fill="#059669"
                                        name="Quantity Sold"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="revenue"
                                        fill="#8B5CF6"
                                        name="Revenue"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* ================= Most Viewed Products ================= */}
                {mostViewedProducts.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-emerald-900">
                                Most Viewed Products
                            </h3>
                            <div className="text-sm text-emerald-600">
                                Top 5 Products
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={mostViewedProducts}
                                    layout="vertical"
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 100,
                                        bottom: 20,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#E5E7EB"
                                    />
                                    <XAxis
                                        type="number"
                                        stroke="#047857"
                                        fontSize={12}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        stroke="#047857"
                                        fontSize={12}
                                        width={80}
                                    />
                                    <Tooltip
                                        formatter={(value) => [value, "Views"]}
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            border: "1px solid #059669",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="views"
                                        fill="#059669"
                                        name="Page Views"
                                        radius={[0, 4, 4, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ChartsGrid;
