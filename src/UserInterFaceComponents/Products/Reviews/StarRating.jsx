import React from "react";
import { Star } from "lucide-react";

const StarRating = ({
    rating,
    onRatingChange,
    size = 20,
    readonly = false,
    showLabel = false,
}) => {
    const handleClick = (newRating) => {
        if (!readonly && onRatingChange) {
            onRatingChange(newRating);
        }
    };

    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <button
                key={i}
                type="button"
                onClick={() => handleClick(i)}
                disabled={readonly}
                className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
            >
                <Star
                    size={size}
                    className={`${
                        i <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                    } transition-colors`}
                />
            </button>,
        );
    }

    return (
        <div className="flex items-center gap-1">
            <div className="flex">{stars}</div>
            {showLabel && (
                <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
            )}
        </div>
    );
};

export default StarRating;
