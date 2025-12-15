import React from "react";
import { Star, MoreVertical, Edit, Trash2 } from "lucide-react";
import StarRating from "./StarRating";

const ReviewsList = ({
    reviews,
    currentUserId,
    onEdit,
    onDelete,
    loading = false,
}) => {
    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                <div className="h-3 bg-gray-200 rounded w-32"></div>
                            </div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Star size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No reviews yet
                </h3>
                <p className="text-gray-500">
                    Be the first to review this product!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="bg-white rounded-lg border border-gray-200 p-6"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {review.user?.name
                                    ? review.user.name.charAt(0).toUpperCase()
                                    : "U"}
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">
                                    {review.user?.name || "Anonymous User"}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {new Date(
                                        review.created_at,
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>
                        </div>

                        {currentUserId === review.user_id && (
                            <div className="relative group">
                                <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                                    <MoreVertical size={16} />
                                </button>
                                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <button
                                        onClick={() => onEdit(review)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                    >
                                        <Edit size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(review)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <StarRating rating={review.rating} readonly size={16} />
                    </div>

                    {review.title && (
                        <h4 className="font-semibold text-gray-900 mb-2">
                            {review.title}
                        </h4>
                    )}

                    {review.comment && (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {review.comment}
                        </p>
                    )}

                    {review.is_verified && (
                        <div className="flex items-center gap-1 mt-3 text-sm text-green-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            Verified Purchase
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReviewsList;
