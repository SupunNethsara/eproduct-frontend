import React from "react";
import { TrendingUp, RefreshCw, Eye } from "lucide-react";
import ProductCard from "./ProductCard";

const TrendingProductsSection = ({
    mostViewedProducts,
    productsLoading,
    onRefresh,
}) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Most Viewed Products
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                        Top performing products by view count
                    </p>
                </div>
                <button
                    onClick={onRefresh}
                    disabled={productsLoading}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <RefreshCw
                        className={`w-4 h-4 ${productsLoading ? "animate-spin" : ""}`}
                    />
                    Refresh
                </button>
            </div>

            {productsLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 rounded-xl p-4 h-24"></div>
                        </div>
                    ))}
                </div>
            ) : mostViewedProducts.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                    {mostViewedProducts.slice(0, 6).map((product, index) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            rank={index + 1}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <Eye className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <h4 className="text-gray-500 font-medium">
                        No product views data available
                    </h4>
                    <p className="text-gray-400 text-sm mt-1">
                        Product views will appear here once customers start
                        browsing
                    </p>
                </div>
            )}

            {mostViewedProducts.length > 6 && (
                <div className="mt-6 text-center">
                    <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View All Products
                    </button>
                </div>
            )}
        </div>
    );
};

export default TrendingProductsSection;
