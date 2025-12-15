import React from "react";
import StarRating from "./StarRating";

const RatingSummary = ({ averageRating, totalReviews, ratingDistribution }) => {
    const getPercentage = (count) => {
        return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    };

    const distribution = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: ratingDistribution[rating] || 0,
        percentage: getPercentage(ratingDistribution[rating] || 0),
    }));

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Customer Reviews
            </h3>

            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-1">
                        {averageRating.toFixed(1)}
                    </div>
                    <div className="mb-2">
                        <StarRating rating={averageRating} readonly size={20} />
                    </div>
                    <div className="text-sm text-gray-600">
                        {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                    </div>
                </div>

                <div className="flex-1 space-y-2 min-w-0">
                    {distribution.map(({ rating, count, percentage }) => (
                        <div
                            key={rating}
                            className="flex items-center gap-3 text-sm"
                        >
                            <span className="text-gray-600 w-8">
                                {rating} star
                            </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="text-gray-500 w-12 text-right">
                                {count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RatingSummary;
