import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
    clearCart,
    clearServerCart,
    fetchCartItems,
} from "../../../Store/slices/cartSlice";
import axios from "axios";
import CompleteProfileModal from "../../Common/CompleteProfileModal.jsx";

function CheckOutUser() {
    const [storeCode, setStoreCode] = useState("");
    const [deliveryOption] = useState("standard");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [completeModal, setCompleteModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { items: cartItems, loading: cartLoading } = useSelector(
        (state) => state.cart,
    );

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const deliveryOptions = [
        {
            id: "standard",
            name: "Standard Delivery",
            price: 0,
            deliveryTime: "3-5 business days",
        },
        {
            id: "express",
            name: "Express Delivery",
            price: 0,
            deliveryTime: "1-2 business days",
        },
    ];

    const selectedDelivery =
        deliveryOptions.find((option) => option.id === deliveryOption) ||
        deliveryOptions[0];
    const directBuyData = location.state?.directBuy ? location.state : null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No authentication token found");
                }

                const profileResponse = await axios.get(
                    "http://127.0.0.1:8000/api/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    },
                );

                if (
                    profileResponse.data.profile_exists === false ||
                    !profileResponse.data.profile
                ) {
                    setCompleteModal(true);
                    return;
                }

                const requiredFields = [
                    "phone",
                    "address",
                    "city",
                    "postal_code",
                    "country",
                ];
                const profile = profileResponse.data.profile;
                const hasMissingFields = requiredFields.some(
                    (field) => !profile[field],
                );

                if (hasMissingFields) {
                    setCompleteModal(true);
                    return;
                }

                setUser({
                    ...profileResponse.data.profile.user,
                    profile: {
                        ...profileResponse.data.profile,
                    },
                });

                if (!directBuyData) {
                    await dispatch(fetchCartItems()).unwrap();
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                const message =
                    error.response?.data?.message || "Failed to load data";
                setError(message);

                if (
                    message.includes(
                        "Call to a member function with() on null",
                    ) ||
                    message.includes("profile") ||
                    message.includes("Profile not found") ||
                    error.response?.status === 404
                ) {
                    setCompleteModal(true);
                }

                if (error.response?.status === 401) {
                    window.location.href = "/";
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch, directBuyData]);

    // Helper function to get product price (buy_now_price first, then price)
    const getProductPrice = (product) => {
        return parseFloat(product?.buy_now_price || product?.price || 0);
    };

    // Helper function to check if there's a discount
    const hasDiscount = (product) => {
        return (
            product?.buy_now_price &&
            product?.price &&
            parseFloat(product.buy_now_price) < parseFloat(product.price)
        );
    };

    // Helper function to calculate savings - FIXED: Added const declaration
    const getProductSavings = (product, quantity = 1) => {
        if (!hasDiscount(product)) return 0;
        const originalPrice = parseFloat(product.price);
        const discountedPrice = parseFloat(product.buy_now_price);
        return (originalPrice - discountedPrice) * quantity;
    };

    const calculateOrderSummary = () => {
        if (directBuyData) {
            const productPrice = getProductPrice(directBuyData.product);
            const itemTotal = productPrice * directBuyData.quantity;
            return {
                itemsTotal: parseFloat(itemTotal.toFixed(2)),
                deliveryFee: selectedDelivery.price,
                total: parseFloat(
                    (itemTotal + selectedDelivery.price).toFixed(2),
                ),
                itemCount: 1,
                totalSavings: getProductSavings(
                    directBuyData.product,
                    directBuyData.quantity,
                ),
            };
        }

        if (!cartItems || cartItems.length === 0) {
            return {
                itemsTotal: 0,
                deliveryFee: selectedDelivery.price,
                total: selectedDelivery.price,
                itemCount: 0,
                totalSavings: 0,
            };
        }

        const itemsTotal = cartItems.reduce((total, item) => {
            const productPrice = getProductPrice(item.product);
            return total + productPrice * item.quantity;
        }, 0);

        const itemCount = cartItems.reduce(
            (total, item) => total + item.quantity,
            0,
        );

        const totalSavings = cartItems.reduce((total, item) => {
            return total + getProductSavings(item.product, item.quantity);
        }, 0);

        return {
            itemsTotal: parseFloat(itemsTotal.toFixed(2)),
            deliveryFee: selectedDelivery.price,
            total: parseFloat((itemsTotal + selectedDelivery.price).toFixed(2)),
            itemCount: itemCount,
            totalSavings: parseFloat(totalSavings.toFixed(2)),
        };
    };

    const orderSummary = calculateOrderSummary();

    const handleApplyStoreCode = () => {
        console.log("Applying store code:", storeCode);
    };

    const createDirectOrder = async () => {
        try {
            const token = localStorage.getItem("token");
            const productPrice = getProductPrice(directBuyData.product);

            const orderData = {
                items: [
                    {
                        product_id: directBuyData.product.id,
                        quantity: directBuyData.quantity,
                        price: productPrice,
                        original_price: directBuyData.product.price, // Store original price for reference
                        buy_now_price: directBuyData.product.buy_now_price, // Store buy_now_price for reference
                    },
                ],
                total_amount: orderSummary.total,
                delivery_fee: selectedDelivery.price,
                delivery_option: deliveryOption,
            };

            const response = await axios.post(
                "http://127.0.0.1:8000/api/orders/direct",
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                },
            );
            dispatch(clearCart());

            const confirmationData = {
                order: response.data.order,
                user: user,
                orderSummary: orderSummary,
                items: getDisplayItems(),
                deliveryOption: selectedDelivery,
            };

            navigate("/order-confirmation", { state: confirmationData });
        } catch (error) {
            console.error(" Error creating direct order:", error);
            alert("Failed to create order. Please try again.");
        }
    };

    const processCartCheckout = async () => {
        try {
            setIsProcessing(true);

            const token = localStorage.getItem("token");
            const orderData = {
                items: cartItems.map((item) => {
                    const productPrice = getProductPrice(item.product);
                    return {
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: productPrice,
                        original_price: item.product.price, // Store original price for reference
                        buy_now_price: item.product.buy_now_price, // Store buy_now_price for reference
                    };
                }),
                total_amount: orderSummary.total,
                delivery_fee: selectedDelivery.price,
                delivery_option: deliveryOption,
            };

            const response = await axios.post(
                "http://127.0.0.1:8000/api/orders/checkout",
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                },
            );

            if (response.data.success) {
                dispatch(clearCart());
                try {
                    await dispatch(clearServerCart()).unwrap();
                } catch (clearError) {
                    console.warn(
                        "⚠️ Server cart clear warning (order still placed):",
                        clearError,
                    );
                }
            }

            const confirmationData = {
                order: response.data.order,
                user: user,
                orderSummary: orderSummary,
                items: getDisplayItems(),
                deliveryOption: selectedDelivery,
            };

            navigate("/order-confirmation", { state: confirmationData });
        } catch (error) {
            console.error("Error processing cart checkout:", error);
            alert("Failed to process checkout. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleProceedToPay = async () => {
        if (displayItems.length === 0) {
            alert("No items to order!");
            return;
        }

        setIsProcessing(true);

        await new Promise((resolve) => setTimeout(resolve, 4000));

        if (directBuyData) {
            await createDirectOrder();
        } else {
            await processCartCheckout();
        }

        setIsProcessing(false);
    };

    const getDisplayItems = () => {
        if (directBuyData) {
            return [
                {
                    id: `direct-${directBuyData.product.id}`,
                    product: directBuyData.product,
                    quantity: directBuyData.quantity,
                    isDirectBuy: true,
                },
            ];
        }
        return cartItems || [];
    };

    const displayItems = getDisplayItems();

    if ((loading || (!directBuyData && cartLoading)) && !completeModal) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 mt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        Loading your information...
                    </p>
                </div>
            </div>
        );
    }

    if (error && !completeModal) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 mt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!user && !completeModal) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 mt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">
                        User not found. Please log in again.
                    </p>
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 mt-20 px-4 sm:px-6 lg:px-8 ">
            {isProcessing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 flex flex-col items-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mb-4"></div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Processing Your Order
                        </h3>
                        <p className="text-gray-600 text-center">
                            Please wait while we confirm your order...
                        </p>
                        <div className="w-48 bg-gray-200 rounded-full h-2 mt-4">
                            <div className="bg-green-600 h-2 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )}

            {user && user.profile && (
                <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                    <div className="flex-1 flex flex-col gap-6">
                        <div className="flex-1 flex flex-col gap-6">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Shipping & Billing
                                    </h2>
                                    <button
                                        onClick={() => navigate("/profile")}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
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
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                        Edit
                                    </button>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-800 font-medium">
                                            {user?.name || "Not provided"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">
                                            {user?.profile?.phone ||
                                                "Not provided"}
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-gray-600 text-sm">
                                            {user?.profile?.address ||
                                                "Not provided"}
                                            {user?.profile?.city &&
                                                `, ${user.profile.city}`}
                                            {user?.profile?.postal_code &&
                                                `, ${user.profile.postal_code}`}
                                            {user?.profile?.country &&
                                                `, ${user.profile.country}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-md font-semibold text-gray-900">
                                    Package 1 of 1{" "}
                                    {directBuyData && (
                                        <span className="text-blue-600 text-sm">
                                            (Direct Purchase)
                                        </span>
                                    )}
                                </h3>
                                <button
                                    onClick={() => navigate("/cart")}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    EDIT
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {displayItems.length > 0 ? (
                                    displayItems.map((item) => {
                                        const images =
                                            typeof item.product?.images ===
                                            "string"
                                                ? JSON.parse(
                                                      item.product.images.replace(
                                                          /\\([^\\])/g,
                                                          "$1",
                                                      ),
                                                  )
                                                : item.product?.images || [];
                                        const mainImage =
                                            images[0] || item.product?.image;

                                        const productPrice = getProductPrice(
                                            item.product,
                                        );
                                        const itemTotal =
                                            productPrice * item.quantity;
                                        const productHasDiscount = hasDiscount(
                                            item.product,
                                        );
                                        const itemSavings = getProductSavings(
                                            item.product,
                                            item.quantity,
                                        );

                                        return (
                                            <div
                                                key={item.id}
                                                className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg"
                                            >
                                                {mainImage ? (
                                                    <img
                                                        src={mainImage}
                                                        alt={
                                                            item.product
                                                                ?.name ||
                                                            "Product"
                                                        }
                                                        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                                                        onError={(e) => {
                                                            e.target.onerror =
                                                                null;
                                                            e.target.src =
                                                                "https://via.placeholder.com/80?text=No+Image";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs text-center p-2">
                                                        No Image
                                                    </div>
                                                )}

                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-sm font-medium text-gray-900 truncate">
                                                        {item.product?.name ||
                                                            "Product"}
                                                        {item.isDirectBuy && (
                                                            <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                                                                Direct Buy
                                                            </span>
                                                        )}
                                                    </h5>

                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        {/* Show original price if there's a discount */}
                                                        {productHasDiscount && (
                                                            <span className="text-sm text-gray-500 line-through">
                                                                Rs.{" "}
                                                                {parseFloat(
                                                                    item.product
                                                                        .price,
                                                                ).toFixed(2)}
                                                            </span>
                                                        )}

                                                        {/* Current price (buy_now_price or price) */}
                                                        <span
                                                            className={`text-sm font-semibold ${
                                                                productHasDiscount
                                                                    ? "text-green-600"
                                                                    : "text-gray-900"
                                                            }`}
                                                        >
                                                            Rs.{" "}
                                                            {productPrice.toFixed(
                                                                2,
                                                            )}
                                                        </span>

                                                        <span className="text-sm text-gray-500">
                                                            × {item.quantity}
                                                        </span>

                                                        <span className="text-sm font-semibold text-green-600">
                                                            Rs.{" "}
                                                            {itemTotal.toFixed(
                                                                2,
                                                            )}
                                                        </span>
                                                    </div>

                                                    {/* Show savings if there's a discount */}
                                                    {productHasDiscount &&
                                                        itemSavings > 0 && (
                                                            <div className="mt-1">
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                                    You save Rs.{" "}
                                                                    {itemSavings.toFixed(
                                                                        2,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        No items to display.
                                        <button
                                            onClick={() => navigate("/shop")}
                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                        >
                                            Continue Shopping
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-900">
                                    Invoice and Contact Info
                                </h4>
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-96 flex flex-col gap-6">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Order Summary
                            </h4>

                            <div className="flex flex-col gap-3">
                                {/* Show total savings if any */}
                                {orderSummary.totalSavings > 0 && (
                                    <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                                        <span className="text-green-700 font-medium">
                                            Total Savings
                                        </span>
                                        <span className="text-green-700 font-bold">
                                            -Rs.{" "}
                                            {orderSummary.totalSavings.toFixed(
                                                2,
                                            )}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                        Items Total ({orderSummary.itemCount}{" "}
                                        Items)
                                    </span>
                                    <span className="text-gray-900 font-medium">
                                        Rs. {orderSummary.itemsTotal.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                        Delivery Fee
                                    </span>
                                    <span className="text-gray-900 font-medium">
                                        Rs.{" "}
                                        {orderSummary.deliveryFee.toFixed(2)}
                                    </span>
                                </div>

                                <div className="border-t border-gray-200 pt-3 mt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900">
                                            Total:
                                        </span>
                                        <span className="text-lg font-semibold text-gray-900">
                                            Rs. {orderSummary.total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleProceedToPay}
                                disabled={
                                    displayItems.length === 0 || isProcessing
                                }
                                className={`w-full mt-6 ${
                                    displayItems.length === 0 || isProcessing
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700"
                                } text-white font-semibold py-3 px-4 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                            >
                                {isProcessing
                                    ? "Processing..."
                                    : displayItems.length === 0
                                      ? "No Items to Order"
                                      : "Confirm Order"}
                            </button>

                            {directBuyData && (
                                <p className="text-xs text-gray-500 text-center mt-3">
                                    This is a direct purchase. Item will not be
                                    added to your cart.
                                </p>
                            )}
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">
                                Enter Store Code
                            </h4>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={storeCode}
                                        onChange={(e) =>
                                            setStoreCode(e.target.value)
                                        }
                                        placeholder="Enter code"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleApplyStoreCode}
                                    className="flex-shrink-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <CompleteProfileModal
                isOpen={completeModal}
                onClose={() => setCompleteModal(false)}
            />
        </div>
    );
}

export default CheckOutUser;
