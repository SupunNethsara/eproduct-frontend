import React from "react";
import StatCard from "./StatCard";
import TrendingProductsSection from "./TrendingProductsSection";
import { TrendingUp, RefreshCw, Eye, Star } from "lucide-react";
const ProductViewsTab = ({
    mostViewedProducts,
    productsLoading,
    fetchMostViewedProducts,
}) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Product View Analytics
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Track product performance and customer engagement
                    </p>
                </div>
                <button
                    onClick={fetchMostViewedProducts}
                    disabled={productsLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    <RefreshCw
                        className={`w-4 h-4 ${productsLoading ? "animate-spin" : ""}`}
                    />
                    Refresh
                </button>
            </div>

            <TrendingProductsSection
                mostViewedProducts={mostViewedProducts}
                productsLoading={productsLoading}
                onRefresh={fetchMostViewedProducts}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Product Views"
                    value={mostViewedProducts
                        .reduce(
                            (sum, product) => sum + (product.total_views || 0),
                            0,
                        )
                        .toLocaleString()}
                    icon={Eye}
                    description="Across all products"
                    color="blue"
                />
                <StatCard
                    title="Average Views"
                    value={
                        mostViewedProducts.length > 0
                            ? Math.round(
                                  mostViewedProducts.reduce(
                                      (sum, product) =>
                                          sum + (product.total_views || 0),
                                      0,
                                  ) / mostViewedProducts.length,
                              ).toLocaleString()
                            : "0"
                    }
                    icon={TrendingUp}
                    description="Per product"
                    color="green"
                />
                <StatCard
                    title="Top Product Views"
                    value={
                        mostViewedProducts.length > 0
                            ? mostViewedProducts[0]?.total_views?.toLocaleString() ||
                              "0"
                            : "0"
                    }
                    icon={Star}
                    description="Most viewed product"
                    color="yellow"
                />
            </div>
        </div>
    );
};

export default ProductViewsTab;
