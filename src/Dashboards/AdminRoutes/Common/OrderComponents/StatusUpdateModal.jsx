import React, { useState } from "react";
import axios from "axios";

const StatusUpdateModal = ({ isOpen, onClose, order, onStatusUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(order?.status || "");

    if (!isOpen || !order) return null;

    const statusOptions = [
        {
            value: "pending",
            label: "Pending",
            color: "bg-amber-500",
            description: "Order received, awaiting processing",
        },
        {
            value: "contacted",
            label: "Contacted",
            color: "bg-blue-500",
            description: "Customer has been contacted",
        },
        {
            value: "processing",
            label: "Processing",
            color: "bg-indigo-500",
            description: "Order is being processed",
        },
        {
            value: "shipped",
            label: "Shipped",
            color: "bg-purple-500",
            description: "Order has been shipped",
        },
        {
            value: "completed",
            label: "Completed",
            color: "bg-green-500",
            description: "Order delivered successfully",
        },
        {
            value: "cancelled",
            label: "Cancelled",
            color: "bg-red-500",
            description: "Order has been cancelled",
        },
    ];

    const statusColor = (status) => {
        switch (status) {
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

    const handleStatusUpdate = async () => {
        if (!selectedStatus || selectedStatus === order.status) {
            onClose();
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                "http://127.0.0.1:8000/api/orders/update-status",
                {
                    order_id: order.id,
                    status: selectedStatus,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            if (response.data.success) {
                onStatusUpdate(order.id, selectedStatus);
                onClose();
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update order status");
        } finally {
            setLoading(false);
        }
    };

    const getCurrentStatusIndex = () => {
        return statusOptions.findIndex(
            (option) => option.value === order.status,
        );
    };

    const getSelectedStatusIndex = () => {
        return statusOptions.findIndex(
            (option) => option.value === selectedStatus,
        );
    };

    const isStatusAllowed = (statusValue) => {
        const currentIndex = getCurrentStatusIndex();
        const targetIndex = statusOptions.findIndex(
            (option) => option.value === statusValue,
        );

        return true;
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Update Order Status
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Order #{order.order_code}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg
                                className="w-5 h-5 text-gray-500"
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
                        </button>
                    </div>

                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Current Status
                                </p>
                                <div
                                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border mt-2 ${statusColor(order.status)}`}
                                >
                                    <div
                                        className={`w-2 h-2 rounded-full ${statusOptions.find((s) => s.value === order.status)?.color}`}
                                    ></div>
                                    <span className="font-medium capitalize">
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-600">
                                    Customer
                                </p>
                                <p className="text-sm text-gray-900 mt-2">
                                    {order.user?.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <p className="text-sm font-medium text-gray-900 mb-4">
                            Select New Status
                        </p>
                        <div className="space-y-3">
                            {statusOptions.map((status) => (
                                <div
                                    key={status.value}
                                    className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                                        selectedStatus === status.value
                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-20"
                                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                    } ${
                                        !isStatusAllowed(status.value)
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        isStatusAllowed(status.value) &&
                                        setSelectedStatus(status.value)
                                    }
                                >
                                    <div className="flex items-center h-5">
                                        <input
                                            type="radio"
                                            checked={
                                                selectedStatus === status.value
                                            }
                                            onChange={() =>
                                                isStatusAllowed(status.value) &&
                                                setSelectedStatus(status.value)
                                            }
                                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            disabled={
                                                !isStatusAllowed(status.value)
                                            }
                                        />
                                    </div>
                                    <div className="ml-3 flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-2 h-2 rounded-full ${status.color}`}
                                            ></div>
                                            <span className="text-sm font-medium text-gray-900 capitalize">
                                                {status.label}
                                            </span>
                                            {order.status === status.value && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {status.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6">
                            <p className="text-sm font-medium text-gray-900 mb-3">
                                Order Progress
                            </p>
                            <div className="flex items-center justify-between relative">
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
                                <div
                                    className="absolute top-1/2 left-0 h-0.5 bg-green-500 -translate-y-1/2 transition-all duration-300"
                                    style={{
                                        width: `${((getSelectedStatusIndex() + 1) / statusOptions.length) * 100}%`,
                                    }}
                                ></div>

                                {statusOptions.map((status, index) => (
                                    <div
                                        key={status.value}
                                        className="relative z-10 flex flex-col items-center"
                                    >
                                        <div
                                            className={`w-4 h-4 rounded-full border-2 transition-all ${
                                                index <=
                                                getSelectedStatusIndex()
                                                    ? "bg-green-500 border-green-500"
                                                    : index ===
                                                        getCurrentStatusIndex()
                                                      ? "bg-white border-gray-400"
                                                      : "bg-white border-gray-300"
                                            }`}
                                        ></div>
                                        <span className="text-xs text-gray-500 mt-1 capitalize hidden sm:block">
                                            {status.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleStatusUpdate}
                            disabled={
                                loading ||
                                !selectedStatus ||
                                selectedStatus === order.status
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Updating...
                                </>
                            ) : (
                                "Update Status"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusUpdateModal;
