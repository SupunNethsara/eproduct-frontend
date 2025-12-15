import React from "react";
import { BarChart3, ShoppingCart, FileText, Eye } from "lucide-react";

const TabNavigation = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: "overview", label: "Overview", icon: BarChart3 },
        { id: "orders", label: "Orders", icon: ShoppingCart },
        { id: "quotations", label: "Quotations", icon: FileText },
        { id: "product-views", label: "Product Views", icon: Eye },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.id
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default TabNavigation;
