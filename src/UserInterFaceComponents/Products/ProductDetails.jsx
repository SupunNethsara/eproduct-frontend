import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    ArrowLeft,
    ShoppingCart,
    Heart,
    Share2,
    Star,
    Truck,
    Shield,
    Check,
    AlertCircle,
    ZoomIn,
    ChevronLeft,
    ChevronRight,
    Plus,
} from "lucide-react";
import { openLoginModal } from "../../Store/slices/modalSlice.js";
import { addToCart } from "../../Store/slices/cartSlice.js";
import useToast from "../Common/useToast.jsx";
import ReviewForm from "./Reviews/ReviewForm.jsx";
import RatingSummary from "./Reviews/RatingSummary.jsx";
import ReviewsList from "./Reviews/ReviewsList.jsx";

const groupSpecifications = (specs) => {
    const groups = {
        general: {},
        technical: {},
        features: {},
        dimensions: {},
        warranty: {},
    };
    const categoryKeywords = {
        technical: [
            "processor",
            "ram",
            "storage",
            "battery",
            "display",
            "camera",
            "os",
            "connectivity",
            "speed",
            "resolution",
            "capacity",
        ],
        dimensions: [
            "weight",
            "size",
            "dimension",
            "height",
            "width",
            "depth",
            "length",
            "thickness",
        ],
        features: [
            "feature",
            "color",
            "material",
            "waterproof",
            "wireless",
            "bluetooth",
            "wifi",
            "nfc",
            "gps",
        ],
        warranty: ["warranty", "guarantee", "support", "service"],
    };

    Object.entries(specs).forEach(([key, value]) => {
        const lowerKey = key.toLowerCase();
        let assigned = false;
        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            if (keywords.some((keyword) => lowerKey.includes(keyword))) {
                groups[category][key] = value;
                assigned = true;
                break;
            }
        }
        if (!assigned) {
            groups.general[key] = value;
        }
    });
    return Object.fromEntries(
        Object.entries(groups).filter(
            ([, categorySpecs]) => Object.keys(categorySpecs).length > 0,
        ),
    );
};

const formatSpecificationKey = (key) => {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
        .trim();
};

const renderSpecificationValue = (value) => {
    if (typeof value === "boolean") {
        return value ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Yes
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                No
            </span>
        );
    }

    if (Array.isArray(value)) {
        return (
            <div className="flex flex-wrap gap-1">
                {value.map((item, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                        {String(item)}
                    </span>
                ))}
            </div>
        );
    }

    if (typeof value === "string" && value.includes("http")) {
        return (
            <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
                View Document
            </a>
        );
    }

    return <span className="text-sm sm:text-base">{String(value)}</span>;
};

const ProductDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { cartLoading } = useSelector((state) => state.cart);

    const [product, setProduct] = useState(location.state?.product || null);
    const [loading, setLoading] = useState(!location.state?.product);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [showZoomModal, setShowZoomModal] = useState(false);
    const [activeTab, setActiveTab] = useState("description");
    const { success, error: showError } = useToast();

    const [reviews, setReviews] = useState([]);
    const [ratingSummary, setRatingSummary] = useState({
        average_rating: 0,
        total_reviews: 0,
        rating_distribution: {},
    });
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [reviewsFilters, setReviewsFilters] = useState({
        rating: "",
        sort: "newest",
        page: 1,
        per_page: 10,
    });
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        if (isAuthenticated && product) {
            checkWishlistStatus();
        }
    }, [product, isAuthenticated]);

    const checkWishlistStatus = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/wishlist/check/${product.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
            );
            if (response.ok) {
                const data = await response.json();
                setIsWishlisted(data.is_in_wishlist);
            }
        } catch (error) {
            console.error("Error checking wishlist status:", error);
        }
    };

    const handleWishlist = async () => {
        if (!isAuthenticated) {
            dispatch(openLoginModal());
            return;
        }

        setWishlistLoading(true);
        try {
            if (isWishlisted) {
                await fetch(
                    `http://127.0.0.1:8000/api/wishlist/${product.id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    },
                );
                setIsWishlisted(false);
                success("Removed from wishlist");
            } else {
                await fetch("http://127.0.0.1:8000/api/wishlist/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        product_id: product.id,
                    }),
                });
                setIsWishlisted(true);
                success("Added to wishlist");
            }
        } catch (error) {
            console.error("Error updating wishlist:", error);
            showError("Failed to update wishlist");
        } finally {
            setWishlistLoading(false);
        }
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!location.state?.product && id) {
                try {
                    setLoading(true);
                    const response = await fetch(
                        `http://127.0.0.1:8000/api/products/${id}`,
                    );
                    if (!response.ok) throw new Error("Product not found");
                    const productData = await response.json();
                    setProduct(productData);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProductDetails();
    }, [id, location.state]);

    useEffect(() => {
        if (product) {
            fetchRatingSummary();
            fetchReviews();
        }
    }, [product, reviewsFilters]);

    const fetchRatingSummary = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/products/${product.id}/rating-summary`,
            );
            if (response.ok) {
                const summary = await response.json();
                setRatingSummary(summary);
            }
        } catch (error) {
            console.error("Failed to fetch rating summary:", error);
        }
    };

    const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(reviewsFilters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const response = await fetch(
                `http://127.0.0.1:8000/api/products/${product.id}/reviews?${params}`,
            );
            if (response.ok) {
                const data = await response.json();
                setReviews(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
            showError("Failed to load reviews");
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            dispatch(openLoginModal());
            return;
        }

        if (product.availability === 0) {
            showError("This product is out of stock", "Out of Stock");
            return;
        }

        setAddingToCart(true);
        try {
            await dispatch(
                addToCart({
                    product_id: product.id,
                    quantity: quantity,
                }),
            ).unwrap();
            success("Product added to cart successfully!");
        } catch (error) {
            showError(error || "Failed to add product to cart");
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = () => {
        if (!isAuthenticated) {
            const buyNowState = {
                directBuy: true,
                product: product,
                quantity: quantity,
            };
            localStorage.setItem(
                "pendingCheckout",
                JSON.stringify(buyNowState),
            );
            dispatch(openLoginModal("/"));
            return;
        }

        if (product.availability === 0) {
            showError("This product is out of stock", "Out of Stock");
            return;
        }
        localStorage.removeItem("pendingCheckout");
        navigate("/checkout", {
            state: {
                directBuy: true,
                product: product,
                quantity: quantity,
            },
        });
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert("Link copied to clipboard!");
            });
        }
    };

    const handleReviewSuccess = (result) => {
        setShowReviewForm(false);
        setEditingReview(null);
        setRatingSummary((prev) => ({
            ...prev,
            average_rating: result.summary.average_rating,
            total_reviews: result.summary.total_reviews,
        }));
        fetchReviews();
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setShowReviewForm(true);
    };

    const handleDeleteReview = async (review) => {
        if (!window.confirm("Are you sure you want to delete this review?")) {
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/products/${product.id}/reviews/${review.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
            );

            if (response.ok) {
                success("Review deleted successfully");
                fetchRatingSummary();
                fetchReviews();
            } else {
                throw new Error("Failed to delete review");
            }
        } catch (error) {
            showError(error.message);
        }
    };

    const getProductImages = () => {
        if (product.images) {
            try {
                return JSON.parse(product.images);
            } catch {
                return [product.image];
            }
        }
        return [product.image || "/images/placeholder-product.png"];
    };

    const parseSpecification = () => {
        if (!product.specification) return null;
        try {
            if (typeof product.specification === "string") {
                return JSON.parse(product.specification);
            }
            return product.specification;
        } catch {
            return { Specification: product.specification };
        }
    };

    const getTags = () => {
        if (!product.tags) return [];
        return product.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag);
    };

    const productImages = getProductImages();
    const specifications = parseSpecification();
    const tags = getTags();

    const currentPrice = parseFloat(
        product?.buy_now_price || product?.price || 0,
    );
    const originalPrice =
        product?.price && product.buy_now_price
            ? parseFloat(product.price)
            : currentPrice * 1.3;
    const discountPercent =
        originalPrice > currentPrice
            ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
            : 0;
    const savings = originalPrice - currentPrice;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">
                        Loading product details...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center px-4">
                <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        {error || "Product Not Found"}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {error
                            ? error
                            : "We couldn't find the product you're looking for. It might be unavailable or removed."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Browse Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex mb-6" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                <ArrowLeft size={16} className="mr-2" />
                                Back to Products
                            </button>
                        </li>
                    </ol>
                </nav>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
                        <div className="space-y-4">
                            <div className="relative group aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
                                <img
                                    src={
                                        productImages[selectedImage] ||
                                        "/images/placeholder-product.png"
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <button
                                    onClick={() => setShowZoomModal(true)}
                                    className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ZoomIn size={20} />
                                </button>
                            </div>

                            {productImages.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {productImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedImage(index)
                                            }
                                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                                selectedImage === index
                                                    ? "border-blue-500 ring-2 ring-blue-200"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} - ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">
                                            {product.category?.name ||
                                                "Electronics"}
                                        </div>
                                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                                            {product.name}
                                        </h1>
                                        {product.hedding && (
                                            <p className="text-lg text-gray-700 mt-1 font-medium">
                                                {product.hedding}
                                            </p>
                                        )}
                                        {product.model && (
                                            <p className="text-gray-600 mt-1">
                                                Model: {product.model}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleShare}
                                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                        title="Share this product"
                                    >
                                        <Share2 size={20} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm font-semibold">
                                            <span>
                                                {ratingSummary.average_rating.toFixed(
                                                    1,
                                                )}
                                            </span>
                                            <Star
                                                size={14}
                                                className="ml-1 fill-current"
                                            />
                                        </div>
                                        <span className="text-gray-600 text-sm">
                                            ({ratingSummary.total_reviews}{" "}
                                            reviews)
                                        </span>
                                    </div>
                                    <div
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                            product.availability > 0
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {product.availability > 0 ? (
                                            <>
                                                <Check
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                {product.availability} in stock
                                            </>
                                        ) : (
                                            "Out of stock"
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-5 border border-blue-100">
                                <div className="flex items-baseline gap-3 mb-1">
                                    <span className="text-3xl font-bold text-gray-600">
                                        Rs. {currentPrice.toLocaleString()}/=
                                    </span>
                                    {product.price &&
                                        product.buy_now_price &&
                                        product.price >
                                            product.buy_now_price && (
                                            <>
                                                <span className="text-lg text-gray-500 line-through">
                                                    Rs.{" "}
                                                    {originalPrice.toLocaleString()}
                                                </span>
                                                <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                                                    {discountPercent}% OFF
                                                </span>
                                            </>
                                        )}
                                </div>
                                {savings > 0 && (
                                    <p className="text-blue-600 font-medium">
                                        You save Rs. {savings.toLocaleString()}
                                    </p>
                                )}
                                {product.price && !product.buy_now_price && (
                                    <p className="text-gray-600 text-sm">
                                        Regular price
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {product.warranty && (
                                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                                        <Shield
                                            size={20}
                                            className="text-orange-600 flex-shrink-0"
                                        />
                                        <div>
                                            <div className="font-medium text-orange-900 text-sm">
                                                Warranty
                                            </div>
                                            <div className="text-orange-700 text-xs">
                                                {product.warranty}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                                    <Truck
                                        size={20}
                                        className="text-gray-600 flex-shrink-0"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-900 text-sm">
                                            Free Shipping
                                        </div>
                                        <div className="text-gray-700 text-xs">
                                            {" "}
                                            Rs.0
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-4">
                                    <span className="font-medium text-gray-900 min-w-20">
                                        Quantity:
                                    </span>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1),
                                                )
                                            }
                                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={
                                                quantity <= 1 ||
                                                product.availability === 0 ||
                                                addingToCart
                                            }
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-2 border-x border-gray-300 min-w-12 text-center font-medium">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.min(
                                                        product.availability,
                                                        quantity + 1,
                                                    ),
                                                )
                                            }
                                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={
                                                quantity >=
                                                    product.availability ||
                                                product.availability === 0 ||
                                                addingToCart
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                    {product.availability > 0 && (
                                        <span className="text-sm text-gray-500">
                                            {product.availability} available
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={
                                            product.availability === 0 ||
                                            addingToCart ||
                                            cartLoading
                                        }
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-blue-600 text-blue-700 rounded-lg hover:bg-blue-50 active:bg-blue-100 transition-colors font-medium text-base disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {addingToCart ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                                <span>Adding...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart
                                                    size={18}
                                                    className="flex-shrink-0"
                                                />
                                                <span>
                                                    {product.availability === 0
                                                        ? "Out of Stock"
                                                        : "Add to Cart"}
                                                </span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleBuyNow}
                                        disabled={
                                            product.availability === 0 ||
                                            addingToCart ||
                                            cartLoading
                                        }
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 transition-colors font-medium text-base shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {addingToCart
                                            ? "Processing..."
                                            : product.availability === 0
                                              ? "Out of Stock"
                                              : "Buy Now"}
                                    </button>
                                    <button
                                        onClick={handleWishlist}
                                        className="w-12 flex items-center justify-center rounded-lg border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-60"
                                        disabled={addingToCart}
                                        aria-label={
                                            isWishlisted
                                                ? "Remove from wishlist"
                                                : "Add to wishlist"
                                        }
                                        title={
                                            isWishlisted
                                                ? "Remove from wishlist"
                                                : "Add to wishlist"
                                        }
                                    >
                                        <Heart
                                            size={20}
                                            className={
                                                isWishlisted
                                                    ? "fill-red-500 text-red-500"
                                                    : "text-gray-600"
                                            }
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200">
                        <div className="px-6 lg:px-8">
                            <div className="flex overflow-x-auto gap-8 border-b border-gray-200">
                                {[
                                    { id: "description", label: "Description" },
                                    {
                                        id: "specifications",
                                        label: "Specifications",
                                    },
                                    {
                                        id: "reviews",
                                        label: `Reviews (${ratingSummary.total_reviews})`,
                                    },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                                            activeTab === tab.id
                                                ? "border-blue-600 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 lg:p-8">
                            {activeTab === "description" && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Product Description
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {product.description ||
                                            "This high-quality product is designed to deliver exceptional performance and reliability. Crafted with precision and attention to detail, it offers outstanding value and meets the highest standards of quality and durability."}
                                    </p>
                                </div>
                            )}

                            {activeTab === "specifications" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            Product Specifications
                                        </h3>
                                        <div className="text-xs text-gray-500">
                                            {specifications
                                                ? `${Object.keys(specifications).length} specifications`
                                                : "No specifications"}
                                        </div>
                                    </div>

                                    {product.specification_pdf_id && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <svg
                                                            className="w-6 h-6 text-blue-600"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-blue-900">
                                                            Product
                                                            Specification PDF
                                                        </h4>
                                                        <p className="text-blue-700 text-sm">
                                                            Download detailed
                                                            technical
                                                            specifications
                                                        </p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={
                                                        product.specification_pdf_id
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
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
                                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        />
                                                    </svg>
                                                    View PDF
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {specifications ? (
                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                            {Object.entries(
                                                groupSpecifications(
                                                    specifications,
                                                ),
                                            ).map(([category, specs]) => (
                                                <div
                                                    key={category}
                                                    className="border-b border-gray-100 last:border-b-0"
                                                >
                                                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                                                        <h4 className="font-semibold text-gray-900 text-lg capitalize">
                                                            {category
                                                                .replace(
                                                                    /([A-Z])/g,
                                                                    " $1",
                                                                )
                                                                .trim()}
                                                        </h4>
                                                    </div>

                                                    <div className="divide-y divide-gray-100">
                                                        {Object.entries(
                                                            specs,
                                                        ).map(
                                                            ([key, value]) => (
                                                                <div
                                                                    key={key}
                                                                    className="flex flex-col sm:flex-row hover:bg-gray-50 transition-colors duration-150"
                                                                >
                                                                    <div className="w-full sm:w-1/3 px-6 py-4 font-medium text-gray-700 border-r-0 sm:border-r border-gray-200 bg-white sm:bg-gray-50">
                                                                        <span className="text-xs sm:text-base">
                                                                            {formatSpecificationKey(
                                                                                key,
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    <pre className="w-full sm:w-2/3 px-6 py-4 text-gray-800">
                                                                        {renderSpecificationValue(
                                                                            value,
                                                                        )}
                                                                    </pre>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="text-gray-400 mb-3">
                                                <svg
                                                    className="w-12 h-12 mx-auto"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1}
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500 text-lg font-medium">
                                                No specifications available
                                            </p>
                                            <p className="text-gray-400 text-sm mt-1">
                                                Specifications for this product
                                                will be added soon
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                            {activeTab === "reviews" && (
                                <div className="space-y-8">
                                    <RatingSummary
                                        averageRating={
                                            ratingSummary.average_rating
                                        }
                                        totalReviews={
                                            ratingSummary.total_reviews
                                        }
                                        ratingDistribution={
                                            ratingSummary.rating_distribution
                                        }
                                    />

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <select
                                                value={reviewsFilters.rating}
                                                onChange={(e) =>
                                                    setReviewsFilters(
                                                        (prev) => ({
                                                            ...prev,
                                                            rating: e.target
                                                                .value,
                                                            page: 1,
                                                        }),
                                                    )
                                                }
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            >
                                                <option value="">
                                                    All Ratings
                                                </option>
                                                <option value="5">
                                                    5 Stars
                                                </option>
                                                <option value="4">
                                                    4 Stars
                                                </option>
                                                <option value="3">
                                                    3 Stars
                                                </option>
                                                <option value="2">
                                                    2 Stars
                                                </option>
                                                <option value="1">
                                                    1 Star
                                                </option>
                                            </select>

                                            <select
                                                value={reviewsFilters.sort}
                                                onChange={(e) =>
                                                    setReviewsFilters(
                                                        (prev) => ({
                                                            ...prev,
                                                            sort: e.target
                                                                .value,
                                                            page: 1,
                                                        }),
                                                    )
                                                }
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            >
                                                <option value="newest">
                                                    Newest First
                                                </option>
                                                <option value="oldest">
                                                    Oldest First
                                                </option>
                                                <option value="highest">
                                                    Highest Rated
                                                </option>
                                                <option value="lowest">
                                                    Lowest Rated
                                                </option>
                                            </select>
                                        </div>

                                        {isAuthenticated && (
                                            <button
                                                onClick={() =>
                                                    setShowReviewForm(true)
                                                }
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                                            >
                                                <Plus size={16} />
                                                Write a Review
                                            </button>
                                        )}
                                    </div>

                                    <ReviewsList
                                        reviews={reviews}
                                        currentUserId={user?.id}
                                        onEdit={handleEditReview}
                                        onDelete={handleDeleteReview}
                                        loading={reviewsLoading}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showZoomModal && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowZoomModal(false)}
                >
                    <div className="relative max-w-4xl w-full max-h-[90vh]">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowZoomModal(false);
                            }}
                            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage((prev) =>
                                        prev > 0
                                            ? prev - 1
                                            : productImages.length - 1,
                                    );
                                }}
                                className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        </div>
                        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage((prev) =>
                                        prev < productImages.length - 1
                                            ? prev + 1
                                            : 0,
                                    );
                                }}
                                className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                        <div className="flex items-center justify-center h-full">
                            <img
                                src={productImages[selectedImage]}
                                alt={product.name}
                                className="max-w-full max-h-[80vh] object-contain"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                            <div className="bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                                {selectedImage + 1} / {productImages.length}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showReviewForm && (
                <ReviewForm
                    product={product}
                    existingReview={editingReview}
                    onSuccess={handleReviewSuccess}
                    onCancel={() => {
                        setShowReviewForm(false);
                        setEditingReview(null);
                    }}
                />
            )}
        </div>
    );
};

export default ProductDetails;
