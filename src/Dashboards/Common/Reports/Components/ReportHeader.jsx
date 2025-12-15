import React from "react";
import { RefreshCw } from "lucide-react";

const ReportHeader = ({ loading, onRefresh }) => {
    return (
        <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Reports & Analytics
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Comprehensive insights into your ecommerce performance
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                        />
                        {loading ? "Loading..." : "Refresh"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportHeader;
