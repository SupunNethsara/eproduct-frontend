import React from "react";
import { X } from "lucide-react";

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to perform this action?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "default",
}) => {
    if (!isOpen) return null;

    const confirmButtonClass =
        type === "danger"
            ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
            : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${confirmButtonClass}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
