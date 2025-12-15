import React, { useState } from "react";
import { Plus, Minus, Filter } from "lucide-react";

function FilterSidebar({
    isFilterOpen = false,
    selectedCategories = [],
    priceRange = [0, 300000],
    availability = "all",
    categories = [],
    toggleCategory = () => {},
    setPriceRange = () => {},
    setAvailability = () => {},
    clearAllFilters = () => {},
}) {
    const [expandedCategories, setExpandedCategories] = useState({});

    const toggleExpand = (categoryId) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    const categoryTree = categories.reduce((acc, category) => {
        if (category.level === 0) {
            if (!acc[category.id]) {
                acc[category.id] = { ...category, children: [] };
            }
        } else if (category.level === 1) {
            const parent = Object.values(acc).find(
                (cat) => cat.name === category.parent,
            );
            if (parent) {
                if (!parent.children.find((c) => c.id === category.id)) {
                    parent.children.push({ ...category, children: [] });
                }
            }
        } else if (category.level === 2) {
            Object.values(acc).forEach((parent) => {
                const child = parent.children.find(
                    (c) => c.name === category.parent,
                );
                if (child) {
                    if (!child.children.find((c) => c.id === category.id)) {
                        child.children.push(category);
                    }
                }
            });
        }
        return acc;
    }, {});

    const renderCategoryTree = (categoryList, level = 0) => {
        return categoryList.map((category) => {
            const hasChildren =
                category.children && category.children.length > 0;
            const isExpanded = expandedCategories[category.id];
            const isSelected = selectedCategories.includes(category.id);

            return (
                <div key={category.id} className={`${level > 0 ? "ml-4" : ""}`}>
                    <div className="flex items-center justify-between group py-1">
                        <button
                            onClick={() => toggleCategory(category.id)}
                            className={`flex-1 text-left px-2 py-1.5 rounded transition-all duration-200 ${
                                isSelected
                                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                                    : "hover:bg-gray-50 text-gray-700 border border-transparent"
                            }`}
                        >
                            <span
                                className={`text-sm ${
                                    level === 0
                                        ? "font-semibold"
                                        : level === 1
                                          ? "font-medium"
                                          : ""
                                } ${isSelected ? "text-blue-800" : "group-hover:text-gray-900"}`}
                            >
                                {category.name}
                            </span>
                        </button>

                        {hasChildren && (
                            <button
                                onClick={() => toggleExpand(category.id)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors duration-200 flex items-center justify-center w-6 h-6 ml-1 border border-gray-200"
                            >
                                {isExpanded ? (
                                    <Minus
                                        size={14}
                                        className="text-gray-500"
                                    />
                                ) : (
                                    <Plus size={14} className="text-gray-500" />
                                )}
                            </button>
                        )}
                    </div>

                    {hasChildren && isExpanded && (
                        <div className="mt-1">
                            {renderCategoryTree(category.children, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div
            className={`lg:w-64 flex-shrink-0 ${isFilterOpen ? "block" : "hidden lg:block"}`}
        >
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-blue-600" />
                        <h2 className="font-semibold text-gray-900 text-lg">
                            Filters
                        </h2>
                    </div>
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors duration-200"
                    >
                        Clear All
                    </button>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3 text-sm">
                        Price Range
                    </h3>
                    <div className="space-y-3">
                        <div className="relative">
                            <input
                                type="range"
                                min="0"
                                max="300000"
                                step="1000"
                                value={priceRange[0]}
                                onChange={(e) =>
                                    setPriceRange([
                                        parseInt(e.target.value),
                                        priceRange[1],
                                    ])
                                }
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type="range"
                                min="0"
                                max="300000"
                                step="1000"
                                value={priceRange[1]}
                                onChange={(e) =>
                                    setPriceRange([
                                        priceRange[0],
                                        parseInt(e.target.value),
                                    ])
                                }
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        <div className="flex justify-between text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                            <span className="font-medium">
                                Rs. {priceRange[0].toLocaleString()}
                            </span>
                            <span className="text-gray-400">to</span>
                            <span className="font-medium">
                                Rs. {priceRange[1].toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3 text-sm">
                        Categories
                    </h3>
                    <div className="space-y-1 max-h-96 overflow-y-auto">
                        {categories.length > 0 ? (
                            renderCategoryTree(Object.values(categoryTree))
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4">
                                No categories available
                            </p>
                        )}
                    </div>
                </div>
                <div className="mb-2">
                    <h3 className="font-medium text-gray-900 mb-3 text-sm">
                        Availability
                    </h3>
                    <div className="space-y-2">
                        {[
                            { value: "all", label: "All Products" },
                            { value: "in-stock", label: "In Stock" },
                            { value: "out-of-stock", label: "Out of Stock" },
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setAvailability(option.value)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 border ${
                                    availability === option.value
                                        ? "bg-blue-100 text-blue-800 border-blue-300 font-medium"
                                        : "text-gray-700 hover:bg-gray-50 border-gray-200"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {(selectedCategories.length > 0 || availability !== "all") && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-800 font-medium mb-1">
                            Active Filters:
                        </p>
                        <div className="text-xs text-blue-700">
                            {selectedCategories.length > 0 && (
                                <span>
                                    {selectedCategories.length} categor
                                    {selectedCategories.length === 1
                                        ? "y"
                                        : "ies"}
                                </span>
                            )}
                            {selectedCategories.length > 0 &&
                                availability !== "all" && <span> • </span>}
                            {availability !== "all" && (
                                <span>
                                    {availability === "in-stock"
                                        ? "In Stock"
                                        : "Out of Stock"}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FilterSidebar;
