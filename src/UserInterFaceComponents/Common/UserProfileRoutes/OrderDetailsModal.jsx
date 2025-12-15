import React from "react";

const OrderDetailsModal = ({
    orderData,
    onClose,
    onReviewProduct,
    getStatusBadge,
    formatDate,
    formatCurrency,
}) => {
    if (!orderData) return null;

    const order = orderData.order;
    const items = orderData.items || [];
    const user = orderData.user;
    const profile = orderData.profile;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">
                            Order Details
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg
                                className="w-6 h-6"
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
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Order Information
                            </h3>
                            <p>
                                <span className="text-gray-600">
                                    Order Code:
                                </span>{" "}
                                {order.order_code}
                            </p>
                            <p>
                                <span className="text-gray-600">Placed:</span>{" "}
                                {formatDate(order.created_at)}
                            </p>
                            <p>
                                <span className="text-gray-600">Status:</span>{" "}
                                {getStatusBadge(order.status)}
                            </p>
                            {order.cancellation_reason && (
                                <p>
                                    <span className="text-gray-600">
                                        Cancellation Reason:
                                    </span>{" "}
                                    {order.cancellation_reason}
                                </p>
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Payment & Delivery
                            </h3>
                            <p>
                                <span className="text-gray-600">
                                    Total Amount:
                                </span>{" "}
                                {formatCurrency(parseFloat(order.total_amount))}
                            </p>
                            <p>
                                <span className="text-gray-600">Delivery:</span>{" "}
                                {order.delivery_option
                                    ?.replace(/_/g, " ")
                                    .toUpperCase() || "Standard"}
                            </p>
                            <p>
                                <span className="text-gray-600">
                                    Delivery Fee:
                                </span>{" "}
                                {formatCurrency(
                                    parseFloat(order.delivery_fee || 0),
                                )}
                            </p>
                        </div>
                    </div>

                    {user && (
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Customer Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p>
                                        <span className="text-gray-600">
                                            Name:
                                        </span>{" "}
                                        {user.name}
                                    </p>
                                    <p>
                                        <span className="text-gray-600">
                                            Email:
                                        </span>{" "}
                                        {user.email}
                                    </p>
                                    {profile?.phone && (
                                        <p>
                                            <span className="text-gray-600">
                                                Phone:
                                            </span>{" "}
                                            {profile.phone}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    {profile?.address && (
                                        <p>
                                            <span className="text-gray-600">
                                                Address:
                                            </span>{" "}
                                            {profile.address}
                                        </p>
                                    )}
                                    {profile?.city && (
                                        <p>
                                            <span className="text-gray-600">
                                                City:
                                            </span>{" "}
                                            {profile.city}
                                        </p>
                                    )}
                                    {profile?.country && (
                                        <p>
                                            <span className="text-gray-600">
                                                Country:
                                            </span>{" "}
                                            {profile.country}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                            Order Items ({items.length})
                        </h3>
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={item.product?.image}
                                            alt={item.product?.name}
                                            className="w-12 h-12 object-cover rounded"
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://via.placeholder.com/80x80?text=No+Image";
                                            }}
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {item.product?.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Model: {item.product?.model}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(
                                                parseFloat(item.price),
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Qty: {item.quantity}
                                        </p>
                                        {order.status === "completed" && (
                                            <button
                                                onClick={() =>
                                                    onReviewProduct(
                                                        item.product,
                                                    )
                                                }
                                                disabled={item.has_reviewed}
                                                className={`mt-2 text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                                                    item.has_reviewed
                                                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                                        : "bg-green-600 text-white hover:bg-green-700"
                                                }`}
                                            >
                                                {item.has_reviewed
                                                    ? "Reviewed"
                                                    : "Write Review"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total Amount:</span>
                            <span>
                                {formatCurrency(parseFloat(order.total_amount))}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
