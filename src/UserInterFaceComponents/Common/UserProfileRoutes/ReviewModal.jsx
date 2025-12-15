import React, { useState } from "react";

const ReviewModal = ({
    product,
    onClose,
    onSubmit,
    submitting,
    showError,
    success,
}) => {
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) {
            showError("Please select a rating", "Rating Required");
            return;
        }

        onSubmit({
            rating,
            title: title || null,
            comment: comment || null,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Write a Review
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={submitting}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-lg">
                        <img
                            src={product?.image}
                            alt={product?.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                                e.target.src =
                                    "https://via.placeholder.com/80x80?text=No+Image";
                            }}
                        />
                        <div>
                            <h3 className="font-medium text-gray-900">
                                {product?.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Model: {product?.model}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Rating *
                            </label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="text-2xl focus:outline-none transition-transform hover:scale-110"
                                        disabled={submitting}
                                    >
                                        {star <= rating ? "⭐" : "☆"}
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                {rating} out of 5 stars
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Review Title (Optional)
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                placeholder="Summarize your experience"
                                maxLength={255}
                                disabled={submitting}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="comment"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Your Review (Optional)
                            </label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-colors"
                                placeholder="Share details of your experience with this product..."
                                maxLength={1000}
                                disabled={submitting}
                            />
                            <div className="text-right text-sm text-gray-500 mt-1">
                                {comment.length}/1000
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || rating === 0}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Review"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
