import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../Store/slices/authSlice.js";
import {
    openLoginModal,
    openRegisterModal,
} from "../../Store/slices/modalSlice.js";
import { useState, useEffect, useRef, useCallback } from "react";
import {
    ShoppingCart,
    Menu,
    X,
    FileText,
    Home,
    Store,
    Info,
    Phone,
    User,
    Search,
    Clock,
    TrendingUp,
} from "lucide-react";
import axios from "axios";
import debounce from "lodash.debounce";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, role, isLoading } = useSelector(
        (state) => state.auth,
    );
    const cartCount = useSelector((state) => state.cart?.totalItems || 0);
    const quotationCount = useSelector(
        (state) => state.quotation?.totalItems || 0,
    );
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [settings, setSettings] = useState({
        logoUrl: null,
    });
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);
    const searchResultsRef = useRef(null);

    const themeColors = {
        primary: "#0866ff",
        primaryHover: "#0759e0",
        secondary: "#e3251b",
        secondaryHover: "#c91f16",
        text: "#1f2937",
        lightBg: "#f0f7ff",
    };

    useEffect(() => {
        const saved = localStorage.getItem("recentSearches");
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    const saveToRecentSearches = (query) => {
        if (!query.trim()) return;

        const updated = [
            query,
            ...recentSearches.filter((s) => s !== query),
        ].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
    };

    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (query.length < 2) {
                setSearchResults([]);
                setSearchSuggestions([]);
                return;
            }

            setIsSearching(true);
            try {
                const [resultsResponse, suggestionsResponse] =
                    await Promise.all([
                        axios.get(
                            `http://localhost:8000/api/products/search?query=${encodeURIComponent(query)}`,
                        ),
                        axios.get(
                            `http://localhost:8000/api/products/search-suggestions?query=${encodeURIComponent(query)}`,
                        ),
                    ]);

                if (resultsResponse.data.success) {
                    setSearchResults(resultsResponse.data.products);
                }

                if (suggestionsResponse.data.success) {
                    setSearchSuggestions(suggestionsResponse.data.suggestions);
                }
            } catch (error) {
                console.error("Search error:", error);
                setSearchResults([]);
                setSearchSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 300),
        [],
    );

    useEffect(() => {
        if (searchQuery.trim()) {
            debouncedSearch(searchQuery);
        } else {
            setSearchResults([]);
            setSearchSuggestions([]);
        }
    }, [searchQuery, debouncedSearch]);

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsUserDropdownOpen(false);
            }
            if (
                searchResultsRef.current &&
                !searchResultsRef.current.contains(event.target) &&
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target)
            ) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    const fetchSettings = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/system-settings",
            );
            setSettings({ logoUrl: response.data.logo_url || null });
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            setIsUserDropdownOpen(false);
            setIsMobileMenuOpen(false);
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const isActiveRoute = (path) => location.pathname === path;

    const handleOpenLoginModal = () => dispatch(openLoginModal());
    const handleOpenRegisterModal = () => dispatch(openRegisterModal());

    const handleSearchToggle = () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) {
            setSearchQuery("");
            setSearchResults([]);
            setSearchSuggestions([]);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            saveToRecentSearches(searchQuery.trim());
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery("");
        }
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearchSubmit(e);
        }
    };

    const handleProductClick = (product) => {
        saveToRecentSearches(searchQuery.trim());
        navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearchOpen(false);
        setSearchQuery("");
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.name);
        saveToRecentSearches(suggestion.name);
        navigate(`/shop?search=${encodeURIComponent(suggestion.name)}`);
        setIsSearchOpen(false);
    };

    const handleRecentSearchClick = (search) => {
        setSearchQuery(search);
        saveToRecentSearches(search);
        navigate(`/shop?search=${encodeURIComponent(search)}`);
        setIsSearchOpen(false);
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem("recentSearches");
    };

    const renderLogo = () => {
        if (loading) {
            return (
                <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
            );
        }

        if (settings.logoUrl) {
            return (
                <img
                    src={settings.logoUrl}
                    alt="Logo"
                    className="h-15 w-auto object-contain"
                    onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                    }}
                />
            );
        }
        return (
            <div className="text-2xl font-semibold text-slate-700">
                <span style={{ color: themeColors.primary }}>go</span>cart
                <span
                    style={{ color: themeColors.primary }}
                    className="text-3xl"
                >
                    .
                </span>
            </div>
        );
    };

    const renderLogoWithBadge = () => {
        if (loading) {
            return (
                <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
            );
        }

        if (settings.logoUrl) {
            return (
                <div className="relative flex items-center">
                    <img
                        src={settings.logoUrl}
                        alt="Logo"
                        className="h-13 w-auto object-contain"
                        onError={(e) => {
                            e.target.style.display = "none";
                        }}
                    />
                </div>
            );
        }
        return (
            <div className="relative float-left text-4xl font-semibold text-slate-700">
                <span style={{ color: themeColors.primary }}>go</span>cart
                <span
                    style={{ color: themeColors.primary }}
                    className="text-5xl leading-0"
                >
                    .
                </span>
                <p
                    className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white"
                    style={{ backgroundColor: themeColors.secondary }}
                >
                    plus
                </p>
            </div>
        );
    };

    if (isLoading && !isAuthenticated) {
        return (
            <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center h-16">
                        {renderLogo()}
                        <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
                    </div>
                </div>
            </nav>
        );
    }

    const navLinks = [
        { path: "/", label: "Home", icon: Home },
        { path: "/shop", label: "Shop", icon: Store },
        { path: "/quotations", label: "Quotations", icon: FileText },
        { path: "/about", label: "About", icon: Info },
        { path: "/contact", label: "Contact", icon: Phone },
    ];

    const getDashboardLink = () => {
        if (role === "super_admin") return "/super-admin";
        if (role === "admin") return "/admin";
        return "/profile";
    };

    const getDashboardLabel = () => {
        if (role === "super_admin") return "Super Admin";
        if (role === "admin") return "Dashboard";
        return "Profile";
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
                <div className="mx-6">
                    <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
                        <Link
                            to="/"
                            className="flex items-center"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {renderLogoWithBadge()}
                        </Link>

                        <div className="hidden lg:flex items-center gap-20">
                            <div className="flex items-center gap-6 text-slate-600">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`flex items-center gap-1.5 font-medium transition-colors duration-200 hover:text-[${themeColors.primary}] px-3 py-2 rounded-lg ${
                                            isActiveRoute(link.path)
                                                ? `text-[${themeColors.primary}] bg-[${themeColors.lightBg}]`
                                                : `text-slate-600 hover:bg-slate-50`
                                        }`}
                                        style={{
                                            color: isActiveRoute(link.path)
                                                ? themeColors.primary
                                                : undefined,
                                            backgroundColor: isActiveRoute(
                                                link.path,
                                            )
                                                ? themeColors.lightBg
                                                : undefined,
                                        }}
                                    >
                                        <span className="text-sm">
                                            {link.label}
                                        </span>
                                    </Link>
                                ))}
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Search Icon */}
                                <button
                                    onClick={handleSearchToggle}
                                    className="relative flex items-center gap-1.5 text-slate-600 hover:text-[#0866ff] transition-colors duration-200 p-2 rounded-lg hover:bg-slate-50"
                                    style={{
                                        color: themeColors.text,
                                        "--hover-color": themeColors.primary,
                                    }}
                                >
                                    <Search size={18} />
                                </button>

                                <Link
                                    to="/cart"
                                    className="relative flex items-center gap-1.5 text-slate-600 hover:text-[#0866ff] transition-colors duration-200 p-2 rounded-lg hover:bg-slate-50"
                                    style={{
                                        color: themeColors.text,
                                        "--hover-color": themeColors.primary,
                                    }}
                                >
                                    <ShoppingCart size={18} />
                                    {cartCount > 0 && (
                                        <span
                                            className="absolute -top-1 -right-1 text-[10px] text-white size-4 rounded-full flex items-center justify-center font-medium"
                                            style={{
                                                backgroundColor:
                                                    themeColors.primary,
                                            }}
                                        >
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                                <Link
                                    to="/quotationsPage"
                                    className="relative flex items-center gap-1.5 text-slate-600 hover:text-[#0866ff] transition-colors duration-200 p-2 rounded-lg hover:bg-slate-50"
                                    style={{
                                        color: themeColors.text,
                                        "--hover-color": themeColors.primary,
                                    }}
                                >
                                    <FileText size={18} />
                                    <span className="text-sm">Quotes</span>
                                    {quotationCount > 0 && (
                                        <span
                                            className="absolute -top-1 -right-1 text-[10px] text-white size-4 rounded-full flex items-center justify-center font-medium"
                                            style={{
                                                backgroundColor:
                                                    themeColors.secondary,
                                            }}
                                        >
                                            {quotationCount}
                                        </span>
                                    )}
                                </Link>

                                {isAuthenticated ? (
                                    <div
                                        className="flex items-center"
                                        ref={dropdownRef}
                                    >
                                        <div className="relative">
                                            <button
                                                onClick={() =>
                                                    setIsUserDropdownOpen(
                                                        !isUserDropdownOpen,
                                                    )
                                                }
                                                className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 hover:border-slate-300 transition-all duration-300 min-w-0"
                                            >
                                                <div
                                                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.primaryHover})`,
                                                    }}
                                                >
                                                    <span className="text-white text-xs font-medium">
                                                        {user?.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-start max-w-32">
                                                    <span className="text-slate-900 font-medium text-xs truncate w-full">
                                                        {user?.name}
                                                    </span>
                                                    <span className="text-slate-500 text-xs capitalize truncate w-full">
                                                        {role}
                                                    </span>
                                                </div>
                                            </button>

                                            {isUserDropdownOpen && (
                                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                                                    <div className="px-4 py-3 border-b border-slate-100">
                                                        <p className="text-sm font-medium text-slate-900 truncate">
                                                            {user?.name}
                                                        </p>
                                                        <p className="text-sm text-slate-500 capitalize">
                                                            {role}
                                                        </p>
                                                    </div>

                                                    <Link
                                                        to={getDashboardLink()}
                                                        className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                                                        onClick={() =>
                                                            setIsUserDropdownOpen(
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        <User
                                                            size={16}
                                                            className="mr-3 text-slate-400"
                                                        />
                                                        {getDashboardLabel()}
                                                    </Link>

                                                    {(role === "admin" ||
                                                        role ===
                                                            "super_admin") && (
                                                        <>
                                                            <Link
                                                                to="/admin/products"
                                                                className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                                                                onClick={() =>
                                                                    setIsUserDropdownOpen(
                                                                        false,
                                                                    )
                                                                }
                                                            >
                                                                <Store
                                                                    size={16}
                                                                    className="mr-3 text-slate-400"
                                                                />
                                                                Manage Products
                                                            </Link>
                                                            <Link
                                                                to="/admin/user-manage"
                                                                className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                                                                onClick={() =>
                                                                    setIsUserDropdownOpen(
                                                                        false,
                                                                    )
                                                                }
                                                            >
                                                                <User
                                                                    size={16}
                                                                    className="mr-3 text-slate-400"
                                                                />
                                                                Manage Users
                                                            </Link>
                                                        </>
                                                    )}

                                                    <div className="border-t border-slate-100 mt-2 pt-2">
                                                        <button
                                                            onClick={
                                                                handleLogout
                                                            }
                                                            className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                                        >
                                                            <svg
                                                                className="w-4 h-4 mr-3"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                                />
                                                            </svg>
                                                            Logout
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={handleOpenLoginModal}
                                            className="px-4 py-1.5 text-slate-700 hover:text-[#0866ff] text-sm font-medium transition-colors duration-200"
                                            style={{
                                                "--hover-color":
                                                    themeColors.primary,
                                            }}
                                        >
                                            Sign In
                                        </button>
                                        <button
                                            onClick={handleOpenRegisterModal}
                                            className="px-4 py-1.5 text-white text-sm rounded-full font-medium transition-colors duration-200"
                                            style={{
                                                backgroundColor:
                                                    themeColors.primary,
                                                "--hover-bg":
                                                    themeColors.primaryHover,
                                            }}
                                            onMouseOver={(e) =>
                                                (e.target.style.backgroundColor =
                                                    themeColors.primaryHover)
                                            }
                                            onMouseOut={(e) =>
                                                (e.target.style.backgroundColor =
                                                    themeColors.primary)
                                            }
                                        >
                                            Get Started
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:hidden flex items-center gap-4">
                            <button
                                onClick={handleSearchToggle}
                                className="relative p-2 text-slate-600 hover:text-[#0866ff] transition-colors"
                                style={{ "--hover-color": themeColors.primary }}
                            >
                                <Search size={20} />
                            </button>

                            <Link
                                to="/cart"
                                className="relative p-2 text-slate-600 hover:text-[#0866ff] transition-colors"
                                style={{ "--hover-color": themeColors.primary }}
                            >
                                <ShoppingCart size={20} />
                                {cartCount > 0 && (
                                    <span
                                        className="absolute -top-1 -right-1 text-[10px] text-white size-4 rounded-full flex items-center justify-center font-medium"
                                        style={{
                                            backgroundColor:
                                                themeColors.primary,
                                        }}
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <Link
                                to="/quotationsPage"
                                className="relative p-2 text-slate-600 hover:text-[#0866ff] transition-colors"
                                style={{ "--hover-color": themeColors.primary }}
                            >
                                <FileText size={20} />
                                {quotationCount > 0 && (
                                    <span
                                        className="absolute -top-1 -right-1 text-[10px] text-white size-4 rounded-full flex items-center justify-center font-medium"
                                        style={{
                                            backgroundColor:
                                                themeColors.secondary,
                                        }}
                                    >
                                        {quotationCount}
                                    </span>
                                )}
                            </Link>

                            {!isAuthenticated && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleOpenLoginModal}
                                        className="px-3 py-1.5 text-slate-700 hover:text-[#0866ff] text-xs transition-colors duration-200 font-medium"
                                        style={{
                                            "--hover-color":
                                                themeColors.primary,
                                        }}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={handleOpenRegisterModal}
                                        className="px-3 py-1.5 text-xs transition text-white rounded-full font-medium"
                                        style={{
                                            backgroundColor:
                                                themeColors.primary,
                                            "--hover-bg":
                                                themeColors.primaryHover,
                                        }}
                                        onMouseOver={(e) =>
                                            (e.target.style.backgroundColor =
                                                themeColors.primaryHover)
                                        }
                                        onMouseOut={(e) =>
                                            (e.target.style.backgroundColor =
                                                themeColors.primary)
                                        }
                                    >
                                        Get Started
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                className="p-2 text-slate-600 hover:text-[#0866ff] transition-colors duration-300"
                                style={{ "--hover-color": themeColors.primary }}
                            >
                                {isMobileMenuOpen ? (
                                    <X size={20} />
                                ) : (
                                    <Menu size={20} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {isSearchOpen && (
                    <div
                        className="bg-white shadow-xl border-t border-slate-100 animate-slideDown"
                        style={{ animation: "slideDown 0.3s ease-out" }}
                        ref={searchResultsRef}
                    >
                        <div className="max-w-4xl mx-auto px-6 py-4">
                            <form
                                onSubmit={handleSearchSubmit}
                                className="relative mb-4"
                            >
                                <div className="relative">
                                    <Search
                                        size={20}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search for products, brands, or categories..."
                                        value={searchQuery}
                                        onChange={handleSearchInputChange}
                                        onKeyPress={handleSearchKeyPress}
                                        className="w-full pl-12 pr-32 py-4 bg-slate-50 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-lg"
                                    />
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsSearchOpen(false);
                                                setSearchQuery("");
                                            }}
                                            className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!searchQuery.trim()}
                                            className="px-6 py-2 text-white text-sm rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{
                                                backgroundColor:
                                                    searchQuery.trim()
                                                        ? themeColors.primary
                                                        : themeColors.primary +
                                                          "80",
                                            }}
                                            onMouseOver={(e) => {
                                                if (searchQuery.trim()) {
                                                    e.target.style.backgroundColor =
                                                        themeColors.primaryHover;
                                                }
                                            }}
                                            onMouseOut={(e) => {
                                                if (searchQuery.trim()) {
                                                    e.target.style.backgroundColor =
                                                        themeColors.primary;
                                                }
                                            }}
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="max-h-96 overflow-y-auto">
                                {isSearching && (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    </div>
                                )}

                                {!isSearching &&
                                    searchQuery &&
                                    searchResults.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                                <TrendingUp size={16} />
                                                Matching Products (
                                                {searchResults.length})
                                            </h3>
                                            <div className="grid gap-2">
                                                {searchResults.map(
                                                    (product) => (
                                                        <div
                                                            key={product.id}
                                                            onClick={() =>
                                                                handleProductClick(
                                                                    product,
                                                                )
                                                            }
                                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-slate-100"
                                                        >
                                                            <img
                                                                src={
                                                                    product.image ||
                                                                    "/placeholder-image.jpg"
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="w-12 h-12 object-cover rounded-lg"
                                                                onError={(
                                                                    e,
                                                                ) => {
                                                                    e.target.src =
                                                                        "https://via.placeholder.com/48x48?text=No+Image";
                                                                }}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-medium text-slate-900 truncate">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </h4>
                                                                <p className="text-sm text-slate-500 truncate">
                                                                    {
                                                                        product.model
                                                                    }{" "}
                                                                    •{" "}
                                                                    {
                                                                        product.item_code
                                                                    }
                                                                </p>
                                                                <p className="text-sm font-semibold text-blue-600">
                                                                    Rs
                                                                    {
                                                                        product.price
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {!isSearching &&
                                    searchQuery &&
                                    searchSuggestions.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-sm font-semibold text-slate-700 mb-3">
                                                Suggestions
                                            </h3>
                                            <div className="grid gap-1">
                                                {searchSuggestions.map(
                                                    (suggestion, index) => (
                                                        <div
                                                            key={index}
                                                            onClick={() =>
                                                                handleSuggestionClick(
                                                                    suggestion,
                                                                )
                                                            }
                                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                                                        >
                                                            <Search
                                                                size={16}
                                                                className="text-slate-400"
                                                            />
                                                            <div>
                                                                <p className="text-sm font-medium text-slate-900">
                                                                    {
                                                                        suggestion.name
                                                                    }
                                                                </p>
                                                                {suggestion.category && (
                                                                    <p className="text-xs text-slate-500">
                                                                        {
                                                                            suggestion.category
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {!isSearching &&
                                    !searchQuery &&
                                    recentSearches.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                    <Clock size={16} />
                                                    Recent Searches
                                                </h3>
                                                <button
                                                    onClick={
                                                        clearRecentSearches
                                                    }
                                                    className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                                                >
                                                    Clear all
                                                </button>
                                            </div>
                                            <div className="grid gap-1">
                                                {recentSearches.map(
                                                    (search, index) => (
                                                        <div
                                                            key={index}
                                                            onClick={() =>
                                                                handleRecentSearchClick(
                                                                    search,
                                                                )
                                                            }
                                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                                                        >
                                                            <Clock
                                                                size={16}
                                                                className="text-slate-400"
                                                            />
                                                            <span className="text-sm text-slate-700">
                                                                {search}
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {!isSearching &&
                                    searchQuery &&
                                    searchResults.length === 0 &&
                                    searchSuggestions.length === 0 && (
                                        <div className="text-center py-8 text-slate-500">
                                            <Search
                                                size={48}
                                                className="mx-auto mb-3 text-slate-300"
                                            />
                                            <p className="font-medium">
                                                No products found
                                            </p>
                                            <p className="text-sm">
                                                Try different keywords or browse
                                                categories
                                            </p>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                )}

                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-slate-200 bg-white">
                        <div className="px-6 py-4">
                            <div className="flex flex-col space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`flex items-center gap-3 py-3 px-4 font-medium transition-all duration-200 rounded-lg ${
                                            isActiveRoute(link.path)
                                                ? `text-[${themeColors.primary}] bg-[${themeColors.lightBg}]`
                                                : "text-slate-600 hover:text-[#0866ff] hover:bg-slate-50"
                                        }`}
                                        style={{
                                            color: isActiveRoute(link.path)
                                                ? themeColors.primary
                                                : undefined,
                                            backgroundColor: isActiveRoute(
                                                link.path,
                                            )
                                                ? themeColors.lightBg
                                                : undefined,
                                        }}
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <link.icon size={18} />
                                        {link.label}
                                    </Link>
                                ))}

                                {isAuthenticated && (
                                    <>
                                        <div className="border-t border-slate-200 pt-3 mt-2">
                                            <Link
                                                to={getDashboardLink()}
                                                className="flex items-center gap-3 py-3 px-4 font-medium text-slate-600 hover:text-[#0866ff] hover:bg-slate-50 transition-all duration-200 rounded-lg"
                                                style={{
                                                    "--hover-color":
                                                        themeColors.primary,
                                                }}
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                            >
                                                <User size={18} />
                                                {getDashboardLabel()}
                                            </Link>

                                            {(role === "admin" ||
                                                role === "super_admin") && (
                                                <>
                                                    <Link
                                                        to="/admin/products"
                                                        className="flex items-center gap-3 py-3 px-4 font-medium text-slate-600 hover:text-[#0866ff] hover:bg-slate-50 transition-all duration-200 rounded-lg"
                                                        style={{
                                                            "--hover-color":
                                                                themeColors.primary,
                                                        }}
                                                        onClick={() =>
                                                            setIsMobileMenuOpen(
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        <Store size={18} />
                                                        Manage Products
                                                    </Link>
                                                    <Link
                                                        to="/admin/user-manage"
                                                        className="flex items-center gap-3 py-3 px-4 font-medium text-slate-600 hover:text-[#0866ff] hover:bg-slate-50 transition-all duration-200 rounded-lg"
                                                        style={{
                                                            "--hover-color":
                                                                themeColors.primary,
                                                        }}
                                                        onClick={() =>
                                                            setIsMobileMenuOpen(
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        <User size={18} />
                                                        Manage Users
                                                    </Link>
                                                </>
                                            )}

                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="flex items-center gap-3 w-full text-left py-3 px-4 font-medium text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                    />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}

                                {!isAuthenticated && (
                                    <div className="border-t border-slate-200 pt-3 mt-2">
                                        <button
                                            onClick={() => {
                                                handleOpenLoginModal();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="flex items-center gap-3 w-full text-left py-3 px-4 font-medium text-slate-600 hover:text-[#0866ff] hover:bg-slate-50 transition-all duration-200 rounded-lg"
                                            style={{
                                                "--hover-color":
                                                    themeColors.primary,
                                            }}
                                        >
                                            <User size={18} />
                                            Sign In
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleOpenRegisterModal();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="flex items-center gap-3 w-full text-left py-3 px-4 font-medium transition-all duration-200 rounded-lg"
                                            style={{
                                                color: themeColors.primary,
                                                backgroundColor:
                                                    themeColors.lightBg,
                                                "--hover-bg": "#e6f0ff",
                                            }}
                                        >
                                            <User size={18} />
                                            Get Started
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
};

export default Navbar;
