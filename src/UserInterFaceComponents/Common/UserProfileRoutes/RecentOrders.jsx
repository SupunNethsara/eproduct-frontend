import React, { useState, useEffect } from "react";
import axios from "axios";
import useToast from "../useToast.jsx";
import CancelOrderModal from "./CancelOrderModal";
import ReviewModal from "./ReviewModal";
import OrderDetailsModal from "./OrderDetailsModal";

function RecentOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedProductForReview, setSelectedProductForReview] =
        useState(null);
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [cancelReason, setCancelReason] = useState("");
    const [cancellationEligibility, setCancellationEligibility] = useState({});
    const [checkingEligibility, setCheckingEligibility] = useState(false);
    const token = localStorage.getItem("token");
    const { success, error: showError } = useToast();

    useEffect(() => {
        fetchUserOrders();
    }, []);

    const fetchUserOrders = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/orders/getUserOrders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            setOrders(response.data);
        } catch (error) {
            console.error(
                "Error fetching orders:",
                error.response?.data || error.message,
            );
            const errorMessage =
                error.response?.data?.message || "Something went wrong";
            setError(errorMessage);
            showError(errorMessage, "Failed to Load Orders");
        } finally {
            setLoading(false);
        }
    };

    const checkCancellationEligibility = async (orderId) => {
        setCheckingEligibility(true);
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/orders/${orderId}/cancellation-eligibility`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            setCancellationEligibility((prev) => ({
                ...prev,
                [orderId]: response.data,
            }));
            return response.data;
        } catch (error) {
            console.error("Error checking cancellation eligibility:", error);
            showError("Failed to check cancellation eligibility", "Error");
            return null;
        } finally {
            setCheckingEligibility(false);
        }
    };

    const openCancelModal = async (order) => {
        setOrderToCancel(order);
        const eligibility = await checkCancellationEligibility(order.id);

        if (eligibility?.is_eligible) {
            setShowCancelModal(true);
            setCancelReason("");
        } else {
            const message =
                eligibility?.cancellation_eligibility?.is_within_time_limit ===
                false
                    ? `Order cannot be cancelled. Cancellation is only allowed within 1 hour of order placement. (${eligibility.cancellation_eligibility.time_elapsed_minutes} minutes have passed)`
                    : `Order cannot be cancelled. Current status: ${order.status}`;
            showError(message, "Cancellation Not Allowed");
        }
    };

    const handleCancelOrder = async () => {
        if (!orderToCancel || !cancelReason.trim()) {
            showError(
                "Please provide a reason for cancellation",
                "Reason Required",
            );
            return;
        }

        try {
            await axios.post(
                "http://127.0.0.1:8000/api/orders/cancel",
                {
                    order_id: orderToCancel.id,
                    reason: cancelReason.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            setOrders((prevOrders) =>
                prevOrders.map((orderData) =>
                    orderData.order.id === orderToCancel.id
                        ? {
                              ...orderData,
                              order: {
                                  ...orderData.order,
                                  status: "cancelled",
                                  cancellation_reason: cancelReason.trim(),
                                  cancelled_at: new Date().toISOString(),
                              },
                          }
                        : orderData,
                ),
            );

            setShowCancelModal(false);
            setOrderToCancel(null);
            setCancelReason("");

            success("Order cancelled successfully!", "Order Cancelled");
        } catch (error) {
            console.error(
                "Error cancelling order:",
                error.response?.data || error.message,
            );
            const errorMessage =
                error.response?.data?.message || "Failed to cancel order";
            showError(errorMessage, "Cancellation Failed");
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            completed: "bg-green-100 text-green-800 border border-green-200",
            pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
            processing: "bg-blue-100 text-blue-800 border border-blue-200",
            cancelled: "bg-red-100 text-red-800 border border-red-200",
            shipped: "bg-purple-100 text-purple-800 border border-purple-200",
            contacted: "bg-indigo-100 text-indigo-800 border border-indigo-200",
        };

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status] || "bg-gray-100 text-gray-800"}`}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const toggleOrderExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const openOrderDetails = (orderData) => {
        setSelectedOrder(orderData);
        setShowDetailsModal(true);
    };

    const openReviewModal = (product) => {
        setSelectedProductForReview(product);
        setShowReviewModal(true);
    };

    const submitReview = async (reviewData) => {
        if (!selectedProductForReview) return;

        setReviewSubmitting(true);
        try {
            await axios.post(
                `http://127.0.0.1:8000/api/products/${selectedProductForReview.id}/reviews`,
                reviewData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            setOrders((prevOrders) =>
                prevOrders.map((orderData) => ({
                    ...orderData,
                    items: orderData.items.map((item) =>
                        item.product?.id === selectedProductForReview.id
                            ? { ...item, has_reviewed: true }
                            : item,
                    ),
                })),
            );

            setShowReviewModal(false);
            setSelectedProductForReview(null);

            success("Review submitted successfully!", "Thank You!");
        } catch (error) {
            console.error(
                "Error submitting review:",
                error.response?.data || error.message,
            );
            const errorMessage =
                error.response?.data?.message || "Failed to submit review";
            showError(errorMessage, "Review Failed");
        } finally {
            setReviewSubmitting(false);
        }
    };

    (product, orderStatus) => {
        return orderStatus === "completed" && !product.has_reviewed;
    };

    const getTimeRemaining = (order) => {
        const orderCreationTime = new Date(order.created_at);
        const currentTime = new Date();
        const timeDifference = Math.floor(
            (currentTime - orderCreationTime) / (1000 * 60),
        );
        const maxCancellationTime = 60;
        const timeRemaining = maxCancellationTime - timeDifference;
        return timeRemaining > 0 ? timeRemaining : 0;
    };

    const canCancelOrder = (order) => {
        const allowedStatuses = ["pending", "contacted"];
        return (
            allowedStatuses.includes(order.status) &&
            getTimeRemaining(order) > 0
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl shadow-sm p-6"
                                >
                                    <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={fetchUserOrders}
                            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-full mx-auto px-4">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-10 h-10 text-gray-400"
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
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No orders yet
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Start shopping to see your orders here
                            </p>
                            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                                Start Shopping
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((orderData) => {
                            const order = orderData.order;
                            const items = orderData.items || [];
                            const totalItems = items.reduce(
                                (sum, item) => sum + parseInt(item.quantity),
                                0,
                            );
                            const timeRemaining = getTimeRemaining(order);
                            const canCancel = canCancelOrder(order);

                            return (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                                >
                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center relative">
                                                    {/* Show first product image, or multiple if available */}
                                                    {items.length > 0 ? (
                                                        <>
                                                            {items.slice(0, 2).map((item, index) => (
                                                                <img
                                                                    key={item.id}
                                                                    src={item.product?.image}
                                                                    alt={item.product?.name}
                                                                    className={`w-6 h-6 object-cover rounded border border-white ${
                                                                        index === 1 ? 'absolute -bottom-1 -right-1' : ''
                                                                    }`}
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                    }}
                                                                />
                                                            ))}
                                                            {items.length > 2 && (
                                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                                                                    +{items.length - 1}
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <svg
                                                            className="w-5 h-5 text-blue-600"
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
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-sm">
                                                        Order #
                                                        {order.order_code}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {formatDate(
                                                            order.created_at,
                                                        )}{" "}
                                                        • {totalItems} item
                                                        {totalItems !== 1
                                                            ? "s"
                                                            : ""}
                                                    </p>
                                                    {canCancel && (
                                                        <p className="text-xs text-orange-600 mt-1">
                                                            ⏰ Cancellation
                                                            available for{" "}
                                                            {timeRemaining} more
                                                            minutes
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {formatCurrency(
                                                        parseFloat(
                                                            order.total_amount,
                                                        ),
                                                    )}
                                                </span>
                                                {getStatusBadge(order.status)}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() =>
                                                        openOrderDetails(
                                                            orderData,
                                                        )
                                                    }
                                                    className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-50 rounded"
                                                    title="View Details"
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
                                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    <span>Details</span>
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        toggleOrderExpand(
                                                            order.id,
                                                        )
                                                    }
                                                    className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-50 rounded"
                                                    title="View Items"
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
                                                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                                        />
                                                    </svg>
                                                    <span>Items</span>
                                                </button>

                                                {order.status ===
                                                    "completed" && (
                                                    <button
                                                        className="flex items-center space-x-1 text-xs text-green-600 hover:text-green-800 transition-colors p-2 hover:bg-green-50 rounded"
                                                        title="Review Products"
                                                        onClick={() =>
                                                            openOrderDetails(
                                                                orderData,
                                                            )
                                                        }
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
                                                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                                            />
                                                        </svg>
                                                        <span>Review</span>
                                                    </button>
                                                )}
                                            </div>

                                            {canCancel && (
                                                <button
                                                    onClick={() =>
                                                        openCancelModal(order)
                                                    }
                                                    disabled={
                                                        checkingEligibility
                                                    }
                                                    className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium flex items-center gap-1"
                                                >
                                                    {checkingEligibility ? (
                                                        <>
                                                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            Checking...
                                                        </>
                                                    ) : (
                                                        "Cancel Order"
                                                    )}
                                                </button>
                                            )}

                                            {order.status === "cancelled" &&
                                                order.cancellation_reason && (
                                                    <div className="text-xs text-gray-500 max-w-xs">
                                                        <p>
                                                            <strong>
                                                                Cancellation
                                                                reason:
                                                            </strong>{" "}
                                                            {
                                                                order.cancellation_reason
                                                            }
                                                        </p>
                                                        {order.cancelled_at && (
                                                            <p>
                                                                Cancelled on:{" "}
                                                                {formatDate(
                                                                    order.cancelled_at,
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                        </div>

                                        {expandedOrder === order.id && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <div className="space-y-3">
                                                    {items.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center justify-between text-sm"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <img
                                                                    src={
                                                                        item
                                                                            .product
                                                                            ?.image
                                                                    }
                                                                    alt={
                                                                        item
                                                                            .product
                                                                            ?.name
                                                                    }
                                                                    className="w-8 h-8 object-cover rounded"
                                                                    onError={(
                                                                        e,
                                                                    ) => {
                                                                        e.target.src =
                                                                            "https://via.placeholder.com/80x80?text=No+Image";
                                                                    }}
                                                                />
                                                                <div>
                                                                    <p className="font-medium text-gray-900">
                                                                        {
                                                                            item
                                                                                .product
                                                                                ?.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        Qty:{" "}
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="font-semibold text-gray-900 block">
                                                                    {formatCurrency(
                                                                        parseFloat(
                                                                            item.price,
                                                                        ),
                                                                    )}
                                                                </span>
                                                                {order.status ===
                                                                    "completed" && (
                                                                    <button
                                                                        onClick={() =>
                                                                            openReviewModal(
                                                                                item.product,
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            item.has_reviewed
                                                                        }
                                                                        className={`text-xs mt-1 px-2 py-1 rounded transition-colors ${
                                                                            item.has_reviewed
                                                                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                                                                : "bg-green-600 text-white hover:bg-green-700"
                                                                        }`}
                                                                    >
                                                                        {item.has_reviewed
                                                                            ? "Reviewed"
                                                                            : "Review"}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {showDetailsModal && (
                    <OrderDetailsModal
                        orderData={selectedOrder}
                        onClose={() => setShowDetailsModal(false)}
                        onReviewProduct={openReviewModal}
                        getStatusBadge={getStatusBadge}
                        formatDate={formatDate}
                        formatCurrency={formatCurrency}
                    />
                )}

                {showReviewModal && (
                    <ReviewModal
                        product={selectedProductForReview}
                        onClose={() => {
                            setShowReviewModal(false);
                            setSelectedProductForReview(null);
                        }}
                        onSubmit={submitReview}
                        submitting={reviewSubmitting}
                        showError={showError}
                        success={success}
                    />
                )}

                {showCancelModal && (
                    <CancelOrderModal
                        order={orderToCancel}
                        onClose={() => {
                            setShowCancelModal(false);
                            setOrderToCancel(null);
                            setCancelReason("");
                        }}
                        onConfirm={handleCancelOrder}
                        reason={cancelReason}
                        setReason={setCancelReason}
                    />
                )}
            </div>
        </div>
    );
}

export default RecentOrders;
