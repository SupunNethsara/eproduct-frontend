import React, { useEffect, useState, useCallback } from "react";
import ShopHeader from "./ShopComponents/ShopHeader.jsx";
import FillterSidebar from "./ShopComponents/FillterSidebar.jsx";
import ProductSection from "./ShopComponents/ProductSection.jsx";
import MobileFilterDrawer from "./ShopComponents/MobileFilterDrawer.jsx";
import axios from "axios";
import { useLocation } from "react-router-dom";

function ProductShop() {
    const location = useLocation();
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 300000]);
    const [availability, setAvailability] = useState("all");
    const [sortBy, setSortBy] = useState("featured");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [initialLoad, setInitialLoad] = useState(true);

    const sortOptions = [
        { value: "featured", label: "Featured" },
        { value: "price-low", label: "Price: Low to High" },
        { value: "price-high", label: "Price: High to Low" },
        { value: "rating", label: "Highest Rated" },
        { value: "name", label: "Name A-Z" },
    ];

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchParam = urlParams.get("search");

        if (searchParam) {
            setSearchQuery(searchParam);
            setSearchInput(searchParam);
        }

        window.scrollTo(0, 0);
    }, [location.search]);

    const extractCategoriesFromProducts = (products) => {
        const categoryMap = {};

        products.forEach((product) => {
            if (product.category_1) {
                const key1 = `cat1_${product.category_1}`;
                if (!categoryMap[key1]) {
                    categoryMap[key1] = {
                        id: key1,
                        name: product.category_1,
                        level: 0,
                        type: "category_1",
                        fullPath: product.category_1,
                    };
                }
            }

            if (product.category_2 && product.category_1) {
                const key2 = `cat2_${product.category_1}_${product.category_2}`;
                if (!categoryMap[key2]) {
                    categoryMap[key2] = {
                        id: key2,
                        name: product.category_2,
                        level: 1,
                        parent: product.category_1,
                        type: "category_2",
                        fullPath: `${product.category_1} > ${product.category_2}`,
                    };
                }
            }

            if (
                product.category_3 &&
                product.category_2 &&
                product.category_1
            ) {
                const key3 = `cat3_${product.category_1}_${product.category_2}_${product.category_3}`;
                if (!categoryMap[key3]) {
                    categoryMap[key3] = {
                        id: key3,
                        name: product.category_3,
                        level: 2,
                        parent: product.category_2,
                        grandParent: product.category_1,
                        type: "category_3",
                        fullPath: `${product.category_1} > ${product.category_2} > ${product.category_3}`,
                    };
                }
            }
        });

        return Object.values(categoryMap);
    };

    const getChildCategoryIds = useCallback(
        (categoryId) => {
            const category = categories.find((c) => c.id === categoryId);
            if (!category) return [categoryId];

            const childIds = [categoryId];

            if (category.level === 0) {
                const level1Children = categories.filter(
                    (c) => c.level === 1 && c.parent === category.name,
                );

                level1Children.forEach((level1Cat) => {
                    childIds.push(level1Cat.id);

                    const level2Children = categories.filter(
                        (c) =>
                            c.level === 2 &&
                            c.parent === level1Cat.name &&
                            c.grandParent === category.name,
                    );

                    level2Children.forEach((level2Cat) => {
                        childIds.push(level2Cat.id);
                        const level3Children = categories.filter(
                            (c) =>
                                c.level === 3 &&
                                c.parent === level2Cat.name &&
                                c.grandParent === level1Cat.name,
                        );

                        level3Children.forEach((level3Cat) => {
                            childIds.push(level3Cat.id);
                        });
                    });
                });
            } else if (category.level === 1) {
                const level2Children = categories.filter(
                    (c) =>
                        c.level === 2 &&
                        c.parent === category.name &&
                        c.grandParent === category.parent,
                );

                level2Children.forEach((level2Cat) => {
                    childIds.push(level2Cat.id);
                    const level3Children = categories.filter(
                        (c) =>
                            c.level === 3 &&
                            c.parent === level2Cat.name &&
                            c.grandParent === category.name,
                    );

                    level3Children.forEach((level3Cat) => {
                        childIds.push(level3Cat.id);
                    });
                });
            } else if (category.level === 2) {
                const level3Children = categories.filter(
                    (c) =>
                        c.level === 3 &&
                        c.parent === category.name &&
                        c.grandParent === category.grandParent,
                );

                level3Children.forEach((level3Cat) => {
                    childIds.push(level3Cat.id);
                });
            }
            return [...new Set(childIds)];
        },
        [categories],
    );

    const productMatchesCategories = useCallback(
        (product, selectedCats) => {
            if (selectedCats.length === 0) return true;

            const allCategoryIds = selectedCats.flatMap((catId) =>
                getChildCategoryIds(catId),
            );

            return allCategoryIds.some((catId) => {
                const category = categories.find((c) => c.id === catId);
                if (!category) {
                    return false;
                }

                let matches = false;

                switch (category.type) {
                    case "category_1":
                        matches = product.category_1 === category.name;
                        break;
                    case "category_2":
                        matches =
                            product.category_2 === category.name &&
                            product.category_1 === category.parent;
                        break;
                    case "category_3":
                        matches =
                            product.category_3 === category.name &&
                            product.category_2 === category.parent &&
                            product.category_1 === category.grandParent;
                        break;
                    default:
                        matches = false;
                }

                return matches;
            });
        },
        [categories, getChildCategoryIds],
    );

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/products/active",
                    {
                        params: { per_page: 1000 },
                    },
                );

                const products = response.data.data || [];
                setAllProducts(products);
                const extractedCategories =
                    extractCategoriesFromProducts(products);
                setCategories(extractedCategories);

                products.slice(0, 3).forEach((product, index) => {});
            } catch (error) {
                console.error("Error fetching products:", error);
                setAllProducts([]);
                setCategories([]);
            } finally {
                setLoading(false);
                setInitialLoad(false);
            }
        };

        fetchAllProducts();
    }, []);

    useEffect(() => {
        if (initialLoad) return;
        applyFilters();
    }, [
        searchQuery,
        selectedCategories,
        priceRange,
        availability,
        sortBy,
        allProducts,
    ]);

    const applyFilters = useCallback(() => {
        if (allProducts.length === 0) {
            setFilteredProducts([]);
            setTotalProducts(0);
            return;
        }

        let filtered = [...allProducts];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();

            filtered = filtered.filter((product) => {
                const matches =
                    product.name?.toLowerCase().includes(query) ||
                    product.description?.toLowerCase().includes(query) ||
                    product.model?.toLowerCase().includes(query) ||
                    product.item_code?.toLowerCase().includes(query) ||
                    product.category_1?.toLowerCase().includes(query) ||
                    product.category_2?.toLowerCase().includes(query) ||
                    product.category_3?.toLowerCase().includes(query) ||
                    product.tags?.toLowerCase().includes(query);

                return matches;
            });
        }

        if (selectedCategories.length > 0) {
            filtered = filtered.filter((product) =>
                productMatchesCategories(product, selectedCategories),
            );
        }

        filtered = filtered.filter((product) => {
            const price = parseFloat(product.price) || 0;
            const inRange = price >= priceRange[0] && price <= priceRange[1];
            return inRange;
        });

        if (availability !== "all") {
            if (availability === "in-stock") {
                filtered = filtered.filter((product) => {
                    const isInStock = parseInt(product.availability) > 0;
                    return isInStock;
                });
            } else if (availability === "out-of-stock") {
                filtered = filtered.filter((product) => {
                    const isOutOfStock = parseInt(product.availability) === 0;
                    return isOutOfStock;
                });
            }
        }

        filtered = sortProducts(filtered, sortBy);
        setFilteredProducts(filtered);
        setTotalProducts(filtered.length);
        setCurrentPage(1);
    }, [
        allProducts,
        searchQuery,
        selectedCategories,
        priceRange,
        availability,
        sortBy,
        productMatchesCategories,
        categories,
    ]);

    const sortProducts = (products, sortType) => {
        const sorted = [...products];

        switch (sortType) {
            case "price-low":
                return sorted.sort(
                    (a, b) =>
                        (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0),
                );
            case "price-high":
                return sorted.sort(
                    (a, b) =>
                        (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0),
                );
            case "rating":
                return sorted.sort(
                    (a, b) =>
                        (parseFloat(b.average_rating) || 0) -
                        (parseFloat(a.average_rating) || 0),
                );
            case "name":
                return sorted.sort((a, b) =>
                    (a.name || "").localeCompare(b.name || ""),
                );
            default:
                return sorted.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at),
                );
        }
    };

    const getPaginatedProducts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredProducts.slice(startIndex, endIndex);
    };

    const toggleCategory = (categoryId) => {
        const category = categories.find((c) => c.id === categoryId);
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId],
        );
    };

    const clearAllFilters = () => {
        setSearchInput("");
        setSearchQuery("");
        setSelectedCategories([]);
        setPriceRange([0, 300000]);
        setAvailability("all");
        setSortBy("featured");
        setCurrentPage(1);
    };

    const handleSearch = () => {
        const trimmedInput = searchInput.trim();
        if (trimmedInput !== searchQuery) {
            setSearchQuery(trimmedInput);
        } else {
            applyFilters();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setSearchInput("");
        setSearchQuery("");
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-0">
            <div className="container mx-auto px-2 py-2">
                <ShopHeader
                    sortOptions={sortOptions}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    isSortOpen={isSortOpen}
                    setIsSortOpen={setIsSortOpen}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    onSearch={handleSearch}
                    onKeyPress={handleKeyPress}
                    onClearSearch={handleClearSearch}
                    isFilterOpen={isFilterOpen}
                    setIsFilterOpen={setIsFilterOpen}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    totalProducts={totalProducts}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    totalPages={Math.ceil(totalProducts / itemsPerPage)}
                    searchQuery={searchQuery}
                />

                <div className="flex gap-6">
                    <FillterSidebar
                        isFilterOpen={isFilterOpen}
                        selectedCategories={selectedCategories}
                        priceRange={priceRange}
                        availability={availability}
                        categories={categories}
                        toggleCategory={toggleCategory}
                        setPriceRange={setPriceRange}
                        setAvailability={setAvailability}
                        clearAllFilters={clearAllFilters}
                    />

                    <div className="flex-1">
                        <ProductSection
                            filteredProducts={getPaginatedProducts()}
                            searchQuery={searchQuery}
                            selectedCategories={selectedCategories}
                            categories={categories}
                            toggleCategory={toggleCategory}
                            clearAllFilters={clearAllFilters}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>

            {isFilterOpen && (
                <MobileFilterDrawer
                    isFilterOpen={isFilterOpen}
                    setIsFilterOpen={setIsFilterOpen}
                    selectedCategories={selectedCategories}
                    priceRange={priceRange}
                    availability={availability}
                    categories={categories}
                    toggleCategory={toggleCategory}
                    setPriceRange={setPriceRange}
                    setAvailability={setAvailability}
                    clearAllFilters={clearAllFilters}
                />
            )}
        </div>
    );
}

export default ProductShop;
