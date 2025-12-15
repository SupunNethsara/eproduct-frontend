import ProductCard from "../Products/ProductCard.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, Search, Filter, X } from "lucide-react";
import { Link } from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("featured");
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        status: "all",
        price: "all",
    });

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

    useEffect(() => {
        const getProductHome = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/products/home",
                );
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        getProductHome();
    }, []);

    useEffect(() => {
        let result = products;

        if (searchTerm) {
            result = result.filter(
                (product) =>
                    product.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    product.model
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
            );
        }

        if (activeFilters.status === "in_stock") {
            result = result.filter(
                (p) => p.availability > 0 && p.status !== "disabled",
            );
        }

        if (activeFilters.price === "under_50") {
            result = result.filter((p) => parseFloat(p.price) < 50);
        } else if (activeFilters.price === "50_200") {
            result = result.filter(
                (p) => parseFloat(p.price) >= 50 && parseFloat(p.price) <= 200,
            );
        }
        switch (sortBy) {
            case "price_low":
                result = [...result].sort(
                    (a, b) => parseFloat(a.price) - parseFloat(b.price),
                );
                break;
            case "price_high":
                result = [...result].sort(
                    (a, b) => parseFloat(b.price) - parseFloat(a.price),
                );
                break;
            case "name":
                result = [...result].sort((a, b) =>
                    a.name.localeCompare(b.name),
                );
                break;
            case "featured":
            default:
                break;
        }

        setFilteredProducts(result);
    }, [searchTerm, sortBy, products, activeFilters]);

    const clearSearch = () => {
        setSearchTerm("");
    };

    const clearAllFilters = () => {
        setSearchTerm("");
        setActiveFilters({ status: "all", price: "all" });
        setSortBy("featured");
    };

    const handleStatusFilter = (status) => {
        setActiveFilters((prev) => ({
            ...prev,
            status: status,
        }));
    };

    const handlePriceFilter = (price) => {
        setActiveFilters((prev) => ({
            ...prev,
            price: price,
        }));
    };

    const hasActiveFilters =
        searchTerm ||
        activeFilters.status !== "all" ||
        activeFilters.price !== "all";

    return (
        <div className="max-w-10/12 mx-auto py-12  ">
            <div className="mb-12">
                <div
                    className="bg-white rounded-2xl shadow-sm border p-6"
                    style={{ borderColor: colors.border }}
                >
                    <div className="lg:hidden mb-6">
                        <button
                            onClick={() =>
                                setShowMobileFilters(!showMobileFilters)
                            }
                            className="flex items-center gap-3 w-full justify-center px-6 py-4 rounded-xl transition-all duration-300 hover:shadow-md"
                            style={{
                                backgroundColor: colors.primary,
                                color: "white",
                            }}
                        >
                            <Filter size={20} />
                            <span className="font-medium">Filters & Sort</span>
                            <ChevronDown
                                size={18}
                                className={`transform transition-transform duration-300 ${showMobileFilters ? "rotate-180" : ""}`}
                            />
                        </button>
                    </div>

                    <div
                        className={`${showMobileFilters ? "block" : "hidden"} lg:block space-y-6 lg:space-y-0`}
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex flex-col sm:flex-row gap-6 flex-wrap">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                    <span
                                        className="text-sm font-medium whitespace-nowrap"
                                        style={{ color: colors.text }}
                                    >
                                        Status:
                                    </span>
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={() =>
                                                handleStatusFilter("all")
                                            }
                                            className={`px-4 py-2.5 text-sm rounded-lg transition-all duration-300 ${
                                                activeFilters.status === "all"
                                                    ? "text-white shadow-md"
                                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                            }`}
                                            style={
                                                activeFilters.status === "all"
                                                    ? {
                                                          backgroundColor:
                                                              colors.primary,
                                                      }
                                                    : {}
                                            }
                                        >
                                            All Products
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleStatusFilter("in_stock")
                                            }
                                            className={`px-4 py-2.5 text-sm rounded-lg transition-all duration-300 ${
                                                activeFilters.status ===
                                                "in_stock"
                                                    ? "text-white shadow-md"
                                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                            }`}
                                            style={
                                                activeFilters.status ===
                                                "in_stock"
                                                    ? {
                                                          backgroundColor:
                                                              colors.success,
                                                      }
                                                    : {}
                                            }
                                        >
                                            In Stock
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                    <span
                                        className="text-sm font-medium whitespace-nowrap"
                                        style={{ color: colors.text }}
                                    >
                                        Price:
                                    </span>
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={() =>
                                                handlePriceFilter("all")
                                            }
                                            className={`px-4 py-2.5 text-sm rounded-lg transition-all duration-300 ${
                                                activeFilters.price === "all"
                                                    ? "text-white shadow-md"
                                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                            }`}
                                            style={
                                                activeFilters.price === "all"
                                                    ? {
                                                          backgroundColor:
                                                              colors.primary,
                                                      }
                                                    : {}
                                            }
                                        >
                                            All Prices
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center gap-3">
                                    <span
                                        className="text-sm font-medium whitespace-nowrap"
                                        style={{ color: colors.text }}
                                    >
                                        Sort by:
                                    </span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(e.target.value)
                                        }
                                        className="px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:border-transparent bg-white min-w-[160px] transition-all duration-300"
                                        style={{
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <option value="featured">
                                            Featured
                                        </option>
                                        <option value="price_low">
                                            Price: Low to High
                                        </option>
                                        <option value="price_high">
                                            Price: High to Low
                                        </option>
                                        <option value="name">Name A-Z</option>
                                    </select>
                                </div>

                                <div className="relative w-full sm:w-64">
                                    <Search
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2"
                                        size={20}
                                        style={{ color: colors.textLight }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="w-full pl-12 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300"
                                        style={{
                                            borderColor: colors.border,
                                        }}
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={clearSearch}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200"
                                            style={{ color: colors.textLight }}
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <div
                                className="pt-4 border-t"
                                style={{ borderColor: colors.border }}
                            >
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span
                                        className="text-sm"
                                        style={{ color: colors.textLight }}
                                    >
                                        Active filters:
                                    </span>
                                    {searchTerm && (
                                        <span
                                            className="px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-200"
                                            style={{
                                                backgroundColor: `${colors.primary}15`,
                                                color: colors.primary,
                                            }}
                                        >
                                            Search: "{searchTerm}"
                                            <button
                                                onClick={clearSearch}
                                                className="hover:opacity-70 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    )}
                                    {activeFilters.status !== "all" && (
                                        <span
                                            className="px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-200"
                                            style={{
                                                backgroundColor: `${colors.success}15`,
                                                color: colors.success,
                                            }}
                                        >
                                            {activeFilters.status === "in_stock"
                                                ? "In Stock"
                                                : "All"}
                                            <button
                                                onClick={() =>
                                                    handleStatusFilter("all")
                                                }
                                                className="hover:opacity-70 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    )}
                                    {activeFilters.price !== "all" && (
                                        <span
                                            className="px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-200"
                                            style={{
                                                backgroundColor: `${colors.secondary}15`,
                                                color: colors.secondary,
                                            }}
                                        >
                                            {activeFilters.price === "under_50"
                                                ? "Under Rs50"
                                                : "Rs50-Rs200"}
                                            <button
                                                onClick={() =>
                                                    handlePriceFilter("all")
                                                }
                                                className="hover:opacity-70 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    )}
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm underline transition-colors duration-200 ml-2"
                                        style={{ color: colors.textLight }}
                                    >
                                        Clear all
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-gray-100 animate-pulse rounded-2xl h-80"
                            style={{ backgroundColor: colors.surface }}
                        ></div>
                    ))}
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div
                    className="text-center py-16 rounded-2xl"
                    style={{ backgroundColor: colors.surface }}
                >
                    <div
                        className="text-6xl mb-4"
                        style={{ color: colors.textLight }}
                    >
                        🔍
                    </div>
                    <h3
                        className="text-2xl font-bold mb-3"
                        style={{ color: colors.text }}
                    >
                        No products found
                    </h3>
                    <p
                        className="mb-6 max-w-md mx-auto"
                        style={{ color: colors.textLight }}
                    >
                        We couldn't find any products matching your criteria.
                        Try adjusting your search or filters.
                    </p>
                    <button
                        onClick={clearAllFilters}
                        className="px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
                        style={{
                            backgroundColor: colors.primary,
                            color: "white",
                        }}
                    >
                        Show All Products
                    </button>
                </div>
            )}

            <div className="mt-16 flex justify-center">
                <Link
                    to="/shop"
                    className="inline-flex items-center justify-center text-sm font-semibold transition-all duration-300 rounded-xl px-8 py-4 min-w-[200px] border-2 hover:shadow-lg transform hover:-translate-y-0.5"
                    style={{
                        color: colors.primary,
                        borderColor: colors.primary,
                        backgroundColor: "transparent",
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = colors.primary;
                        e.target.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = colors.primary;
                    }}
                >
                    View All Products
                    <ChevronDown
                        className="ml-2 transform -rotate-90"
                        size={20}
                    />
                </Link>
            </div>
        </div>
    );
};

export default Products;
