import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Star, Eye, ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [ratingData, setRatingData] = useState({
        average_rating: 0,
        total_reviews: 0,
    });
    const [viewCount, setViewCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const colors = {
        primary: "#2563eb",
        primaryHover: "#1d4ed8",
        secondary: "#dc2626",
        secondaryHover: "#b91c1c",
        accent: "#059669",
        accentHover: "#047857",
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#1e293b",
        textLight: "#64748b",
        border: "#e2e8f0",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
    };

    const handleBuyClick = async () => {
        await trackProductView();
        navigate("/productDetails", { state: { product } });
    };

    const trackProductView = async () => {
        try {
            const token =
                localStorage.getItem("token") ||
                localStorage.getItem("auth_token");
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
            await fetch(
                `http://127.0.0.1:8000/api/products/${product.id}/track-view`,
                {
                    method: "POST",
                    headers: headers,
                    credentials: "include",
                },
            );
        } catch (error) {
            console.error("Network error tracking view:", error);
        }
    };

    const fetchRatingData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://127.0.0.1:8000/api/products/${product.id}/rating-summary`,
            );

            if (response.ok) {
                const data = await response.json();
                setRatingData({
                    average_rating: data.average_rating || 0,
                    total_reviews: data.total_reviews || 0,
                });
            }
        } catch (error) {
            console.error("Failed to fetch rating data:", error);
            setRatingData({
                average_rating: product.average_rating || 0,
                total_reviews: product.reviews_count || 0,
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchViewStats = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/products/${product.id}/view-stats`,
            );
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setViewCount(data.data.total_views || 0);
                }
            }
        } catch (error) {
            console.error("Failed to fetch view stats:", error);
        }
    };

    useEffect(() => {
        fetchRatingData();
        fetchViewStats();
    }, [product.id]);

    const isOutOfStock =
        product.status === "disabled" || product.availability === 0;

    return (
        <div
            className="bg-white border rounded-xl hover:shadow-xl transition-all duration-300 group overflow-hidden h-full flex flex-col"
            style={{
                borderColor: colors.border,
                backgroundColor: colors.background,
            }}
        >
            <div className="relative p-4 pb-0 flex-1">
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-slate-100">
                    <img
                        src={
                            product.image ||
                            `https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop&auto=format&q=80`
                        }
                        alt={product.name}
                        className="w-full h-40 sm:h-44 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                        className="absolute top-3 right-3 text-white px-2.5 py-1.5 text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-sm"
                        style={{ backgroundColor: "rgba(30, 41, 59, 0.8)" }}
                    >
                        <Eye size={12} />
                        <span className="text-xs">{viewCount}</span>
                    </div>

                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center rounded-lg">
                            <div
                                className="text-white px-4 py-2 text-sm font-bold rounded-full"
                                style={{ backgroundColor: colors.error }}
                            >
                                Out of Stock
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 pt-3 flex flex-col flex-1">
                <h3
                    className="text-sm font-semibold mb-3 line-clamp-2 leading-tight flex-1"
                    style={{ color: colors.text }}
                >
                    {product.name} - {product.category_2} {product.category_3}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div
                                className="flex items-center px-2 py-1 rounded-full text-xs font-bold animate-pulse"
                                style={{ backgroundColor: colors.border }}
                            >
                                <span className="text-transparent">0.0</span>
                                <Star
                                    size={12}
                                    className="ml-1 text-transparent"
                                />
                            </div>
                            <span
                                className="text-xs animate-pulse"
                                style={{ color: colors.border }}
                            >
                                (0)
                            </span>
                        </div>
                    ) : (
                        <>
                            <div
                                className="flex items-center text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm"
                                style={{
                                    backgroundColor:
                                        ratingData.average_rating >= 4
                                            ? colors.success
                                            : colors.warning,
                                }}
                            >
                                <span>
                                    {ratingData.average_rating.toFixed(1)}
                                </span>
                                <Star size={12} className="ml-1 fill-current" />
                            </div>
                            <span
                                className="text-xs"
                                style={{ color: colors.textLight }}
                            >
                                ({ratingData.total_reviews} reviews)
                            </span>
                        </>
                    )}
                </div>

                <div className="mb-4 space-y-2">
                    <div className="flex items-baseline gap-2">
                        <span
                            className="text-lg font-bold"
                            style={{ color: colors.primary }}
                        >
                            Rs. {product.buy_now_price}
                        </span>
                        <span
                            className="text-sm line-through"
                            style={{ color: colors.textLight }}
                        >
                            Rs. {product.price}
                        </span>
                    </div>

                    <div className="text-xs font-medium">
                        <span
                            style={{
                                color: isOutOfStock
                                    ? colors.error
                                    : colors.success,
                            }}
                        >
                            {isOutOfStock
                                ? "Out of stock"
                                : `${product.availability} pieces available`}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleBuyClick}
                    disabled={isOutOfStock}
                    className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 mt-auto ${
                        !isOutOfStock
                            ? "text-white hover:shadow-lg transform hover:scale-105 active:scale-95"
                            : "cursor-not-allowed"
                    }`}
                    style={{
                        backgroundColor: !isOutOfStock
                            ? colors.primary
                            : colors.border,
                        color: !isOutOfStock ? "white" : colors.textLight,
                    }}
                    onMouseOver={(e) => {
                        if (!isOutOfStock) {
                            e.target.style.backgroundColor =
                                colors.primaryHover;
                        }
                    }}
                    onMouseOut={(e) => {
                        if (!isOutOfStock) {
                            e.target.style.backgroundColor = colors.primary;
                        }
                    }}
                >
                    {isOutOfStock ? (
                        "Out of Stock"
                    ) : (
                        <>
                            <ShoppingCart size={16} />
                            <span>BUY NOW</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
