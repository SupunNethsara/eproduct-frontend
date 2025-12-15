import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TopProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const themeColors = {
        primary: "#0866ff",
        primaryHover: "#0759e0",
        secondary: "#e3251b",
        secondaryHover: "#c91f16",
    };

    const defaultProducts = [
        {
            id: 1,
            title: "4K CCTV System",
            description: "4-camera setup with night vision",
            category: "HOME SECURITY",
            price: "Rs4299.99",
            original_price: "Rs4374.99",
            image: "/CCTV.png",
            button_text: "Secure Your Home",
            theme_color: "primary",
            is_active: true,
        },
        {
            id: 2,
            title: "Outdoor Camera",
            description: "Weatherproof & battery powered",
            category: "WIRELESS SOLUTION",
            price: "Rs3129.99",
            original_price: "Rs4159.99",
            image: "/cctv2.png",
            button_text: "Buy Now",
            theme_color: "secondary",
            is_active: true,
        },
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/top-products",
                {
                    timeout: 5000,
                },
            );

            if (response.data && Array.isArray(response.data)) {
                const activeProducts = response.data.filter(
                    (product) => product.is_active,
                );
                if (activeProducts.length > 0) {
                    setProducts(activeProducts);
                } else {
                    setProducts(defaultProducts);
                }
            } else {
                setProducts(defaultProducts);
            }
        } catch (error) {
            console.error("Error fetching top products:", error);
            setProducts(defaultProducts);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-4 sm:gap-6 lg:h-[500px]">
                {[1, 2].map((item) => (
                    <div
                        key={item}
                        className="relative bg-white rounded-2xl shadow-xl border border-gray-100 flex overflow-hidden h-[200px] sm:h-[240px]"
                    >
                        <div
                            className="w-1/2 flex items-center justify-center p-3 sm:p-4 animate-pulse"
                            style={{
                                backgroundColor: `${themeColors.primary}10`,
                            }}
                        >
                            <div className="w-full h-full flex items-center justify-center">
                                <div
                                    className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-300 rounded-2xl flex items-center justify-center"
                                    style={{
                                        backgroundColor: `${themeColors.primary}15`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="w-1/2 flex flex-col justify-center p-4 sm:p-6 space-y-3">
                            <div
                                className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"
                                style={{
                                    backgroundColor: `${themeColors.primary}20`,
                                }}
                            ></div>
                            <div className="space-y-2">
                                <div
                                    className="h-6 bg-gray-300 rounded w-3/4 animate-pulse"
                                    style={{
                                        backgroundColor: `${themeColors.primary}25`,
                                    }}
                                ></div>
                                <div
                                    className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"
                                    style={{
                                        backgroundColor: `${themeColors.primary}20`,
                                    }}
                                ></div>
                            </div>

                            <div
                                className="h-3 bg-gray-300 rounded w-full animate-pulse hidden sm:block"
                                style={{
                                    backgroundColor: `${themeColors.primary}15`,
                                }}
                            ></div>
                            <div
                                className="h-3 bg-gray-300 rounded w-2/3 animate-pulse hidden sm:block"
                                style={{
                                    backgroundColor: `${themeColors.primary}15`,
                                }}
                            ></div>

                            <div className="flex items-center gap-2 mt-1">
                                <div
                                    className="h-7 w-20 bg-gray-300 rounded animate-pulse"
                                    style={{
                                        backgroundColor: `${themeColors.primary}25`,
                                    }}
                                ></div>
                                <div
                                    className="h-5 w-16 bg-gray-300 rounded animate-pulse hidden sm:block"
                                    style={{
                                        backgroundColor: `${themeColors.primary}15`,
                                    }}
                                ></div>
                            </div>
                            <div
                                className="h-10 w-full bg-gray-300 rounded-lg animate-pulse mt-2"
                                style={{
                                    backgroundColor: `${themeColors.primary}30`,
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col gap-4 sm:gap-6 lg:h-[500px]">
                <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center h-[200px] sm:h-[240px]">
                    <div className="text-center text-gray-500">
                        <div className="flex justify-center mb-3">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{
                                    backgroundColor: `${themeColors.primary}10`,
                                }}
                            >
                                <svg
                                    className="w-6 h-6"
                                    style={{ color: themeColors.primary }}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                    />
                                </svg>
                            </div>
                        </div>
                        <p className="text-lg font-medium mb-2">
                            No products available
                        </p>
                        <p className="text-sm">Please check your admin panel</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 sm:gap-6 lg:h-[500px]">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="relative bg-white rounded-2xl shadow-xl border border-gray-100 flex overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] h-[200px] sm:h-[240px]"
                >
                    <div
                        className="w-1/2 flex items-center justify-center p-3 sm:p-4"
                        style={{
                            backgroundColor:
                                product.theme_color === "primary"
                                    ? `${themeColors.primary}10`
                                    : `${themeColors.secondary}10`,
                        }}
                    >
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-contain drop-shadow-xl group-hover:scale-[1.1] transition-transform duration-500"
                            onError={(e) => {
                                console.error(
                                    "Image failed to load:",
                                    product.image,
                                );
                                if (product.image.includes("CCTV.png")) {
                                    e.target.src = "/CCTV.png";
                                } else if (
                                    product.image.includes("cctv2.png")
                                ) {
                                    e.target.src = "/cctv2.png";
                                } else {
                                    e.target.src =
                                        "https://via.placeholder.com/200x200?text=Image+Not+Found";
                                }
                            }}
                        />
                    </div>

                    <div className="w-1/2 flex flex-col justify-center p-4 sm:p-6 space-y-1 sm:space-y-2">
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">
                            {product.category}
                        </p>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                            {product.title}
                        </h2>
                        <p className="text-xs text-gray-600 hidden sm:block">
                            {product.description}
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                            <p
                                className="text-lg sm:text-xl font-extrabold leading-none"
                                style={{
                                    color:
                                        product.theme_color === "primary"
                                            ? themeColors.primary
                                            : themeColors.secondary,
                                }}
                            >
                                {product.price}
                            </p>
                            {product.original_price && (
                                <p className="text-sm text-gray-400 line-through hidden sm:block">
                                    {product.original_price}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={() => navigate("/shop")}
                            className="mt-2 sm:mt-3 w-full text-xs sm:text-sm font-semibold text-white py-2 rounded-lg transition-all duration-300 shadow-md hover:scale-105 active:scale-95"
                            style={{
                                backgroundColor:
                                    product.theme_color === "primary"
                                        ? themeColors.primary
                                        : themeColors.secondary,
                            }}
                            onMouseOver={(e) =>
                                (e.target.style.backgroundColor =
                                    product.theme_color === "primary"
                                        ? themeColors.primaryHover
                                        : themeColors.secondaryHover)
                            }
                            onMouseOut={(e) =>
                                (e.target.style.backgroundColor =
                                    product.theme_color === "primary"
                                        ? themeColors.primary
                                        : themeColors.secondary)
                            }
                        >
                            {product.button_text}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TopProduct;
