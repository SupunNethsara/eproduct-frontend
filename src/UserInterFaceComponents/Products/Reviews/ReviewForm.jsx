import React, { useState } from "react";
import { X, Send } from "lucide-react";
import StarRating from "./StarRating";
import useToast from "../../Common/useToast.jsx";

const ReviewForm = ({ product, existingReview, onSuccess, onCancel }) => {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [title, setTitle] = useState(existingReview?.title || "");
    const [comment, setComment] = useState(existingReview?.comment || "");
    const [submitting, setSubmitting] = useState(false);
    const { success, error: showError } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            showError("Please select a rating");
            return;
        }

        setSubmitting(true);
        try {
            const url = existingReview
                ? `http://127.0.0.1:8000/api/products/${product.id}/reviews/${existingReview.id}`
                : `http://127.0.0.1:8000/api/products/${product.id}/reviews`;

            const method = existingReview ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ rating, title, comment }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to submit review");
            }

            const result = await response.json();
            success(
                existingReview
                    ? "Review updated successfully!"
                    : "Review submitted successfully!",
            );
            onSuccess(result);
        } catch (error) {
            showError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {existingReview ? "Edit Review" : "Write a Review"}
                    </h3>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Rating *
                        </label>
                        <StarRating
                            rating={rating}
                            onRatingChange={setRating}
                            size={28}
                        />
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Summarize your experience"
                            maxLength={255}
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                            placeholder="Share details of your experience with this product..."
                            maxLength={1000}
                        />
                        <div className="text-right text-sm text-gray-500 mt-1">
                            {comment.length}/1000
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
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
                                    {existingReview
                                        ? "Updating..."
                                        : "Submitting..."}
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    {existingReview
                                        ? "Update Review"
                                        : "Submit Review"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewForm;
