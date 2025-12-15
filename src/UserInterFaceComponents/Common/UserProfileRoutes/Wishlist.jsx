// components/Wishlist.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import useToast from "../useToast.jsx";

function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [removingItem, setRemovingItem] = useState(null);
    const [addingToCart, setAddingToCart] = useState(null);
    const token = localStorage.getItem("token");
    const { success, error: showError } = useToast();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                "http://127.0.0.1:8000/api/wishlist",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setWishlistItems(response.data.items || []);
        } catch (error) {
            console.error(
                "Error fetching wishlist:",
                error.response?.data || error.message
            );
            const errorMessage =
                error.response?.data?.message || "Failed to load wishlist";
            setError(errorMessage);
            showError(errorMessage, "Wishlist Error");
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        setRemovingItem(productId);
        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/wishlist/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setWishlistItems(prev =>
                prev.filter(item => item.product.id !== productId)
            );
            success("Item removed from wishlist");
        } catch (error) {
            console.error(
                "Error removing from wishlist:",
                error.response?.data || error.message
            );
            const errorMessage =
                error.response?.data?.message || "Failed to remove item";
            showError(errorMessage, "Remove Failed");
        } finally {
            setRemovingItem(null);
        }
    };

    const addToCartFromWishlist = async (product) => {
        setAddingToCart(product.id);
        try {
            await axios.post(
                "http://127.0.0.1:8000/api/cart",
                {
                    product_id: product.id,
                    quantity: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            success("Product added to cart from wishlist!");

            // Optionally remove from wishlist after adding to cart
            // removeFromWishlist(product.id);
        } catch (error) {
            console.error(
                "Error adding to cart:",
                error.response?.data || error.message
            );
            const errorMessage =
                error.response?.data?.message || "Failed to add to cart";
            showError(errorMessage, "Add to Cart Failed");
        } finally {
            setAddingToCart(null);
        }
    };

    const moveAllToCart = async () => {
        try {
            await axios.post(
                "http://127.0.0.1:8000/api/wishlist/move-all-to-cart",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setWishlistItems([]);
            success("All items moved to cart successfully!");
        } catch (error) {
            console.error(
                "Error moving items to cart:",
                error.response?.data || error.message
            );
            const errorMessage =
                error.response?.data?.message || "Failed to move items to cart";
            showError(errorMessage, "Move Failed");
        }
    };

    const clearWishlist = async () => {
        if (!window.confirm("Are you sure you want to clear your entire wishlist?")) {
            return;
        }

        try {
            await axios.delete("http://127.0.0.1:8000/api/wishlist/clear", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setWishlistItems([]);
            success("Wishlist cleared successfully");
        } catch (error) {
            console.error(
                "Error clearing wishlist:",
                error.response?.data || error.message
            );
            const errorMessage =
                error.response?.data?.message || "Failed to clear wishlist";
            showError(errorMessage, "Clear Failed");
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error && wishlistItems.length === 0) {
        return (
            <div className="p-8 text-center">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchWishlist}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
                    <p className="text-gray-600 mt-1">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>

                {wishlistItems.length > 0 && (
                    <div className="flex gap-3">
                        <button
                            onClick={moveAllToCart}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                        >
                            <ShoppingCart size={16} />
                            Move All to Cart
                        </button>
                        <button
                            onClick={clearWishlist}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                        >
                            <Trash2 size={16} />
                            Clear All
                        </button>
                    </div>
                )}
            </div>

            {wishlistItems.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Your wishlist is empty
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Save items you love to your wishlist. Review them anytime and easily move them to your cart.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="relative">
                                <img
                                    src={item.product.image || "/images/placeholder-product.png"}
                                    alt={item.product.name}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.target.src = "/images/placeholder-product.png";
                                    }}
                                />
                                <button
                                    onClick={() => removeFromWishlist(item.product.id)}
                                    disabled={removingItem === item.product.id}
                                    className="absolute top-3 right-3 bg-white/90 text-red-600 p-2 rounded-full hover:bg-white transition-colors disabled:opacity-50"
                                    title="Remove from wishlist"
                                >
                                    {removingItem === item.product.id ? (
                                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Heart size={16} className="fill-current" />
                                    )}
                                </button>
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                                    {item.product.name}
                                </h3>

                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-lg font-bold text-gray-900">
                                        Rs. {parseFloat(item.product.buy_now_price || item.product.price).toLocaleString()}
                                    </span>
                                    {item.product.original_price > item.product.buy_now_price && (
                                        <span className="text-sm text-gray-500 line-through">
                                            Rs. {parseFloat(item.product.original_price).toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => addToCartFromWishlist(item.product)}
                                        disabled={addingToCart === item.product.id || item.product.availability === 0}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                    >
                                        {addingToCart === item.product.id ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart size={16} />
                                                {item.product.availability === 0 ? 'Out of Stock' : 'Add to Cart'}
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => removeFromWishlist(item.product.id)}
                                        disabled={removingItem === item.product.id}
                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                        title="Remove"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {item.product.availability > 0 && (
                                    <p className="text-xs text-green-600 mt-2">
                                        {item.product.availability} in stock
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Wishlist;
