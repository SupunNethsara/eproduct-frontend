import React from "react";
import { X } from "lucide-react";

function MobileFilterDrawer({
    setIsFilterOpen,
    selectedCategories,
    priceRange,
    availability,
    categories,
    toggleCategory,
    setPriceRange,
    setAvailability,
    clearAllFilters,
}) {
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
        return categoryList.map((category) => (
            <div key={category.id} className={`${level > 0 ? "ml-4" : ""}`}>
                <label className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-4 h-4"
                    />
                    <span
                        className={`text-sm text-gray-700 ${
                            level === 0
                                ? "font-semibold"
                                : level === 1
                                  ? "font-medium"
                                  : "text-gray-600"
                        }`}
                    >
                        {category.name}
                    </span>
                </label>
                {/* Render children recursively */}
                {category.children && category.children.length > 0 && (
                    <div className="mt-1">
                        {renderCategoryTree(category.children, level + 1)}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={() => setIsFilterOpen(false)}
        >
            <div
                className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Filters</h2>
                        <button
                            onClick={() => setIsFilterOpen(false)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-gray-900 mb-3 text-sm">
                                Price Range
                            </h3>
                            <div className="space-y-2">
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
                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                />
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>Rs. 0</span>
                                    <span>
                                        Rs. {priceRange[1].toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 mb-3 text-sm">
                                Categories
                            </h3>
                            <div className="space-y-1 max-h-60 overflow-y-auto">
                                {categories.length > 0 ? (
                                    renderCategoryTree(
                                        Object.values(categoryTree),
                                    )
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No categories available
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 mb-3 text-sm">
                                Availability
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { value: "all", label: "All Products" },
                                    { value: "in-stock", label: "In Stock" },
                                    {
                                        value: "out-of-stock",
                                        label: "Out of Stock",
                                    },
                                ].map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="availability-mobile"
                                            value={option.value}
                                            checked={
                                                availability === option.value
                                            }
                                            onChange={(e) =>
                                                setAvailability(e.target.value)
                                            }
                                            className="text-green-600 focus:ring-green-500 w-4 h-4"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            onClick={clearAllFilters}
                            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Clear All Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MobileFilterDrawer;
