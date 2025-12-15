import React from "react";

const CancelOrderModal = ({ order, onClose, onConfirm, reason, setReason }) => {
    const getTimeRemaining = (order) => {
        const orderCreationTime = new Date(order.created_at);
        const currentTime = new Date();
        const timeDifference = Math.floor(
            (currentTime - orderCreationTime) / (1000 * 60),
        );
        const maxCancellationTime = 60;
        const timeRemaining = maxCancellationTime - timeDifference;
        return timeRemaining > 0 ? timeRemaining : 0;
    };

    const timeRemaining = getTimeRemaining(order);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (reason.trim()) {
            onConfirm();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Cancel Order
                    </h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <svg
                                    className="w-5 h-5 text-yellow-600 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                                <p className="text-sm text-yellow-800">
                                    You have {timeRemaining} minutes remaining
                                    to cancel this order
                                </p>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="cancelReason"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Reason for cancellation *
                            </label>
                            <textarea
                                id="cancelReason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-colors"
                                placeholder="Please provide a reason for cancelling this order..."
                                maxLength={500}
                                autoFocus
                            />
                            <div className="text-right text-sm text-gray-500 mt-1">
                                {reason.length}/500
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 p-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Keep Order
                        </button>
                        <button
                            type="submit"
                            disabled={!reason.trim()}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            Confirm Cancellation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CancelOrderModal;
