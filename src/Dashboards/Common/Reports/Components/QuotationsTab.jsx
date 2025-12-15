import React from "react";
import { FileText } from "lucide-react";

const QuotationsTab = () => {
    return (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-3">
                Quotation Reports
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
                Quotation tracking and analytics will be available once the
                quotation system is implemented.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                Coming Soon
            </div>
        </div>
    );
};

export default QuotationsTab;
