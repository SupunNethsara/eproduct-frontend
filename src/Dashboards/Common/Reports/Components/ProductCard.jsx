import React from "react";
import { ShoppingCart, Eye, Star, ExternalLink } from "lucide-react";

const ProductCard = ({ product, rank }) => {
    const images = product.images ? JSON.parse(product.images) : [];
    const mainImage = images[0] || product.image;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            rank === 1
                                ? "bg-yellow-500"
                                : rank === 2
                                  ? "bg-gray-400"
                                  : rank === 3
                                    ? "bg-orange-500"
                                    : "bg-blue-500"
                        }`}
                    >
                        {rank}
                    </div>
                </div>

                <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden">
                        {mainImage ? (
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {product.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {product.category?.name}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center gap-1">
                                    <Eye className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs font-medium text-gray-700">
                                        {product.total_views?.toLocaleString()}{" "}
                                        views
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-400" />
                                    <span className="text-xs text-gray-600">
                                        {product.average_rating || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-100 rounded">
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold text-green-600">
                                Rs. {parseFloat(product.price).toLocaleString()}
                            </span>
                        </div>
                        <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                product.availability > 10
                                    ? "bg-green-100 text-green-800"
                                    : product.availability > 0
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                            }`}
                        >
                            {product.availability > 0
                                ? `${product.availability} in stock`
                                : "Out of stock"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
