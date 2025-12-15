import React from "react";
import { Search, X } from "lucide-react";
import QuoteProductCard from "./QuoteProductCard.jsx";

export default function QuoteProductSection({
    filteredProducts = [],
    searchQuery = "",
    selectedCategories = [],
    categories = [],
    toggleCategory = () => {},
    clearAllFilters = () => {},
    loading = false,
}) {
    return (
        <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                    {searchQuery && `Search results for "${searchQuery}"`}
                </p>

                <div className="flex flex-wrap gap-1">
                    {selectedCategories.map((categoryId) => {
                        const category = categories.find(
                            (cat) =>
                                cat.id == categoryId ||
                                String(cat.id) === String(categoryId),
                        );
                        return (
                            <span
                                key={categoryId}
                                className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                            >
                                {category
                                    ? category.name
                                    : `Category ${categoryId}`}
                                <button
                                    onClick={() => toggleCategory(categoryId)}
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        );
                    })}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-600 mt-3">Loading products...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-3">
                        <Search size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No products found
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                        Try adjusting your search or filters
                    </p>
                    <button
                        onClick={clearAllFilters}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                    >
                        Clear All Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                        <QuoteProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
