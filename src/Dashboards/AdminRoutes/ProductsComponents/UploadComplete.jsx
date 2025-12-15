import React from "react";

const UploadComplete = ({ onReset, onViewProducts }) => {
    return (
        <div className="text-center py-8">
            <div className="mb-4">
                <svg
                    className="mx-auto h-16 w-16 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 48 48"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm-4.293 28.293l-8-8 2.828-2.828 5.172 5.172 11.172-11.172 2.828 2.828-14 14z"
                    />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
                Upload Complete!
            </h3>
            <p className="text-gray-600 mb-6">
                All products have been successfully uploaded to the database.
            </p>
            <div className="flex justify-center space-x-4">
                <button
                    onClick={onReset}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                    Upload More Products
                </button>
                <button
                    onClick={onViewProducts}
                    className="bg-gray-600 text-white px-6 py-2 rounded-md font-medium hover:bg-gray-700 transition-colors"
                >
                    View Products
                </button>
            </div>
        </div>
    );
};

export default UploadComplete;
