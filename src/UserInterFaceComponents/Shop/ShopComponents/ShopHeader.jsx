import React from "react";
import {
    ChevronDown,
    Filter,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

function ShopHeader({
    sortOptions,
    sortBy,
    setSortBy,
    isSortOpen,
    setIsSortOpen,
    searchInput,
    setSearchInput,
    onSearch,
    onClearSearch,
    isFilterOpen,
    setIsFilterOpen,
    itemsPerPage,
    onItemsPerPageChange,
    totalProducts,
    currentPage,
    onPageChange,
    totalPages,
}) {
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
    };

    const handleSearchClick = () => {
        onSearch();
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            onSearch();
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
                <div className="flex-1 w-full lg:max-w-md">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search products, brands, categories..."
                            value={searchInput}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            className="w-full pl-10 pr-20 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        {searchInput && (
                            <button
                                onClick={onClearSearch}
                                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={18} />
                            </button>
                        )}
                        <button
                            onClick={handleSearchClick}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm"
                        >
                            Search
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                            Show:
                        </span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) =>
                                onItemsPerPageChange(e.target.value)
                            }
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="12">12</option>
                            <option value="24">24</option>
                            <option value="36">36</option>
                            <option value="48">48</option>
                        </select>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 min-w-[160px] justify-between"
                        >
                            <span className="text-sm">
                                {
                                    sortOptions.find(
                                        (opt) => opt.value === sortBy,
                                    )?.label
                                }
                            </span>
                            <ChevronDown
                                size={16}
                                className={`transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {isSortOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setSortBy(option.value);
                                            setIsSortOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200 ${
                                            sortBy === option.value
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-gray-700"
                                        } first:rounded-t-lg last:rounded-b-lg`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 lg:hidden"
                    >
                        <Filter size={18} />
                        <span className="text-sm">Filters</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                    {totalProducts > 0 ? (
                        <>
                            Showing{" "}
                            <span className="font-semibold">
                                {(currentPage - 1) * itemsPerPage + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-semibold">
                                {Math.min(
                                    currentPage * itemsPerPage,
                                    totalProducts,
                                )}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold">
                                {totalProducts}
                            </span>{" "}
                            products
                            {searchInput && (
                                <span className="ml-2 text-blue-600">
                                    for "{searchInput}"
                                </span>
                            )}
                        </>
                    ) : (
                        "No products found"
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                        >
                            <ChevronLeft size={16} />
                            <span>Previous</span>
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from(
                                { length: Math.min(5, totalPages) },
                                (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() =>
                                                onPageChange(pageNum)
                                            }
                                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                                currentPage === pageNum
                                                    ? "bg-blue-600 text-white border border-blue-600"
                                                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                },
                            )}

                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <span className="px-2 text-gray-400">...</span>
                            )}

                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <button
                                    onClick={() => onPageChange(totalPages)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                        currentPage === totalPages
                                            ? "bg-blue-600 text-white border border-blue-600"
                                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    {totalPages}
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                        >
                            <span>Next</span>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ShopHeader;
