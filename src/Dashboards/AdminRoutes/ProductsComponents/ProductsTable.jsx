import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductRow from "./ProductRow";
import {
    Search,
    Filter,
    Eye,
    X,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Package,
    Trash2,
    Archive,
    RefreshCw,
} from "lucide-react";
import useToast from "../../../UserInterFaceComponents/Common/useToast.jsx";
import { ProductDetailsModal } from "./ProductDetailsModal.jsx";

const ProductsTable = ({ refreshTrigger }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { success, error: showError } = useToast();

    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 15,
        total: 0,
        last_page: 1,
        from: 0,
        to: 0,
    });

    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        minPrice: "",
        maxPrice: "",
        inStock: false,
        outOfStock: false,
    });

    const handleDeleteProduct = async (productId, productName) => {
        if (
            !window.confirm(
                `Are you sure you want to delete "${productName}"? This action can be undone.`,
            )
        ) {
            return;
        }

        try {
            const response = await axios.delete(
                `http://127.0.0.1:8000/api/products/${productId}`,
            );

            if (response.data.success) {
                setProducts((prevProducts) =>
                    prevProducts.filter((product) => product.id !== productId),
                );
                setPagination((prev) => ({
                    ...prev,
                    total: prev.total - 1,
                    from: Math.max(prev.from - 1, 1),
                    to: Math.max(prev.to - 1, 1),
                }));

                success(
                    `Product "${productName}" has been deleted successfully!`,
                );
            }
        } catch (error) {
            console.error("Failed to delete product:", error);
            if (error.response?.data?.message) {
                showError(error.response.data.message);
            } else {
                showError("Failed to delete product. Please try again.");
            }
        }
    };

    const handleStatusToggle = async (productId, newStatus) => {
        try {
            const response = await axios.patch(
                `http://127.0.0.1:8000/api/products/${productId}/status`,
                {
                    status: newStatus,
                },
            );

            if (response.data.success) {
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === productId
                            ? { ...product, status: newStatus }
                            : product,
                    ),
                );

                success(
                    `Product ${newStatus === "active" ? "activated" : "deactivated"} successfully!`,
                );
            }
        } catch (error) {
            console.error("Failed to toggle status:", error);
            showError("Failed to update product status. Please try again.");
            throw error;
        }
    };

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page,
                per_page: pagination.per_page,
                ...(filters.search && { search: filters.search }),
                ...(filters.status !== "all" && { status: filters.status }),
                ...(filters.minPrice && { min_price: filters.minPrice }),
                ...(filters.maxPrice && { max_price: filters.maxPrice }),
                ...(filters.inStock && { in_stock: true }),
                ...(filters.outOfStock && { availability: 0 }),
            });

            const response = await axios.get(
                `http://127.0.0.1:8000/api/products?${params}`,
            );

            if (response.data && response.data.data) {
                setProducts(response.data.data);
                setPagination(
                    response.data.pagination || {
                        current_page: response.data.page || 1,
                        per_page: response.data.per_page || 15,
                        total: response.data.total || 0,
                        last_page: response.data.last_page || 1,
                        from: response.data.from || 0,
                        to: response.data.to || 0,
                    },
                );
            } else if (Array.isArray(response.data)) {
                setProducts(response.data);
                setPagination((prev) => ({
                    ...prev,
                    total: response.data.length,
                }));
            } else {
                console.warn(
                    "Unexpected API response structure:",
                    response.data,
                );
                setProducts([]);
                setPagination((prev) => ({ ...prev, total: 0 }));
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setProducts([]);
            setPagination((prev) => ({ ...prev, total: 0 }));
            showError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(1);
    }, [refreshTrigger]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProducts(1);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [filters]);

    const handleImagesUpload = async (
        productId,
        itemCode,
        files,
        mainImageIndex = 0,
    ) => {
        if (files.length > 4) {
            showError("Maximum 4 images allowed!");
            return;
        }

        try {
            const uploadPromises = Array.from(files).map((file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "eSupport_Product");

                return axios.post(
                    "https://api.cloudinary.com/v1_1/dbn9uenrg/image/upload",
                    formData,
                );
            });

            const cloudinaryResponses = await Promise.all(uploadPromises);
            const imageUrls = cloudinaryResponses.map(
                (response) => response.data.secure_url,
            );

            const response = await axios.post(
                "http://127.0.0.1:8000/api/products/upload-images",
                {
                    product_id: productId,
                    item_code: itemCode,
                    image_urls: imageUrls,
                    main_image_index: mainImageIndex,
                },
            );

            success(`Successfully uploaded ${imageUrls.length} image(s)!`);
            fetchProducts(pagination.current_page);
            return response.data;
        } catch (error) {
            console.error("Upload failed:", error);

            let errorMessage = "Failed to upload images. ";

            if (error.response) {
                if (error.response.status === 404) {
                    errorMessage +=
                        "Product not found. It may have been deleted. Please refresh the page and try again.";
                } else if (error.response.data?.errors) {
                    const errorMessages = Object.values(
                        error.response.data.errors,
                    ).flat();
                    errorMessage += errorMessages.join(" ");
                } else if (error.response.data?.message) {
                    errorMessage += error.response.data.message;
                } else {
                    errorMessage += "Please try again later.";
                }
            } else if (error.request) {
                errorMessage +=
                    "No response from server. Please check your connection.";
            } else {
                errorMessage += error.message;
            }

            showError(errorMessage);
            throw error;
        }
    };

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            status: "all",
            minPrice: "",
            maxPrice: "",
            inStock: false,
            outOfStock: false,
        });
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.last_page) {
            fetchProducts(page);
        }
    };

    const handlePerPageChange = (perPage) => {
        setPagination((prev) => ({ ...prev, per_page: parseInt(perPage) }));
        setTimeout(() => fetchProducts(1), 100);
    };

    const generatePageNumbers = () => {
        const pages = [];
        const current = pagination.current_page;
        const last = pagination.last_page;
        const delta = 2;

        for (
            let i = Math.max(2, current - delta);
            i <= Math.min(last - 1, current + delta);
            i++
        ) {
            pages.push(i);
        }

        if (current - delta > 2) {
            pages.unshift("...");
        }
        if (current + delta < last - 1) {
            pages.push("...");
        }

        pages.unshift(1);
        if (last > 1) pages.push(last);

        return pages;
    };

    const isOutOfStock = (product) => {
        return (
            product.availability === 0 ||
            product.availability === "0" ||
            !product.availability
        );
    };

    const getStockStatusBadge = (product) => {
        if (isOutOfStock(product)) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 border border-red-200">
                    <Package className="w-3 h-3 mr-1" />
                    Out of Stock
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                    <Package className="w-3 h-3 mr-1" />
                    In Stock ({product.availability})
                </span>
            );
        }
    };

    const filteredProducts = Array.isArray(products) ? products : [];

    if (loading && products.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading products...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Product Catalog
                    </h2>
                    <div className="text-sm text-gray-600 mt-1">
                        Showing {pagination.from} to {pagination.to} of{" "}
                        {pagination.total} products
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchProducts(pagination.current_page)}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                        />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Product Filters
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Filter products by various criteria
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={filters.search}
                                onChange={(e) =>
                                    handleFilterChange("search", e.target.value)
                                }
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-48"
                            />
                        </div>

                        <select
                            value={filters.status}
                            onChange={(e) =>
                                handleFilterChange("status", e.target.value)
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="disabled">Disabled</option>
                        </select>

                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Min Price"
                                value={filters.minPrice}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "minPrice",
                                        e.target.value,
                                    )
                                }
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                            <input
                                type="number"
                                placeholder="Max Price"
                                value={filters.maxPrice}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "maxPrice",
                                        e.target.value,
                                    )
                                }
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>

                        <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={filters.inStock}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "inStock",
                                        e.target.checked,
                                    )
                                }
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                                In Stock
                            </span>
                        </label>

                        <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={filters.outOfStock}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "outOfStock",
                                        e.target.checked,
                                    )
                                }
                                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700">
                                Out of Stock
                            </span>
                        </label>

                        {(filters.search ||
                            filters.status !== "all" ||
                            filters.minPrice ||
                            filters.maxPrice ||
                            filters.inStock ||
                            filters.outOfStock) && (
                            <button
                                onClick={clearFilters}
                                className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {(filters.search ||
                filters.status !== "all" ||
                filters.minPrice ||
                filters.maxPrice ||
                filters.inStock ||
                filters.outOfStock) && (
                <div className="flex flex-wrap gap-2">
                    {filters.search && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            Search: "{filters.search}"
                        </span>
                    )}
                    {filters.status !== "all" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                            Status: {filters.status}
                        </span>
                    )}
                    {filters.minPrice && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Min: Rs. {filters.minPrice}
                        </span>
                    )}
                    {filters.maxPrice && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                            Max: Rs. {filters.maxPrice}
                        </span>
                    )}
                    {filters.inStock && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-teal-100 text-teal-800">
                            In Stock Only
                        </span>
                    )}
                    {filters.outOfStock && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            Out of Stock Only
                        </span>
                    )}
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Main Image
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                    All Images
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Item Code
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                    Model
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                    Stock Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Images
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Details
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <ProductRow
                                        key={product.id}
                                        product={product}
                                        onImagesUpload={handleImagesUpload}
                                        onViewDetails={handleViewDetails}
                                        onStatusToggle={handleStatusToggle}
                                        onDelete={handleDeleteProduct}
                                        getStockStatusBadge={
                                            getStockStatusBadge
                                        }
                                        isOutOfStock={isOutOfStock}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="11"
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <svg
                                                className="w-16 h-16 text-gray-300 mb-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                                />
                                            </svg>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                No products found
                                            </h3>
                                            <p className="text-gray-500">
                                                {pagination.total > 0
                                                    ? "No products match your current filters."
                                                    : "No products available in the system."}
                                            </p>
                                            {(filters.search ||
                                                filters.status !== "all" ||
                                                filters.minPrice ||
                                                filters.maxPrice ||
                                                filters.inStock ||
                                                filters.outOfStock) && (
                                                <button
                                                    onClick={clearFilters}
                                                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                >
                                                    Clear all filters
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.total > 0 && (
                    <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700">
                                    Show
                                </span>
                                <select
                                    value={pagination.per_page}
                                    onChange={(e) =>
                                        handlePerPageChange(e.target.value)
                                    }
                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <span className="text-sm text-gray-700">
                                    per page
                                </span>
                            </div>

                            <div className="text-sm text-gray-700">
                                Showing{" "}
                                <span className="font-medium">
                                    {pagination.from}
                                </span>{" "}
                                to{" "}
                                <span className="font-medium">
                                    {pagination.to}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium">
                                    {pagination.total}
                                </span>{" "}
                                results
                            </div>

                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={() => handlePageChange(1)}
                                    disabled={pagination.current_page === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </button>

                                <button
                                    onClick={() =>
                                        handlePageChange(
                                            pagination.current_page - 1,
                                        )
                                    }
                                    disabled={pagination.current_page === 1}
                                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>

                                {generatePageNumbers().map((page, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            typeof page === "number" &&
                                            handlePageChange(page)
                                        }
                                        disabled={page === "..."}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium min-w-[42px] justify-center ${
                                            page === pagination.current_page
                                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                        } ${page === "..." ? "cursor-default" : "cursor-pointer"}`}
                                    >
                                        {page === "..." ? "..." : page}
                                    </button>
                                ))}

                                <button
                                    onClick={() =>
                                        handlePageChange(
                                            pagination.current_page + 1,
                                        )
                                    }
                                    disabled={
                                        pagination.current_page ===
                                        pagination.last_page
                                    }
                                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>

                                <button
                                    onClick={() =>
                                        handlePageChange(pagination.last_page)
                                    }
                                    disabled={
                                        pagination.current_page ===
                                        pagination.last_page
                                    }
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showModal && selectedProduct && (
                <ProductDetailsModal
                    product={selectedProduct}
                    onClose={() => setShowModal(false)}
                    onDelete={handleDeleteProduct}
                    isOutOfStock={isOutOfStock(selectedProduct)}
                />
            )}
        </div>
    );
};

export default ProductsTable;
