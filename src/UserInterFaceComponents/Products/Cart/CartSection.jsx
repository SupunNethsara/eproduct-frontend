import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import {
    updateCartItem,
    removeFromCart,
    clearError,
    fetchCartItems,
} from "../../../Store/slices/cartSlice.js";
import ConfirmationModal from "../../Common/ConfirmationModal.jsx";

function CartSection() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, loading, error, totalItems, totalPrice } = useSelector(
        (state) => state.cart,
    );
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedItemName, setSelectedItemName] = useState("");

    const getProductPrice = (product) => {
        return parseFloat(product?.buy_now_price || product?.price || 0);
    };

    const hasDiscount = (product) => {
        return (
            product?.buy_now_price &&
            product?.price &&
            parseFloat(product.buy_now_price) < parseFloat(product.price)
        );
    };

    const getProductSavings = (product, quantity = 1) => {
        if (!hasDiscount(product)) return 0;
        const originalPrice = parseFloat(product.price);
        const discountedPrice = parseFloat(product.buy_now_price);
        return (originalPrice - discountedPrice) * quantity;
    };

    const calculateTotalSavings = () => {
        return items.reduce((total, item) => {
            return total + getProductSavings(item.product, item.quantity);
        }, 0);
    };

    const totalSavings = calculateTotalSavings();
    const discount = 0;
    const shippingFee = 0;
    const grandTotal = totalPrice + shippingFee;

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCartItems());
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        if (error) {
            alert(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            await dispatch(
                updateCartItem({
                    id: itemId,
                    quantity: newQuantity,
                }),
            ).unwrap();
        } catch (error) {
            alert(error || "Failed to update quantity");
        }
    };

    const handleRemoveItem = (itemId, itemName) => {
        setSelectedItemId(itemId);
        setSelectedItemName(itemName);
        setShowRemoveConfirm(true);
    };

    const confirmRemoveItem = async () => {
        try {
            await dispatch(removeFromCart(selectedItemId)).unwrap();
        } catch (error) {
            alert(error || "Failed to remove item");
        } finally {
            setSelectedItemId(null);
            setSelectedItemName("");
        }
    };

    const handleProceedToCheckout = () => {
        if (items.length === 0) {
            alert("Your cart is empty");
            return;
        }
        navigate("/checkout");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <ShoppingBag
                        size={64}
                        className="mx-auto text-gray-400 mb-4"
                    />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Please Login
                    </h2>
                    <p className="text-gray-600 mb-6">
                        You need to be logged in to view your cart
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Login Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-2">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Shopping Cart
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                {totalItems} items
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/")}
                            className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>

                    {items.length === 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <ShoppingBag
                                size={64}
                                className="mx-auto text-gray-400 mb-4"
                            />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Your cart is empty
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Add some products to your cart to see them here
                            </p>
                            <button
                                onClick={() => navigate("/shop")}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg border border-gray-200">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h2 className="font-semibold text-gray-900">
                                            Cart Items
                                        </h2>
                                    </div>

                                    <div className="divide-y divide-gray-200">
                                        {items.map((item) => {
                                            const productPrice =
                                                getProductPrice(item.product);
                                            const itemTotal =
                                                productPrice * item.quantity;
                                            const productHasDiscount =
                                                hasDiscount(item.product);
                                            const itemSavings =
                                                getProductSavings(
                                                    item.product,
                                                    item.quantity,
                                                );

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="p-6 hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex gap-4">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border">
                                                                <img
                                                                    src={
                                                                        item
                                                                            .product
                                                                            .image ||
                                                                        "/placeholder-image.jpg"
                                                                    }
                                                                    alt={
                                                                        item
                                                                            .product
                                                                            .name
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex-1">
                                                                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                                                        {
                                                                            item
                                                                                .product
                                                                                .name
                                                                        }
                                                                    </h3>
                                                                    <p className="text-gray-500 text-xs mb-1">
                                                                        {
                                                                            item
                                                                                .product
                                                                                .model
                                                                        }
                                                                    </p>
                                                                    <div className="flex items-center gap-2">
                                                                        {productHasDiscount && (
                                                                            <span className="text-gray-500 text-sm line-through">
                                                                                Rs.{" "}
                                                                                {parseFloat(
                                                                                    item
                                                                                        .product
                                                                                        .price,
                                                                                ).toLocaleString()}
                                                                            </span>
                                                                        )}
                                                                        <p
                                                                            className={`font-semibold ${
                                                                                productHasDiscount
                                                                                    ? "text-green-600"
                                                                                    : "text-green-600"
                                                                            }`}
                                                                        >
                                                                            Rs.{" "}
                                                                            {productPrice.toLocaleString()}
                                                                        </p>
                                                                    </div>
                                                                    {productHasDiscount &&
                                                                        itemSavings >
                                                                            0 && (
                                                                            <div className="mt-1">
                                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                                                    You
                                                                                    save
                                                                                    Rs.{" "}
                                                                                    {itemSavings.toLocaleString()}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                </div>
                                                                <button
                                                                    onClick={() =>
                                                                        handleRemoveItem(
                                                                            item.id,
                                                                            item
                                                                                .product
                                                                                .name,
                                                                        )
                                                                    }
                                                                    className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded hover:bg-red-50"
                                                                    disabled={
                                                                        loading
                                                                    }
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>

                                                            <div className="flex items-center justify-between mt-4">
                                                                <div className="flex items-center border border-gray-300 rounded">
                                                                    <div className="flex items-center gap-2 mt-3">
                                                                        <button
                                                                            onClick={() =>
                                                                                handleQuantityChange(
                                                                                    item.id,
                                                                                    item.quantity -
                                                                                        1,
                                                                                )
                                                                            }
                                                                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                                                            disabled={
                                                                                item.quantity <=
                                                                                1
                                                                            }
                                                                        >
                                                                            <Minus
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </button>
                                                                        <span className="w-8 text-center">
                                                                            {
                                                                                item.quantity
                                                                            }
                                                                        </span>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleQuantityChange(
                                                                                    item.id,
                                                                                    item.quantity +
                                                                                        1,
                                                                                )
                                                                            }
                                                                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                                                        >
                                                                            <Plus
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-semibold text-gray-900">
                                                                        Rs.{" "}
                                                                        {itemTotal.toLocaleString()}
                                                                    </p>
                                                                    {item.quantity >
                                                                        1 && (
                                                                        <p className="text-gray-500 text-xs">
                                                                            Rs.{" "}
                                                                            {productPrice.toLocaleString()}{" "}
                                                                            each
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg border border-gray-200 sticky top-6">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h2 className="font-semibold text-gray-900">
                                            Order Summary
                                        </h2>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div className="space-y-3 pt-4 border-t border-gray-200">
                                            {totalSavings > 0 && (
                                                <div className="flex justify-between bg-green-50 p-3 rounded-lg">
                                                    <span className="text-green-700 font-medium">
                                                        Total Savings
                                                    </span>
                                                    <span className="text-green-700 font-bold">
                                                        - Rs.{" "}
                                                        {totalSavings.toLocaleString()}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex justify-between text-gray-600">
                                                <span>
                                                    Subtotal ({totalItems}{" "}
                                                    items)
                                                </span>
                                                <span>
                                                    Rs.{" "}
                                                    {totalPrice.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Shipping</span>
                                                <span className="text-green-600">
                                                    Free
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Tax</span>
                                                <span>Rs. 0</span>
                                            </div>
                                            {discount > 0 && (
                                                <div className="flex justify-between text-green-600">
                                                    <span>Discount</span>
                                                    <span>
                                                        - Rs.{" "}
                                                        {discount.toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between font-bold text-lg text-gray-900 pt-3 border-t border-gray-200">
                                                <span>Total</span>
                                                <span>
                                                    Rs.{" "}
                                                    {grandTotal.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        {totalSavings > 0 && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                <p className="text-green-700 text-sm text-center">
                                                    🎉 You're saving{" "}
                                                    <strong>
                                                        Rs.{" "}
                                                        {totalSavings.toLocaleString()}
                                                    </strong>{" "}
                                                    on this order!
                                                </p>
                                            </div>
                                        )}

                                        <button
                                            onClick={handleProceedToCheckout}
                                            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors mt-4"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={showRemoveConfirm}
                onClose={() => setShowRemoveConfirm(false)}
                onConfirm={confirmRemoveItem}
                title="Remove Item from Cart"
                message={`Are you sure you want to remove "${selectedItemName}" from your cart?`}
                confirmText="Remove"
                cancelText="Keep Item"
                type="danger"
            />
        </>
    );
}

export default CartSection;
