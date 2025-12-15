import React from "react";

const UploadProgress = ({ uploadProgress, loading, onBack, onUpload }) => {
    return (
        <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                    <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-green-800 font-medium">
                        Files validated successfully! Ready to upload all
                        products.
                    </span>
                </div>
            </div>

            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready to Upload Products
                </h3>
            </div>

            {uploadProgress > 0 && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Uploading products...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-green-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <div className="flex justify-between">
                <button
                    onClick={onBack}
                    className="text-gray-600 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                    Back to Validation
                </button>
                <button
                    onClick={onUpload}
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? "Uploading..." : `Upload Products `}
                </button>
            </div>
        </div>
    );
};

export default UploadProgress;
